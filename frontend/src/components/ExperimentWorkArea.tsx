import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Experiment, ExperimentData, ExperimentResult } from '../types/experiment';

interface ExperimentWorkAreaProps {
  experimentComponents: Record<string, React.ComponentType<{
    onDataChange: (data: ExperimentData) => void;
    onRun: () => void;
    results: ExperimentResult | null;
    isRunning: boolean;
  }>>;
  experimentConfigs: Record<number, Experiment>;
  onExperimentChange?: (experiment: Experiment | null) => void;
}

export default function ExperimentWorkArea({ 
  experimentComponents, 
  experimentConfigs, 
  onExperimentChange 
}: ExperimentWorkAreaProps) {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [experimentData, setExperimentData] = useState<ExperimentData>({
    stimulus: 5,
    frequency: 20,
    duration: 100,
    // Cardiac-specific parameters
    drugConcentration: 0,
    drugType: 'none',
    temperature: 37,
    extracellularK: 5.4,
    extracellularCa: 2.5,
    // Additional cardiac parameters
    cellType: 'ventricular',
    conductionPath: 'normal',
  });
  const [results, setResults] = useState<ExperimentResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (id) {
      const experimentId = parseInt(id);
      const foundExperiment = experimentConfigs[experimentId];
      if (foundExperiment) {
        setExperiment(foundExperiment);
        if (onExperimentChange) {
          onExperimentChange(foundExperiment);
        }
      } else {
        setExperiment(null);
        if (onExperimentChange) {
          onExperimentChange(null);
        }
      }
    }
  }, [id, experimentConfigs, onExperimentChange]);

  const handleDataChange = (data: ExperimentData) => {
    setExperimentData(data);
  };

  const handleRun = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    if (experiment && experiment.component === 'CardiacMuscleExperiment') {
      setResults({
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        labels: ['Phase 0', 'Phase 2', 'Phase 3'],
        actionPotential: {
          time: [0, 1, 2, 3, 4, 5],
          voltage: [-90, 35, 10, 10, -90, -90],
          phases: {
            phase0: { start: 0, end: 2, peak: 35 },
            phase1: { start: 2, end: 7, min: 10 },
            phase2: { start: 7, end: 200, plateau: 10 },
            phase3: { start: 200, end: 300, slope: -0.5 },
            phase4: { start: 300, end: 1000, resting: -90 }
          }
        },
        drugEffects: {
          naInhibition: experimentData.drugType === 'TTX' ? (experimentData.drugConcentration || 0) * 10 : 0,
          caInhibition: experimentData.drugType === 'verapamil' ? (experimentData.drugConcentration || 0) * 5 : 0
        },
        conductionTimes: {
          SA_AV: 150, // ms - normal AV delay
          AV_His: 50, // ms - His bundle conduction
          His_Purkinje: 30, // ms - Purkinje fiber conduction
          total: 230 // ms - total conduction time
        }
      });
    } else {
      setResults({
        data: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
        labels: ['Trial 1', 'Trial 2', 'Trial 3']
      });
    }
    setIsRunning(false);
  };

  if (!experiment) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading experiment...</p>
        </div>
      </div>
    );
  }

  const ExperimentComponent = experimentComponents[experiment.component];
  
  if (!ExperimentComponent) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-600 dark:text-red-400">
          <p>Experiment component not found: {experiment.component}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 min-h-[400px]">
      <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-4">
        {experiment.name}
      </h2>
      <ExperimentComponent
        onDataChange={handleDataChange}
        onRun={handleRun}
        results={results}
        isRunning={isRunning}
      />
    </div>
  );
} 