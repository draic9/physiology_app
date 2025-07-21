import { useState } from "react";

export default function ExperimentScreen() {
  // Mock state for form and chart
  const [form, setForm] = useState({
    stimulus: 5,
    frequency: 20,
    duration: 100,
  });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex flex-col items-center pt-10 pb-10 px-2">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parameters Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Parameters</h2>
          <form className="flex flex-col gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700 dark:text-gray-200">Stimulus Strength</span>
              <input type="number" min={0} max={10} value={form.stimulus} className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" readOnly />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700 dark:text-gray-200">Frequency (Hz)</span>
              <input type="number" min={0} max={100} value={form.frequency} className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" readOnly />
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-sm text-gray-700 dark:text-gray-200">Duration (ms)</span>
              <input type="number" min={0} max={1000} value={form.duration} className="rounded px-3 py-2 border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" readOnly />
            </label>
            <button type="button" className="mt-2 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition">Submit (mock)</button>
          </form>
        </div>
        {/* Description & Follow-up (Markdown placeholder) */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col gap-4 max-h-[32rem] overflow-y-auto">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Experiment Description</h2>
          <div className="prose dark:prose-invert max-w-none">
            <p><b>Markdown content will be loaded here.</b></p>
            <p>This panel will show experiment background, instructions, and follow-up questions.</p>
          </div>
        </div>
        {/* Chart/Graph (spans both columns on mobile) */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-2 flex flex-col items-center">
          <h2 className="text-xl font-bold text-emerald-600 dark:text-emerald-300 mb-2">Results Chart</h2>
          <div className="w-full h-64 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">[Chart.js graph will go here]</span>
          </div>
        </div>
      </div>
    </div>
  );
} 