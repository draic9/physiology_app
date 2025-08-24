import { useState, useEffect, useRef } from 'react';
import type { ExperimentData, ExperimentResult } from '../types/experiment';
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';

// Register Chart.js components
Chart.register(...registerables);

interface CardiacMuscleExperimentProps {
  onDataChange: (data: ExperimentData) => void;
  onRun: () => void;
  results: ExperimentResult | null;
  isRunning: boolean;
}

// Cardiac physiology constants based on the detailed document
const CARDIAC_PARAMS = {
  // Resting potentials from document
  atrialRestingPotential: -80, // mV
  ventricularRestingPotential: -90, // mV
  thresholdPotential: -65, // mV
  
  // Action potential phases from document
  phases: {
    phase0: { duration: 2, overshoot: 35 }, // Na+ depolarization
    phase1: { duration: 5, repolarization: -15 }, // Initial K+ repolarization  
    phase2: { duration: 200, plateau: 10 }, // Ca2+ plateau (L-type channels)
    phase3: { duration: 100, slope: -0.8 }, // K+ repolarization
    phase4: { duration: 300 } // Rest
  },
  
  // Conduction velocities from document
  conductionVelocities: {
    SA: 0.05, // m/s
    atrial: 1.0, // m/s
    AV: 0.05, // m/s (delayed)
    His: 2.5, // m/s (average of 2-4 m/s)
    Purkinje: 3.0, // m/s (average of 2-4 m/s)
    ventricular: 1.0 // m/s
  }
};

// Drug effects model based on document
const DRUG_EFFECTS = {
  TTX: {
    target: 'Na_channels',
    type: 'voltage_dependent_block',
    IC50: 0.01, // μM (from document - selective Na+ channel blocker)
    hillCoeff: 1,
    effect: 'decreases_phase0_slope'
  },
  verapamil: {
    target: 'Ca_channels',
    type: 'voltage_dependent_block',
    IC50: 0.1, // μM (from document - L-Ca2+ channel blocker)
    hillCoeff: 1,
    effect: 'shortens_phase2_plateau'
  }
};

