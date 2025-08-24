import { useState } from 'react';
import type { ExperimentData, ExperimentResult } from '../types/experiment';

interface CardiomyocytePotentialExperimentProps {
  onDataChange: (data: ExperimentData) => void;
  onRun: () => void;
  results: ExperimentResult | null;
  isRunning: boolean;
}

export default function CardiomyocytePotentialExperiment({
  onDataChange,
  onRun,
  results,
  isRunning
}: CardiomyocytePotentialExperimentProps) {
  const [formData, setFormData] = useState({
    stimulus: 5,
    frequency: 20,
    duration: 100,
    // Placeholder parameters for future implementation
    temperature: 37,
    extracellularK: 5.4,
    extracellularCa: 2.5,
  });

  const handleInputChange = (field: string, value: number) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onDataChange(newData as any);
  };

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

      {/* Placeholder for Advanced Parameters */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Advanced Parameters</h3>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            <strong>Coming Soon:</strong> Advanced ion channel modeling, detailed electrophysiology parameters, 
            and sophisticated cardiac action potential simulation will be implemented here.
          </p>
        </div>
      </div>

      {/* Action Button */}
      <button 
        type="button" 
        onClick={onRun}
        disabled={isRunning}
        className="mt-4 px-6 py-3 rounded bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white font-semibold transition text-lg"
      >
        {isRunning ? 'Running Simulation...' : 'Run Cardiomyocyte Simulation'}
      </button>

      {/* Placeholder Results */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Simulation Results</h3>
        <div className="w-full h-80 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 mb-2">Advanced Cardiomyocyte Potential Chart</p>
            <p className="text-sm text-gray-500">Detailed ion channel simulation will be displayed here</p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {results && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">Simulation Summary:</h4>
          <div className="text-sm text-blue-700 dark:text-blue-300">
            <p>Stimulus: {formData.stimulus}mA, Frequency: {formData.frequency}Hz, Duration: {formData.duration}ms</p>
            <p>Temperature: {formData.temperature}°C</p>
            <p>This is a placeholder experiment. Advanced features coming soon!</p>
          </div>
        </div>
      )}
    </div>
  );
} 