import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowPathIcon, 
  Cog6ToothIcon, 
  BoltIcon, 
  InformationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import type { ExperimentData, ExperimentResult } from '../types/experiment';

interface CardiacActionPotentialSimulatorProps {
  onDataChange: (data: ExperimentData) => void;
  onRun: () => void;
  results: ExperimentResult | null;
  isRunning: boolean;
}

const CardiacActionPotentialSimulator = ({
  onRun,
  isRunning
}: CardiacActionPotentialSimulatorProps) => {
  const [time, setTime] = useState(0);
  const [data, setData] = useState<Array<{time: number, voltage: number, stimulated: boolean}>>([]);
  const [drugs, setDrugs] = useState({
    TTX: { concentration: 0, active: false },
    verapamil: { concentration: 0, active: false },
    diltiazem: { concentration: 0, active: false }
  });
  const [cellType, setCellType] = useState('ventricular'); // ventricular vs atrial
  const [stimulationRate, setStimulationRate] = useState(1); // Hz
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x real time
  const [pharmacologyCollapsed, setPharmacologyCollapsed] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const lastUpdateTime = useRef(0);

  // Parametry podstawowe z dokumentu
  const baseParams = {
    ventricular: {
      restingPotential: -90,
      thresholdPotential: -65,
      overshootPeak: 35,
      apd90: 300 // Action potential duration at 90% repolarization
    },
    atrial: {
      restingPotential: -80,
      thresholdPotential: -65,
      overshootPeak: 30,
      apd90: 200
    }
  };

  // Model farmakodynamiczny
  const calculateDrugEffect = useCallback((drug: string, concentration: number) => {
    const drugModels: Record<string, {IC50: number, hillCoeff: number, maxBlock: number}> = {
      TTX: { IC50: 0.01, hillCoeff: 1, maxBlock: 0.95 },
      verapamil: { IC50: 0.1, hillCoeff: 1, maxBlock: 0.85 },
      diltiazem: { IC50: 0.05, hillCoeff: 1.2, maxBlock: 0.80 }
    };
    
    const model = drugModels[drug];
    if (!model || concentration === 0) return 1;
    
    const fraction = Math.pow(concentration, model.hillCoeff) / 
                    (Math.pow(model.IC50, model.hillCoeff) + Math.pow(concentration, model.hillCoeff));
    return 1 - (model.maxBlock * fraction);
  }, []);

  // Model potencjału czynnościowego
  const calculateActionPotential = useCallback((t: number, stimulated: boolean) => {
    const params = baseParams[cellType as keyof typeof baseParams];
    const cycleDuration = 1000 / stimulationRate; // ms
    const timeInCycle = t % cycleDuration;
    
    if (!stimulated && timeInCycle > params.apd90) {
      return params.restingPotential;
    }

    // Efekty leków
    const naBlock = drugs.TTX.active ? calculateDrugEffect('TTX', drugs.TTX.concentration) : 1;
    const caBlockVer = drugs.verapamil.active ? calculateDrugEffect('verapamil', drugs.verapamil.concentration) : 1;
    const caBlockDil = drugs.diltiazem.active ? calculateDrugEffect('diltiazem', drugs.diltiazem.concentration) : 1;
    const caBlock = caBlockVer * caBlockDil;

    let voltage = params.restingPotential;

    if (timeInCycle <= 2) {
      // Faza 0 - Depolaryzacja Na+
      const naEffect = naBlock;
      const depolarizationRate = 50 * naEffect;
      voltage = params.restingPotential + (params.overshootPeak - params.restingPotential) * 
                (1 - Math.exp(-timeInCycle * depolarizationRate / 10));
    } else if (timeInCycle <= 7) {
      // Faza 1 - Wstępna repolaryzacja K+
      const t1 = timeInCycle - 2;
      voltage = params.overshootPeak * naBlock - t1 * 5;
    } else if (timeInCycle <= 200) {
      // Faza 2 - Plateau Ca2+
      const t2 = timeInCycle - 7;
      const plateauLevel = 10 * caBlock;
      const decay = Math.exp(-t2 / 100);
      voltage = plateauLevel + (params.overshootPeak * naBlock - plateauLevel - 25) * decay;
    } else if (timeInCycle <= 300) {
      // Faza 3 - Repolaryzacja K+
      const t3 = timeInCycle - 200;
      const startVoltage = 10 * caBlock;
      voltage = startVoltage + (params.restingPotential - startVoltage) * 
                (1 - Math.exp(-t3 / 30));
    } else {
      // Faza 4 - Spoczynek
      voltage = params.restingPotential;
    }

    return Math.round(voltage * 10) / 10;
  }, [cellType, stimulationRate, drugs, calculateDrugEffect]);

  // Symulacja z użyciem requestAnimationFrame dla lepszej wydajności
  const animate = useCallback((currentTime: number) => {
    if (!isRunning) return;

    // Inicjalizacja lastUpdateTime jeśli to pierwszy frame
    if (lastUpdateTime.current === 0) {
      lastUpdateTime.current = currentTime;
    }

    // Sprawdź czy minęło wystarczająco czasu (60 FPS = ~16.67ms)
    if (currentTime - lastUpdateTime.current >= 16) {
      setTime(prevTime => {
        const newTime = prevTime + simulationSpeed;
        const cycleDuration = 1000 / stimulationRate;
        const shouldStimulate = newTime % cycleDuration < 5;
        
        const voltage = calculateActionPotential(newTime, shouldStimulate);
        
        setData(prevData => {
          const newData = [...prevData, { time: newTime, voltage, stimulated: shouldStimulate }];
          // Ogranicz do 1000 punktów dla lepszej wydajności
          return newData.length > 1000 ? newData.slice(-1000) : newData;
        });
        
        return newTime;
      });
      
      // Aktualizuj lastUpdateTime tylko po udanym update
      lastUpdateTime.current = currentTime;
    }

    // Kontynuuj animację
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isRunning, simulationSpeed, stimulationRate, calculateActionPotential]);

  useEffect(() => {
    if (isRunning) {
      // Reset lastUpdateTime gdy symulacja się rozpoczyna
      lastUpdateTime.current = 0;
      animationFrameRef.current = requestAnimationFrame(animate);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isRunning, animate]);

  const handleReset = () => {
    // Zatrzymaj symulację
    onRun(); // This will stop the simulation via parent
    
    // Reset stanu
    setTime(0);
    setData([]);
    
    // Reset timing state
    lastUpdateTime.current = 0;
    
    // Upewnij się, że animation frame jest wyczyszczony
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const handleDrugChange = (drugName: string, field: string, value: string | boolean) => {
    setDrugs(prev => ({
      ...prev,
      [drugName]: {
        ...prev[drugName as keyof typeof prev],
        [field]: field === 'concentration' ? parseFloat(value as string) || 0 : value
      }
    }));
  };

  const currentVoltage = data.length > 0 ? data[data.length - 1].voltage : baseParams[cellType as keyof typeof baseParams].restingPotential;
  const isStimulated = data.length > 0 ? data[data.length - 1].stimulated : false;

  // Calculate current phase
  const getCurrentPhase = () => {
    if (data.length === 0) return 'Faza 4 (Spoczynek)';
    const cycleDuration = 1000 / stimulationRate;
    const timeInCycle = time % cycleDuration;
    
    if (timeInCycle <= 2) return 'Faza 0 (Depolaryzacja)';
    if (timeInCycle <= 7) return 'Faza 1 (Wst. repolaryzacja)';
    if (timeInCycle <= 200) return 'Faza 2 (Plateau)';
    if (timeInCycle <= 300) return 'Faza 3 (Repolaryzacja)';
    return 'Faza 4 (Spoczynek)';
  };

  // Dark mode detection
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <div className="flex flex-col gap-6">
      {/* Desktop: 2-column grid, Mobile: 1-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Simulation Control Card - 1 column width */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <Cog6ToothIcon className="h-5 w-5 text-emerald-500" />
            Kontrola Symulacji
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={onRun}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <PauseIcon className="h-4 w-4" />
                    Zatrzymaj
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4" />
                    Start
                  </>
                )}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium transition-colors"
              >
                <ArrowPathIcon className="h-4 w-4" />
                Reset
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Typ komórki:</label>
              <select
                value={cellType}
                onChange={(e) => setCellType(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="ventricular">Komorowa (-90mV)</option>
                <option value="atrial">Przedsionkowa (-80mV)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Częstotliwość: {stimulationRate} Hz
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={stimulationRate}
                  onChange={(e) => setStimulationRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Prędkość: {simulationSpeed}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Status Card - 1 column width */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <BoltIcon className={`h-5 w-5 ${isStimulated ? 'text-yellow-500' : 'text-gray-400'}`} />
            Status Aktualny
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Potencjał błonowy:</span>
              <span className={`font-bold text-lg ${currentVoltage > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`}>
                {currentVoltage.toFixed(1)} mV
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Czas:</span>
              <span className="text-gray-900 dark:text-gray-100">{(time / 1000).toFixed(2)} s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Stymulacja:</span>
              <span className={`font-bold ${isStimulated ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {isStimulated ? 'AKTYWNA' : 'nieaktywna'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Aktualna faza:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400 text-sm">{getCurrentPhase()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700 dark:text-gray-300">Typ komórki:</span>
              <span className="capitalize text-gray-900 dark:text-gray-100">{cellType === 'ventricular' ? 'Komorowa' : 'Przedsionkowa'}</span>
            </div>
          </div>
        </div>

        {/* Chart Card - 2 columns width */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
            📈 Potencjał czynnościowy w czasie rzeczywistym
          </h3>
          
          <div className="h-64 md:h-96 w-full">
            <svg width="100%" height="100%" viewBox="0 0 800 300">
              <defs>
                <linearGradient id="voltageGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8"/>
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.6"/>
                  <stop offset="100%" stopColor="#1e40af" stopOpacity="0.4"/>
                </linearGradient>
              </defs>
              
              {/* Siatka */}
              <g stroke={isDarkMode ? "#374151" : "#e5e7eb"} strokeWidth="1" opacity="0.5">
                {/* Linie poziome */}
                {[-100, -75, -50, -25, 0, 25, 50].map(voltage => {
                  const y = 150 - (voltage * 150 / 125);
                  return (
                    <g key={voltage}>
                      <line x1="60" y1={y} x2="760" y2={y} />
                      <text x="50" y={y + 4} fontSize="10" textAnchor="end" fill={isDarkMode ? "#9ca3af" : "#6b7280"}>
                        {voltage}mV
                      </text>
                    </g>
                  );
                })}
                {/* Linie pionowe co 100ms */}
                {Array.from({length: 8}, (_, i) => i * 100).map(t => {
                  const x = 60 + (t * 700 / 800);
                  return (
                    <g key={t}>
                      <line x1={x} y1="20" x2={x} y2="280" />
                      <text x={x} y="295" fontSize="10" textAnchor="middle" fill={isDarkMode ? "#9ca3af" : "#6b7280"}>
                        {t}ms
                      </text>
                    </g>
                  );
                })}
              </g>
              
              {/* Oś X i Y */}
              <g stroke={isDarkMode ? "#d1d5db" : "#374151"} strokeWidth="2">
                <line x1="60" y1="20" x2="60" y2="280" />
                <line x1="60" y1="280" x2="760" y2="280" />
              </g>
              
              {/* Dane */}
              {data.length > 1 && (
                <path
                  d={data.slice(-800).map((point, index) => {
                    const x = 60 + (index * 700 / 800);
                    const y = 150 - (point.voltage * 150 / 125);
                    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="url(#voltageGradient)"
                  strokeWidth="2"
                />
              )}
              
              {/* Znaczniki stymulacji */}
              {data.slice(-800).map((point, index) => {
                if (!point.stimulated) return null;
                const x = 60 + (index * 700 / 800);
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy="30"
                    r="3"
                    fill="#fbbf24"
                    stroke="#f59e0b"
                    strokeWidth="1"
                  />
                );
              })}
              
              {/* Etykiety faz */}
              <g fontSize="12" fill={isDarkMode ? "#d1d5db" : "#4b5563"} textAnchor="middle">
                <text x="100" y="15">Faza 0</text>
                <text x="150" y="15">Faza 1</text>
                <text x="300" y="15">Faza 2 (Plateau)</text>
                <text x="500" y="15">Faza 3</text>
                <text x="650" y="15">Faza 4</text>
              </g>
            </svg>
          </div>
          
          {/* Legenda */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-blue-600 rounded"></div>
              <span className="text-gray-700 dark:text-gray-300">Potencjał błonowy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500"></div>
              <span className="text-gray-700 dark:text-gray-300">Stymulacja elektryczna</span>
            </div>
          </div>
        </div>

        {/* Chart Info Panel - 2 columns width */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-200">
            <InformationCircleIcon className="h-5 w-5 text-emerald-500" />
            Informacje o bieżącym wykresie
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Simulation Stats */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.length}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Punkty danych</div>
            </div>
            
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{simulationSpeed}x</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Prędkość</div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{(time / 1000).toFixed(1)}s</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Czas symulacji</div>
            </div>
            
            {/* Signal Analysis */}
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                {data.length > 0 ? Math.min(...data.slice(-100).map(d => d.voltage)).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Min. potencjał (mV)</div>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {data.length > 0 ? Math.max(...data.slice(-100).map(d => d.voltage)).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Max. potencjał (mV)</div>
            </div>
            
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {data.length > 0 ? (Math.max(...data.slice(-100).map(d => d.voltage)) - Math.min(...data.slice(-100).map(d => d.voltage))).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">Amplituda (mV)</div>
            </div>
          </div>
          
          {/* Active Drugs Row */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Aktywne leki:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(drugs).map(([drugName, drug]) => (
                drug.active && (
                  <div key={drugName} className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm font-medium">
                    {drugName}: {drug.concentration} μM
                  </div>
                )
              ))}
              {!Object.values(drugs).some(drug => drug.active) && (
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full text-sm">
                  Brak aktywnych leków
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pharmacology Panel - 1 column width, collapsible */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div 
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setPharmacologyCollapsed(!pharmacologyCollapsed)}
          >
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700 dark:text-gray-200">
              💊 Farmakologia
            </h3>
            {pharmacologyCollapsed ? (
              <ChevronDownIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronUpIcon className="h-5 w-5 text-gray-500" />
            )}
          </div>
          
          {!pharmacologyCollapsed && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Wpływ leków na kanały jonowe</p>
              
              {/* TTX */}
              <div className="border border-gray-200 dark:border-gray-600 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-red-600 dark:text-red-400 text-sm">Tetrodotoksyna (TTX)</label>
                  <input
                    type="checkbox"
                    checked={drugs.TTX.active}
                    onChange={(e) => handleDrugChange('TTX', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Blokuje kanały Na+, zmniejsza szybkość depolaryzacji (Faza 0)</p>
                <div>
                  <label className="block text-xs mb-1 text-gray-700 dark:text-gray-300">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={drugs.TTX.concentration}
                    onChange={(e) => handleDrugChange('TTX', 'concentration', e.target.value)}
                    disabled={!drugs.TTX.active}
                    className="w-full p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Verapamil */}
              <div className="border border-gray-200 dark:border-gray-600 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-purple-600 dark:text-purple-400 text-sm">Werapamil</label>
                  <input
                    type="checkbox"
                    checked={drugs.verapamil.active}
                    onChange={(e) => handleDrugChange('verapamil', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Blokuje kanały L-Ca2+, skraca plateau (Faza 2)</p>
                <div>
                  <label className="block text-xs mb-1 text-gray-700 dark:text-gray-300">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={drugs.verapamil.concentration}
                    onChange={(e) => handleDrugChange('verapamil', 'concentration', e.target.value)}
                    disabled={!drugs.verapamil.active}
                    className="w-full p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Diltiazem */}
              <div className="border border-gray-200 dark:border-gray-600 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-emerald-600 dark:text-emerald-400 text-sm">Diltiazem</label>
                  <input
                    type="checkbox"
                    checked={drugs.diltiazem.active}
                    onChange={(e) => handleDrugChange('diltiazem', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Blokuje kanały L-Ca2+, podobnie do werapamilu</p>
                <div>
                  <label className="block text-xs mb-1 text-gray-700 dark:text-gray-300">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={drugs.diltiazem.concentration}
                    onChange={(e) => handleDrugChange('diltiazem', 'concentration', e.target.value)}
                    disabled={!drugs.diltiazem.active}
                    className="w-full p-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phases Info Panel - 1 column width */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">📚 Fazy potencjału czynnościowego</h3>
          <div className="space-y-3 text-sm">
            <div className="border-l-4 border-red-500 pl-3">
              <h4 className="font-semibold text-red-600 dark:text-red-400">Faza 0</h4>
              <p className="text-gray-600 dark:text-gray-400">Depolaryzacja Na⁺<br/>Nadstrzał do +35mV</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-3">
              <h4 className="font-semibold text-orange-600 dark:text-orange-400">Faza 1</h4>
              <p className="text-gray-600 dark:text-gray-400">Wstępna repolaryzacja K⁺<br/>Spadek potencjału</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400">Faza 2</h4>
              <p className="text-gray-600 dark:text-gray-400">Plateau Ca²⁺<br/>Kanały L-type</p>
            </div>
            <div className="border-l-4 border-emerald-500 pl-3">
              <h4 className="font-semibold text-emerald-600 dark:text-emerald-400">Faza 3</h4>
              <p className="text-gray-600 dark:text-gray-400">Repolaryzacja K⁺<br/>Powrót do spoczynku</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-3">
              <h4 className="font-semibold text-gray-600 dark:text-gray-400">Faza 4</h4>
              <p className="text-gray-600 dark:text-gray-400">Potencjał spoczynkowy<br/>-90mV (komorowe)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardiacActionPotentialSimulator; 