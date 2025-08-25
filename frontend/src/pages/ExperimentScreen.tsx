import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { Experiment } from '../types/experiment';
import ExperimentWorkArea from '../components/ExperimentWorkArea';
import ExperimentExplainer from '../components/ExperimentExplainer';
import CardiacActionPotentialSimulator from '../experiments/CardiacActionPotentialSimulator';

// Component mapping for experiments
const experimentComponents: Record<string, React.ComponentType<any>> = {
  'CardiacActionPotentialSimulator': CardiacActionPotentialSimulator,
  'NerveConductionExperiment': () => <div>Loading Nerve Conduction Experiment...</div>,
  'SynapticTransmissionExperiment': () => <div>Loading Synaptic Transmission Experiment...</div>,
  'RespiratoryExperiment': () => <div>Loading Respiratory Gas Exchange Experiment...</div>,
  'RenalExperiment': () => <div>Loading Renal Filtration Experiment...</div>,
  'AcidBaseExperiment': () => <div>Loading Acid-Base Balance Experiment...</div>,
  'BloodPressureExperiment': () => <div>Loading Blood Pressure Regulation Experiment...</div>,
  'CardiacOutputExperiment': () => <div>Loading Cardiac Output Experiment...</div>,
  'VentilationPerfusionExperiment': () => <div>Loading Ventilation-Perfusion Ratio Experiment...</div>,
  'GlucoseMetabolismExperiment': () => <div>Loading Glucose Metabolism Experiment...</div>,
  'ElectrolyteExperiment': () => <div>Loading Electrolyte Balance Experiment...</div>,
  'HemoglobinExperiment': () => <div>Loading Hemoglobin-Oxygen Binding Experiment...</div>,
  'MuscleFatigueExperiment': () => <div>Loading Muscle Fatigue Experiment...</div>,
  'ThermoregulationExperiment': () => <div>Loading Thermoregulation Experiment...</div>,
  'EndocrineExperiment': () => <div>Loading Endocrine Feedback Loops Experiment...</div>,
  'ImmuneExperiment': () => <div>Loading Immune Response Experiment...</div>,
  'DigestiveExperiment': () => <div>Loading Digestive Enzyme Kinetics Experiment...</div>,
  'NeuralPlasticityExperiment': () => <div>Loading Neural Plasticity Experiment...</div>,
};

