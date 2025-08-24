import { useState } from 'react';
import type { ExperimentData, ExperimentResult } from '../types/experiment';

interface SkeletalMuscleExperimentProps {
  onDataChange: (data: ExperimentData) => void;
  onRun: () => void;
  results: ExperimentResult | null;
  isRunning: boolean;
}

export default function SkeletalMuscleExperiment({
  onDataChange,
  onRun,
  results,
  isRunning
}: SkeletalMuscleExperimentProps) {
  const [formData, setFormData] = useState<ExperimentData>({
    stimulus: 5,
    frequency: 20,
    duration: 100,
  });

  const handleInputChange = (field: keyof ExperimentData, value: number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Parameters Form */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Parameters</h3>
        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm text-gray-700 dark:text-gray-200">Stimulus Strength</span>
            <input 
              type="number" 
              min={0} 
              max={10} 
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
              max={100} 
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
              value={formData.duration} 
              onChange={(e) => handleInputChange('duration', parseFloat(e.target.value) || 0)}
              className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" 
            />
          </label>
          <button 
            type="button" 
            onClick={onRun}
            disabled={isRunning}
            className="mt-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold transition"
          >
            {isRunning ? 'Running...' : 'Run Experiment'}
          </button>
        </form>
      </div>

      {/* Results Chart */}
      {results && (
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Results</h3>
          <div className="w-full h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Chart.js graph will go here</p>
              <div className="text-sm text-gray-500">
                {results.labels.map((label, index) => (
                  <div key={index}>{label}: {results.data[index]?.toFixed(2)}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 