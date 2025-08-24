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
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState<'side' | 'cover'>('cover');

  useEffect(() => {
    if (id) {
      const expId = parseInt(id);
      const exp = experimentConfigs[expId];
      if (exp) {
        setExperiment(exp);
      }
    }
  }, [id]);

  // Set cover mode as default on mobile
  useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setPanelMode('cover');
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!experiment) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center pt-10 pb-10 px-2">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading experiment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center pt-20 pb-10 px-2">
      <div className="w-full max-w-7xl relative">
        {/* Main Content Area */}
        <div className={`transition-all duration-300 ease-in-out ${
          isPanelOpen && panelMode === 'side' 
            ? 'lg:mr-80' // Leave space for side panel
            : ''
        }`}>
          <ExperimentWorkArea />
        </div>

        {/* Side Panel */}
        <div className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out z-40 ${
          isPanelOpen 
            ? 'translate-x-0' 
            : 'translate-x-full'
        } ${
          panelMode === 'side' 
            ? 'w-80 lg:block' // Fixed width for side mode
            : 'w-full lg:w-96' // Full width on mobile, smaller on desktop for cover mode
        }`}>
          <ExperimentExplainer 
            experiment={experiment}
            isOpen={isPanelOpen}
            mode={panelMode}
            onToggle={() => setIsPanelOpen(!isPanelOpen)}
            onModeChange={setPanelMode}
          />
        </div>

        {/* Panel Toggle Button */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`fixed top-24 right-4 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isPanelOpen 
              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
          aria-label={isPanelOpen ? 'Close documentation' : 'Open documentation'}
        >
          {isPanelOpen ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </button>

        {/* Overlay for mobile cover mode */}
        {isPanelOpen && panelMode === 'cover' && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
} 