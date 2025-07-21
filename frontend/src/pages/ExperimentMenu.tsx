import { LockClosedIcon } from '@heroicons/react/24/solid';

const experiments = [
  {
    id: 1,
    name: 'Skeletal Muscle Response',
    description: 'Explore how skeletal muscle responds to different stimuli.',
    unlocked: true,
  },
  {
    id: 2,
    name: 'Nerve Conduction Velocity',
    description: 'Measure the speed of nerve impulses.',
    unlocked: false,
  },
  {
    id: 3,
    name: 'Cardiac Muscle Physiology',
    description: 'Investigate the properties of cardiac muscle tissue.',
    unlocked: false,
  },
  {
    id: 4,
    name: 'Respiratory Gas Exchange',
    description: 'Simulate oxygen and carbon dioxide exchange in the lungs.',
    unlocked: false,
  },
  {
    id: 5,
    name: 'Renal Filtration',
    description: 'Model the filtration process in the kidneys.',
    unlocked: false,
  },
  {
    id: 6,
    name: 'Acid-Base Balance',
    description: 'Explore how the body maintains pH homeostasis.',
    unlocked: false,
  },
];

export default function ExperimentMenu() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-4">
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
              <button className="mt-auto px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">
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