import { LockClosedIcon } from '@heroicons/react/24/solid';
import { useNavigate } from "react-router-dom";
import type { Experiment } from '../types/experiment';

const experiments: Experiment[] = [
  {
    id: 1,
    name: 'Cardiac Action Potential Simulator',
    description: 'Advanced real-time cardiac electrophysiology simulator with drug effects and interactive visualization.',
    unlocked: true,
    markdownFile: '/markdown/cardiac-action-potential-simulator.md',
    component: 'CardiacActionPotentialSimulator'
  },
  {
    id: 2,
    name: 'Digestive Enzyme Kinetics',
    description: 'Study enzyme-substrate interactions in the digestive system.',
    unlocked: false,
    markdownFile: '/markdown/digestive-enzymes.md',
    component: 'DigestiveExperiment'
  },
  {
    id: 3,
    name: 'Neural Plasticity',
    description: 'Investigate synaptic strength changes and learning mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/neural-plasticity.md',
    component: 'NeuralPlasticityExperiment'
  },
  {
    id: 4,
    name: 'Nerve Conduction Velocity',
    description: 'Measure the speed of nerve impulse propagation through myelinated and unmyelinated fibers.',
    unlocked: false,
    markdownFile: '/markdown/nerve-conduction.md',
    component: 'NerveConductionExperiment'
  },
  {
    id: 5,
    name: 'Synaptic Transmission',
    description: 'Study neurotransmitter release and postsynaptic responses in chemical synapses.',
    unlocked: false,
    markdownFile: '/markdown/synaptic-transmission.md',
    component: 'SynapticTransmissionExperiment'
  },
  {
    id: 6,
    name: 'Respiratory Gas Exchange',
    description: 'Simulate oxygen and carbon dioxide exchange in pulmonary capillaries.',
    unlocked: false,
    markdownFile: '/markdown/respiratory-gas-exchange.md',
    component: 'RespiratoryExperiment'
  },
  {
    id: 7,
    name: 'Renal Filtration',
    description: 'Model glomerular filtration and tubular reabsorption processes.',
    unlocked: false,
    markdownFile: '/markdown/renal-filtration.md',
    component: 'RenalExperiment'
  },
  {
    id: 8,
    name: 'Acid-Base Balance',
    description: 'Explore pH regulation through respiratory and renal compensation mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/acid-base-balance.md',
    component: 'AcidBaseExperiment'
  },
  {
    id: 9,
    name: 'Blood Pressure Regulation',
    description: 'Study baroreceptor reflexes and autonomic nervous system control.',
    unlocked: false,
    markdownFile: '/markdown/blood-pressure-regulation.md',
    component: 'BloodPressureExperiment'
  },
  {
    id: 10,
    name: 'Cardiac Output',
    description: 'Model stroke volume, heart rate, and their relationship to cardiac output.',
    unlocked: false,
    markdownFile: '/markdown/cardiac-output.md',
    component: 'CardiacOutputExperiment'
  },
  {
    id: 11,
    name: 'Ventilation-Perfusion Ratio',
    description: 'Analyze the relationship between alveolar ventilation and pulmonary blood flow.',
    unlocked: false,
    markdownFile: '/markdown/ventilation-perfusion.md',
    component: 'VentilationPerfusionExperiment'
  },
  {
    id: 12,
    name: 'Glucose Metabolism',
    description: 'Study insulin and glucagon effects on glucose uptake and storage.',
    unlocked: false,
    markdownFile: '/markdown/glucose-metabolism.md',
    component: 'GlucoseMetabolismExperiment'
  },
  {
    id: 13,
    name: 'Electrolyte Balance',
    description: 'Model sodium, potassium, and calcium homeostasis in the body.',
    unlocked: false,
    markdownFile: '/markdown/electrolyte-balance.md',
    component: 'ElectrolyteExperiment'
  },
  {
    id: 14,
    name: 'Hemoglobin-Oxygen Binding',
    description: 'Study oxygen-hemoglobin dissociation curve and factors affecting it.',
    unlocked: false,
    markdownFile: '/markdown/hemoglobin-oxygen.md',
    component: 'HemoglobinExperiment'
  },
  {
    id: 15,
    name: 'Muscle Fatigue',
    description: 'Investigate metabolic and neural factors contributing to muscle fatigue.',
    unlocked: false,
    markdownFile: '/markdown/muscle-fatigue.md',
    component: 'MuscleFatigueExperiment'
  },
  {
    id: 16,
    name: 'Thermoregulation',
    description: 'Model body temperature regulation through heat production and loss.',
    unlocked: false,
    markdownFile: '/markdown/thermoregulation.md',
    component: 'ThermoregulationExperiment'
  },
  {
    id: 17,
    name: 'Endocrine Feedback Loops',
    description: 'Study hormone regulation through negative and positive feedback mechanisms.',
    unlocked: false,
    markdownFile: '/markdown/endocrine-feedback.md',
    component: 'EndocrineExperiment'
  },
  {
    id: 18,
    name: 'Immune Response',
    description: 'Model innate and adaptive immune responses to pathogens.',
    unlocked: false,
    markdownFile: '/markdown/immune-response.md',
    component: 'ImmuneExperiment'
  }
];

export default function ExperimentMenu() {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-10 pb-10 px-4">
      <h1 className="text-3xl font-bold mb-8 text-emerald-600 dark:text-emerald-300">Experiments</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-3xl">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className={`relative rounded-2xl shadow-lg p-6 flex flex-col gap-3 transition border-2 ${
              exp.unlocked
                ? 'bg-white dark:bg-gray-800 border-emerald-200 dark:border-emerald-700 hover:shadow-2xl cursor-pointer'
                : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60 cursor-not-allowed'
            }`}
            tabIndex={exp.unlocked ? 0 : -1}
            aria-disabled={!exp.unlocked}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xl font-semibold text-gray-900 dark:text-gray-100">{exp.name}</span>
              {!exp.unlocked && (
                <LockClosedIcon className="w-6 h-6 text-gray-400 dark:text-gray-400 ml-2" />
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-200 mb-2">{exp.description}</p>
            {exp.unlocked ? (
              <button className="mt-auto px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition" onClick={() => navigate(`/experiment/${exp.id}`)}>
                Open
              </button>
            ) : (
              <span className="mt-auto px-4 py-2 rounded bg-gray-400 text-white font-semibold flex items-center justify-center">
                Locked
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 