// Experiment configurations - this should eventually come from the backend
const experimentConfigs: Record<number, Experiment> = {
  1: {
    id: 1,
    name: 'Cardiac Action Potential Simulator',
    description: 'Advanced real-time cardiac electrophysiology simulator with drug effects and interactive visualization.',
    unlocked: true,
    markdownFile: '/markdown/cardiac-action-potential-simulator.md',
    component: 'CardiacActionPotentialSimulator'
  },
  2: {
    id: 2,
    name: 'Digestive Enzyme Kinetics',
    description: 'Study enzyme-substrate interactions in the digestive system.',
    unlocked: false,
    markdownFile: '/markdown/digestive-enzymes.md',
    component: 'DigestiveExperiment'
  },
  3: {
    id: 3,
    name: 'Neural Plasticity',
    description: 'Investigate synaptic strength changes and learning mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/neural-plasticity.md',
    component: 'NeuralPlasticityExperiment'
  },
  4: {
    id: 4,
    name: 'Nerve Conduction Velocity',
    description: 'Measure the speed of nerve impulse propagation through myelinated and unmyelinated fibers.',
    unlocked: false,
    markdownFile: '/markdown/nerve-conduction.md',
    component: 'NerveConductionExperiment'
  },
  5: {
    id: 5,
    name: 'Synaptic Transmission',
    description: 'Study neurotransmitter release and postsynaptic responses in chemical synapses.',
    unlocked: false,
    markdownFile: '/markdown/synaptic-transmission.md',
    component: 'SynapticTransmissionExperiment'
  },
  6: {
    id: 6,
    name: 'Respiratory Gas Exchange',
    description: 'Simulate oxygen and carbon dioxide exchange in pulmonary capillaries.',
    unlocked: false,
    markdownFile: '/markdown/respiratory-gas-exchange.md',
    component: 'RespiratoryExperiment'
  },
  7: {
    id: 7,
    name: 'Renal Filtration',
    description: 'Model glomerular filtration and tubular reabsorption processes.',
    unlocked: false,
    markdownFile: '/markdown/renal-filtration.md',
    component: 'RenalExperiment'
  },
  8: {
    id: 8,
    name: 'Acid-Base Balance',
    description: 'Explore pH regulation through respiratory and renal compensation mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/acid-base-balance.md',
    component: 'AcidBaseExperiment'
  },
  9: {
    id: 9,
    name: 'Blood Pressure Regulation',
    description: 'Study baroreceptor reflexes and autonomic nervous system control.',
    unlocked: false,
    markdownFile: '/markdown/blood-pressure-regulation.md',
    component: 'BloodPressureExperiment'
  },
  10: {
    id: 10,
    name: 'Cardiac Output',
    description: 'Model stroke volume, heart rate, and their relationship to cardiac output.',
    unlocked: false,
    markdownFile: '/markdown/cardiac-output.md',
    component: 'CardiacOutputExperiment'
  },
  11: {
    id: 11,
    name: 'Ventilation-Perfusion Ratio',
    description: 'Analyze the relationship between alveolar ventilation and pulmonary blood flow.',
    unlocked: false,
    markdownFile: '/markdown/ventilation-perfusion.md',
    component: 'VentilationPerfusionExperiment'
  },
  12: {
    id: 12,
    name: 'Glucose Metabolism',
    description: 'Study insulin and glucagon effects on glucose uptake and storage.',
    unlocked: false,
    markdownFile: '/markdown/glucose-metabolism.md',
    component: 'GlucoseMetabolismExperiment'
  },
  13: {
    id: 13,
    name: 'Electrolyte Balance',
    description: 'Model sodium, potassium, and calcium homeostasis in the body.',
    unlocked: false,
    markdownFile: '/markdown/electrolyte-balance.md',
    component: 'ElectrolyteExperiment'
  },
  14: {
    id: 14,
    name: 'Hemoglobin-Oxygen Binding',
    description: 'Study oxygen-hemoglobin dissociation curve and factors affecting it.',
    unlocked: false,
    markdownFile: '/markdown/hemoglobin-oxygen.md',
    component: 'HemoglobinExperiment'
  },
  15: {
    id: 15,
    name: 'Muscle Fatigue',
    description: 'Investigate metabolic and neural factors contributing to muscle fatigue.',
    unlocked: false,
    markdownFile: '/markdown/muscle-fatigue.md',
    component: 'MuscleFatigueExperiment'
  },
  16: {
    id: 16,
    name: 'Thermoregulation',
    description: 'Model body temperature regulation through heat production and loss.',
    unlocked: false,
    markdownFile: '/markdown/thermoregulation.md',
    component: 'ThermoregulationExperiment'
  },
  17: {
    id: 17,
    name: 'Endocrine Feedback Loops',
    description: 'Study hormone regulation through negative and positive feedback mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/endocrine-feedback.md',
    component: 'EndocrineExperiment'
  },
  18: {
    id: 18,
    name: 'Immune Response',
    description: 'Model innate and adaptive immune responses to pathogens.',
    unlocked: false,
    markdownFile: '/markdown/immune-response.md',
    component: 'ImmuneExperiment'
  }
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
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center pt-20 pb-10 px-2">
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
        <div className={`transition-all duration-300 ease-in-out ${isPanelOpen && panelMode === 'side' ? 'lg:mr-[32rem]' : ''}`}>
          <ExperimentWorkArea 
            experimentComponents={experimentComponents} 
            experimentConfigs={experimentConfigs}
            onExperimentChange={setExperiment}
          />
        </div>

        {/* Side Panel */}
        <div className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out z-40 ${isPanelOpen ? 'translate-x-0' : 'translate-x-full'} ${panelMode === 'side' ? 'w-[32rem] lg:block' : 'w-full lg:w-[36rem]'}`}>
          <ExperimentExplainer experiment={experiment} mode={panelMode} onToggle={() => setIsPanelOpen(!isPanelOpen)} onModeChange={setPanelMode} />
        </div>

        {/* Panel Toggle Button - Smart positioning for both modes */}
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={`fixed top-24 z-50 p-3 rounded-full shadow-lg transition-all duration-300 ${
            isPanelOpen 
              ? panelMode === 'side'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-white right-[calc(32rem+1rem)]' // Fixed position for side mode
                : 'bg-emerald-500 hover:bg-emerald-600 text-white right-[calc(36rem+1rem)]' // Fixed position for cover mode
              : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 right-4' // Default position
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