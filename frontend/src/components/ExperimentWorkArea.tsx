import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Experiment, ExperimentData, ExperimentResult } from '../types/experiment';
import SkeletalMuscleExperiment from '../experiments/SkeletalMuscleExperiment';

// Map of experiment components
const experimentComponents: Record<string, React.ComponentType<{
  onDataChange: (data: ExperimentData) => void;
  onRun: () => void;
  results: ExperimentResult | null;
  isRunning: boolean;
}>> = {
  'SkeletalMuscleExperiment': SkeletalMuscleExperiment,
  // Add more experiments here as they're created
};

// Map of experiment configurations
const experimentConfigs: Record<number, Experiment> = {
  1: {
    id: 1,
    name: 'Skeletal Muscle Response',
    description: 'Explore how skeletal muscle responds to different stimuli.',
    unlocked: true,
    markdownFile: '/markdown/skeletal-muscle.md',
    component: 'SkeletalMuscleExperiment'
  },
  2: {
    id: 2,
    name: 'Nerve Conduction Velocity',
    description: 'Measure the speed of nerve impulses.',
    unlocked: false,
    markdownFile: '/markdown/nerve-conduction.md',
    component: 'SkeletalMuscleExperiment' // Placeholder for now
  },
  // Add more experiments here
};

export default function ExperimentWorkArea() {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);
  const [experimentData, setExperimentData] = useState<ExperimentData>({
    stimulus: 5,
    frequency: 20,
    duration: 100,
  });
  const [results, setResults] = useState<ExperimentResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (id) {
      const expId = parseInt(id);
      const exp = experimentConfigs[expId];
      if (exp) {
        setExperiment(exp);
      }
    }
  }, [id]);

  const handleDataChange = (data: ExperimentData) => {
    setExperimentData(data);
  };

  const handleRun = async () => {
    setIsRunning(true);
    // Simulate experiment running
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock results - this will be replaced with actual backend calculations
    setResults({
      data: [Math.random() * 100, Math.random() * 100, Math.random() * 100],
      labels: ['Trial 1', 'Trial 2', 'Trial 3']
    });
    setIsRunning(false);
  };

  if (!experiment) {
    return <div>Loading experiment...</div>;
  }

  const ExperimentComponent = experimentComponents[experiment.component];
  
  if (!ExperimentComponent) {
    return <div>Experiment component not found: {experiment.component}</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
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