export default function CardiacMuscleExperiment({
  onDataChange,
  onRun,
  results,
  isRunning
}: CardiacMuscleExperimentProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  const [formData, setFormData] = useState({
    stimulus: 5,
    frequency: 20,
    duration: 100,
    // Cardiac-specific parameters
    drugConcentration: 0,
    drugType: 'none' as 'none' | 'TTX' | 'verapamil',
    temperature: 37, // Celsius
    extracellularK: 5.4, // mM
    extracellularCa: 2.5, // mM
    // Additional parameters from document
    cellType: 'ventricular' as 'atrial' | 'ventricular',
    conductionPath: 'normal' as 'normal' | 'SA_AV_His_Purkinje'
  });

  const handleInputChange = (field: string, value: number | string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData as any);
  };

  // Hill equation for drug effects
  const hillEquation = (concentration: number, IC50: number, hillCoeff: number = 1) => {
    return Math.pow(concentration, hillCoeff) / 
           (Math.pow(IC50, hillCoeff) + Math.pow(concentration, hillCoeff));
  };

  // Calculate drug effect on channels
  const calculateDrugEffect = () => {
    if (formData.drugType === 'none' || formData.drugConcentration === 0) {
      return { naEffect: 1, caEffect: 1 };
    }

    const drug = DRUG_EFFECTS[formData.drugType as keyof typeof DRUG_EFFECTS];
    const effect = hillEquation(formData.drugConcentration, drug.IC50, drug.hillCoeff);
    
    if (drug.target === 'Na_channels') {
      return { naEffect: 1 - effect, caEffect: 1 };
    } else {
      return { naEffect: 1, caEffect: 1 - effect };
    }
  };

  // Generate cardiac action potential data based on physiology document
  const generateActionPotential = () => {
    const timePoints = 1000; // 1000ms simulation
    const time = Array.from({length: timePoints}, (_, i) => i);
    const voltage = Array.from({length: timePoints}, (_, i) => {
      const drugEffects = calculateDrugEffect();
      const restingPotential = formData.cellType === 'atrial' ? 
        CARDIAC_PARAMS.atrialRestingPotential : CARDIAC_PARAMS.ventricularRestingPotential;
      
      // Phase 0: Rapid depolarization (Na+ influx)
      if (i < 50) {
        const naEffect = drugEffects.naEffect;
        const slope = 50 * naEffect; // TTX reduces slope
        return restingPotential + (i * slope / 25);
      }
      
      // Phase 1: Initial repolarization (K+ efflux)
      if (i < 100) {
        return 35 - ((i - 50) * 0.5);
      }
      
      // Phase 2: Plateau (Ca2+ influx, K+ efflux)
      if (i < 300) {
        const caEffect = drugEffects.caEffect;
        const plateauDuration = 200 * caEffect; // Verapamil shortens plateau
        const adjustedI = i < (100 + plateauDuration) ? i : (100 + plateauDuration);
        return 10 + Math.sin((adjustedI - 100) * 0.02) * 2;
      }
      
      // Phase 3: Repolarization (K+ efflux)
      if (i < 400) {
        return 10 - ((i - 300) * 0.8);
      }
      
      // Phase 4: Resting potential
      return restingPotential;
    });

    return { time, voltage };
  };

  // Initialize chart
  useEffect(() => {
    if (chartRef.current && !chartInstance.current) {
      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: [],
            datasets: [{
              label: 'Cardiac Action Potential',
              data: [],
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false, // For real-time performance
            scales: {
              x: {
                title: { 
                  display: true, 
                  text: 'Time (ms)' 
                },
                min: 0,
                max: 1000,
                grid: {
                  color: 'rgba(156, 163, 175, 0.2)'
                }
              },
              y: {
                title: { 
                  display: true, 
                  text: 'Membrane Potential (mV)' 
                },
                min: -100,
                max: 50,
                grid: {
                  color: 'rgba(156, 163, 175, 0.2)'
                }
              }
            },
            plugins: {
              legend: {
                display: true,
                position: 'top'
              },
              tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                  label: (context) => `Voltage: ${context.parsed.y.toFixed(1)} mV`,
                  title: (tooltipItems) => `Time: ${tooltipItems[0].parsed.x} ms`
                }
              }
            },
            interaction: {
              mode: 'nearest',
              axis: 'x',
              intersect: false
            }
          }
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, []);

  // Update chart when results change
  useEffect(() => {
    if (chartInstance.current && results?.actionPotential) {
      const { time, voltage } = results.actionPotential;
      
      chartInstance.current.data.labels = time;
      chartInstance.current.data.datasets[0].data = voltage.map((v, i) => ({
        x: time[i],
        y: v
      }));
      
      chartInstance.current.update('none'); // No animation for performance
    }
  }, [results]);

  // Update chart when form data changes (real-time preview)
  useEffect(() => {
    if (chartInstance.current && !isRunning) {
      const { time, voltage } = generateActionPotential();
      
      chartInstance.current.data.labels = time;
      chartInstance.current.data.datasets[0].data = voltage.map((v, i) => ({
        x: time[i],
        y: v
      }));
      
      chartInstance.current.update('none');
    }
  }, [formData, isRunning]);

  return (
    <div className="flex flex-col gap-6">
      {/* Basic Parameters */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Basic Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Stimulus Strength (mA)</span>
            <input 
              type="number" 
              min={0} 
              max={20} 
              step={0.1}
              value={formData.stimulus} 
              onChange={(e) => handleInputChange('stimulus', parseFloat(e.target.value) || 0)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Frequency (Hz)</span>
            <input 
              type="number" 
              min={0} 
              max={200} 
              step={1}
              value={formData.frequency} 
              onChange={(e) => handleInputChange('frequency', parseFloat(e.target.value) || 0)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Duration (ms)</span>
            <input 
              type="number" 
              min={0} 
              max={1000} 
              step={10}
              value={formData.duration} 
              onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Temperature (°C)</span>
            <input 
              type="number" 
              min={20} 
              max={45} 
              step={0.5}
              value={formData.temperature} 
              onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 37)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
        </div>
      </div>

      {/* Cardiac-Specific Parameters */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Cardiac Physiology</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Cell Type</span>
            <select 
              value={formData.cellType} 
              onChange={(e) => handleInputChange('cellType', e.target.value)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="atrial">Atrial Cardiomyocyte (-80mV)</option>
              <option value="ventricular">Ventricular Cardiomyocyte (-90mV)</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Extracellular K+ (mM)</span>
            <input 
              type="number" 
              min={1} 
              max={20} 
              step={0.1}
              value={formData.extracellularK} 
              onChange={(e) => handleInputChange('extracellularK', parseFloat(e.target.value) || 5.4)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Extracellular Ca2+ (mM)</span>
            <input 
              type="number" 
              min={0.5} 
              max={10} 
              step={0.1}
              value={formData.extracellularCa} 
              onChange={(e) => handleInputChange('extracellularCa', parseFloat(e.target.value) || 2.5)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Conduction Path</span>
            <select 
              value={formData.conductionPath} 
              onChange={(e) => handleInputChange('conductionPath', e.target.value)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="normal">Normal (SA → AV → His → Purkinje)</option>
              <option value="SA_AV_His_Purkinje">Detailed Conduction</option>
            </select>
          </label>
        </div>
      </div>

      {/* Drug Effects */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Pharmacological Effects</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Drug Type</span>
            <select 
              value={formData.drugType} 
              onChange={(e) => handleInputChange('drugType', e.target.value)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="none">None</option>
              <option value="TTX">Tetrodotoxin (TTX) - Na+ Blocker</option>
              <option value="verapamil">Verapamil - Ca2+ Blocker</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Drug Concentration (μM)</span>
            <input 
              type="number" 
              min={0} 
              max={10} 
              step={0.01}
              value={formData.drugConcentration} 
              onChange={(e) => handleInputChange('drugConcentration', parseFloat(e.target.value) || 0)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
        </div>
        
        {/* Drug Effect Display */}
        {formData.drugType !== 'none' && formData.drugConcentration > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Current Drug Effects:</h4>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              {(() => {
                const effects = calculateDrugEffect();
                const drug = DRUG_EFFECTS[formData.drugType as keyof typeof DRUG_EFFECTS];
                return (
                  <>
                    <p><strong>{formData.drugType}:</strong> {drug.effect}</p>
                    <p>Na+ channel inhibition: {((1 - effects.naEffect) * 100).toFixed(1)}%</p>
                    <p>Ca2+ channel inhibition: {((1 - effects.caEffect) * 100).toFixed(1)}%</p>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button 
        type="button" 
        onClick={onRun}
        disabled={isRunning}
        className="mt-4 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold transition text-lg"
      >
        {isRunning ? 'Running Simulation...' : 'Run Cardiac Simulation'}
      </button>

      {/* Real-time Action Potential Chart */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          Cardiac Action Potential - Real-time Preview
        </h3>
        <div className="w-full h-80 bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <canvas ref={chartRef} className="w-full h-full" />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Chart updates in real-time as you adjust parameters. Red line shows threshold potential (-65mV).
        </p>
      </div>

      {/* Results Summary */}
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cardiac-Specific Results */}
          {results.actionPotential && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Action Potential Phases:</h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Phase 0:</strong> {results.actionPotential.phases.phase0.start}-{results.actionPotential.phases.phase0.end}ms, Peak: {results.actionPotential.phases.phase0.peak}mV</p>
                <p><strong>Phase 1:</strong> {results.actionPotential.phases.phase1.start}-{results.actionPotential.phases.phase1.end}ms, Min: {results.actionPotential.phases.phase1.min}mV</p>
                <p><strong>Phase 2:</strong> {results.actionPotential.phases.phase2.start}-{results.actionPotential.phases.phase2.end}ms, Plateau: {results.actionPotential.phases.phase2.plateau}mV</p>
                <p><strong>Phase 3:</strong> {results.actionPotential.phases.phase3.start}-{results.actionPotential.phases.phase3.end}ms, Slope: {results.actionPotential.phases.phase3.slope}mV/ms</p>
                <p><strong>Phase 4:</strong> {results.actionPotential.phases.phase4.start}-{results.actionPotential.phases.phase4.end}ms, Resting: {results.actionPotential.phases.phase4.resting}mV</p>
              </div>
            </div>
          )}

          {results.drugEffects && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Drug Effects:</h4>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p><strong>Na+ Channel Inhibition:</strong> {results.drugEffects.naInhibition.toFixed(1)}%</p>
                <p><strong>Ca2+ Channel Inhibition:</strong> {results.drugEffects.caInhibition.toFixed(1)}%</p>
              </div>
            </div>
          )}

          {/* Conduction Times */}
          {results.conductionTimes && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg md:col-span-2">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">Cardiac Conduction Times:</h4>
              <div className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <p><strong>SA → AV:</strong> {results.conductionTimes.SA_AV}ms (normal delay)</p>
                <p><strong>AV → His:</strong> {results.conductionTimes.AV_His}ms (bundle conduction)</p>
                <p><strong>His → Purkinje:</strong> {results.conductionTimes.His_Purkinje}ms (fiber conduction)</p>
                <p><strong>Total Conduction:</strong> {results.conductionTimes.total}ms</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 