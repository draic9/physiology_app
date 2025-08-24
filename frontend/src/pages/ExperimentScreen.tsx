import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ExperimentWorkArea from '../components/ExperimentWorkArea';
import ExperimentExplainer from '../components/ExperimentExplainer';
import type { Experiment } from '../types/experiment';

// Map of experiment configurations - this should eventually come from the backend
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

export default function ExperimentScreen() {
  const { id } = useParams<{ id: string }>();
  const [experiment, setExperiment] = useState<Experiment | null>(null);

  useEffect(() => {
    if (id) {
      const expId = parseInt(id);
      const exp = experimentConfigs[expId];
      if (exp) {
        setExperiment(exp);
      }
    }
  }, [id]);

  if (!experiment) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-10 pb-10 px-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading experiment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-10 pb-10 px-2">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Work Area - Takes up 2/3 of the space on large screens */}
        <div className="lg:col-span-2">
          <ExperimentWorkArea />
        </div>
        
        {/* Explainer Area - Takes up 1/3 of the space on large screens */}
        <div className="lg:col-span-1">
          <ExperimentExplainer experiment={experiment} />
        </div>
      </div>
    </div>
  );
} 