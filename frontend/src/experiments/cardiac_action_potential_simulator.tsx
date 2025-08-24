import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'recharts';
import { Play, Pause, RotateCcw, Settings, Zap, Heart, ChevronDown, ChevronUp, Info } from 'lucide-react';

const CardiacActionPotentialSimulator = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [data, setData] = useState([]);
  const [drugs, setDrugs] = useState({
    TTX: { concentration: 0, active: false },
    verapamil: { concentration: 0, active: false },
    diltiazem: { concentration: 0, active: false }
  });
  const [cellType, setCellType] = useState('ventricular'); // ventricular vs atrial
  const [stimulationRate, setStimulationRate] = useState(1); // Hz
  const [simulationSpeed, setSimulationSpeed] = useState(1); // 1x real time
  const [pharmacologyCollapsed, setPharmacologyCollapsed] = useState(false);
  const intervalRef = useRef(null);
  const lastStimulus = useRef(0);

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
  const calculateDrugEffect = (drug, concentration) => {
    const drugModels = {
      TTX: { IC50: 0.01, hillCoeff: 1, maxBlock: 0.95 },
      verapamil: { IC50: 0.1, hillCoeff: 1, maxBlock: 0.85 },
      diltiazem: { IC50: 0.05, hillCoeff: 1.2, maxBlock: 0.80 }
    };
    
    const model = drugModels[drug];
    if (!model || concentration === 0) return 1;
    
    const fraction = Math.pow(concentration, model.hillCoeff) / 
                    (Math.pow(model.IC50, model.hillCoeff) + Math.pow(concentration, model.hillCoeff));
    return 1 - (model.maxBlock * fraction);
  };

  // Model potencjału czynnościowego
  const calculateActionPotential = (t, stimulated) => {
    const params = baseParams[cellType];
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
  };

  // Symulacja z uwzględnieniem prędkości
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prevTime => {
          const newTime = prevTime + simulationSpeed;
          const cycleDuration = 1000 / stimulationRate;
          const shouldStimulate = newTime % cycleDuration < 5; // Stymulacja przez pierwsze 5ms cyklu
          
          const voltage = calculateActionPotential(newTime, shouldStimulate);
          
          setData(prevData => {
            const newData = [...prevData, { time: newTime, voltage, stimulated: shouldStimulate }];
            return newData.length > 2000 ? newData.slice(-2000) : newData;
          });
          
          return newTime;
        });
      }, 1);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, stimulationRate, cellType, drugs, simulationSpeed]);

  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setData([]);
  };

  const handleDrugChange = (drugName, field, value) => {
    setDrugs(prev => ({
      ...prev,
      [drugName]: {
        ...prev[drugName],
        [field]: field === 'concentration' ? parseFloat(value) || 0 : value
      }
    }));
  };

  const currentVoltage = data.length > 0 ? data[data.length - 1].voltage : baseParams[cellType].restingPotential;
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

  return (
    <div className="w-full max-w-7xl mx-auto p-4 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
          <Heart className="text-red-500" />
          Symulator Potencjału Czynnościowego Kardiomiocytów
        </h1>
        <p className="text-gray-600 text-sm md:text-base">Interaktywny model wpływu leków na przewodnictwo elektryczne serca</p>
      </div>

      {/* Desktop: 2-column grid, Mobile: 1-column */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Simulation Control Card - 1 column width */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Settings className="text-blue-500" size={20} />
            Kontrola Symulacji
          </h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium ${
                  isRunning 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isRunning ? <Pause size={16} /> : <Play size={16} />}
                {isRunning ? 'Zatrzymaj' : 'Start'}
              </button>
              
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md font-medium"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Typ komórki:</label>
              <select
                value={cellType}
                onChange={(e) => setCellType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="ventricular">Komorowa (-90mV)</option>
                <option value="atrial">Przedsionkowa (-80mV)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Częstotliwość: {stimulationRate} Hz
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={stimulationRate}
                  onChange={(e) => setStimulationRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Prędkość: {simulationSpeed}x
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={simulationSpeed}
                  onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Simulation Status Card - 1 column width */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Zap className={`${isStimulated ? 'text-yellow-500' : 'text-gray-400'}`} size={20} />
            Status Aktualny
          </h3>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Potencjał błonowy:</span>
              <span className={`font-bold ${currentVoltage > 0 ? 'text-red-600' : 'text-blue-600'}`}>
                {currentVoltage.toFixed(1)} mV
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Czas:</span>
              <span>{(time / 1000).toFixed(2)} s</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Stymulacja:</span>
              <span className={`font-bold ${isStimulated ? 'text-green-600' : 'text-gray-600'}`}>
                {isStimulated ? 'AKTYWNA' : 'nieaktywna'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Aktualna faza:</span>
              <span className="font-bold text-purple-600 text-sm">{getCurrentPhase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Typ komórki:</span>
              <span className="capitalize">{cellType === 'ventricular' ? 'Komorowa' : 'Przedsionkowa'}</span>
            </div>
          </div>
        </div>

        {/* Chart Card - 2 columns width */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">📈 Potencjał czynnościowy w czasie rzeczywistym</h3>
          
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
              <g stroke="#e5e7eb" strokeWidth="1" opacity="0.5">
                {/* Linie poziome */}
                {[-100, -75, -50, -25, 0, 25, 50].map(voltage => {
                  const y = 150 - (voltage * 150 / 125);
                  return (
                    <g key={voltage}>
                      <line x1="60" y1={y} x2="760" y2={y} />
                      <text x="50" y={y + 4} fontSize="10" textAnchor="end" fill="#6b7280">
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
                      <text x={x} y="295" fontSize="10" textAnchor="middle" fill="#6b7280">
                        {t}ms
                      </text>
                    </g>
                  );
                })}
              </g>
              
              {/* Oś X i Y */}
              <g stroke="#374151" strokeWidth="2">
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
              <g fontSize="12" fill="#4b5563" textAnchor="middle">
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
              <span>Potencjał błonowy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-400 rounded-full border border-yellow-500"></div>
              <span>Stymulacja elektryczna</span>
            </div>
          </div>
        </div>

        {/* Chart Info Panel - 2 columns width */}
        <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Info className="text-indigo-500" size={20} />
            Informacje o bieżącym wykresie
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Simulation Stats */}
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{data.length}</div>
              <div className="text-xs text-gray-600">Punkty danych</div>
            </div>
            
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{simulationSpeed}x</div>
              <div className="text-xs text-gray-600">Prędkość</div>
            </div>
            
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{(time / 1000).toFixed(1)}s</div>
              <div className="text-xs text-gray-600">Czas symulacji</div>
            </div>
            
            {/* Signal Analysis */}
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                {data.length > 0 ? Math.min(...data.slice(-100).map(d => d.voltage)).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600">Min. potencjał (mV)</div>
            </div>
            
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {data.length > 0 ? Math.max(...data.slice(-100).map(d => d.voltage)).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600">Max. potencjał (mV)</div>
            </div>
            
            <div className="bg-indigo-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {data.length > 0 ? (Math.max(...data.slice(-100).map(d => d.voltage)) - Math.min(...data.slice(-100).map(d => d.voltage))).toFixed(0) : '-'}
              </div>
              <div className="text-xs text-gray-600">Amplituda (mV)</div>
            </div>
          </div>
          
          {/* Active Drugs Row */}
          <div className="mt-4 pt-3 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Aktywne leki:</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(drugs).map(([drugName, drug]) => (
                drug.active && (
                  <div key={drugName} className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {drugName}: {drug.concentration} μM
                  </div>
                )
              ))}
              {!Object.values(drugs).some(drug => drug.active) && (
                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  Brak aktywnych leków
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pharmacology Panel - 1 column width, collapsible */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div 
            className="flex items-center justify-between cursor-pointer mb-3"
            onClick={() => setPharmacologyCollapsed(!pharmacologyCollapsed)}
          >
            <h3 className="text-lg font-semibold flex items-center gap-2">
              💊 Farmakologia
            </h3>
            {pharmacologyCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </div>
          
          {!pharmacologyCollapsed && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Wpływ leków na kanały jonowe</p>
              
              {/* TTX */}
              <div className="border border-gray-200 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-red-600 text-sm">Tetrodotoksyna (TTX)</label>
                  <input
                    type="checkbox"
                    checked={drugs.TTX.active}
                    onChange={(e) => handleDrugChange('TTX', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2">Blokuje kanały Na+, zmniejsza szybkość depolaryzacji (Faza 0)</p>
                <div>
                  <label className="block text-xs mb-1">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={drugs.TTX.concentration}
                    onChange={(e) => handleDrugChange('TTX', 'concentration', e.target.value)}
                    disabled={!drugs.TTX.active}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Verapamil */}
              <div className="border border-gray-200 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-purple-600 text-sm">Werapamil</label>
                  <input
                    type="checkbox"
                    checked={drugs.verapamil.active}
                    onChange={(e) => handleDrugChange('verapamil', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2">Blokuje kanały L-Ca2+, skraca plateau (Faza 2)</p>
                <div>
                  <label className="block text-xs mb-1">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="2"
                    step="0.1"
                    value={drugs.verapamil.concentration}
                    onChange={(e) => handleDrugChange('verapamil', 'concentration', e.target.value)}
                    disabled={!drugs.verapamil.active}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>

              {/* Diltiazem */}
              <div className="border border-gray-200 p-3 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-medium text-green-600 text-sm">Diltiazem</label>
                  <input
                    type="checkbox"
                    checked={drugs.diltiazem.active}
                    onChange={(e) => handleDrugChange('diltiazem', 'active', e.target.checked)}
                    className="scale-110"
                  />
                </div>
                <p className="text-xs text-gray-600 mb-2">Blokuje kanały L-Ca2+, podobnie do werapamilu</p>
                <div>
                  <label className="block text-xs mb-1">Stężenie (μM):</label>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.05"
                    value={drugs.diltiazem.concentration}
                    onChange={(e) => handleDrugChange('diltiazem', 'concentration', e.target.value)}
                    disabled={!drugs.diltiazem.active}
                    className="w-full p-1 text-sm border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Phases Info Panel - 1 column width */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">📚 Fazy potencjału czynnościowego</h3>
          <div className="space-y-3 text-sm">
            <div className="border-l-4 border-red-500 pl-3">
              <h4 className="font-semibold text-red-600">Faza 0</h4>
              <p className="text-gray-600">Depolaryzacja Na⁺<br/>Nadstrzał do +35mV</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-3">
              <h4 className="font-semibold text-orange-600">Faza 1</h4>
              <p className="text-gray-600">Wstępna repolaryzacja K⁺<br/>Spadek potencjału</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-3">
              <h4 className="font-semibold text-blue-600">Faza 2</h4>
              <p className="text-gray-600">Plateau Ca²⁺<br/>Kanały L-type</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <h4 className="font-semibold text-green-600">Faza 3</h4>
              <p className="text-gray-600">Repolaryzacja K⁺<br/>Powrót do spoczynku</p>
            </div>
            <div className="border-l-4 border-gray-500 pl-3">
              <h4 className="font-semibold text-gray-600">Faza 4</h4>
              <p className="text-gray-600">Potencjał spoczynkowy<br/>-90mV (komorowe)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardiacActionPotentialSimulator;