import { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ViewColumnsIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import type { Experiment } from '../types/experiment';

interface ExperimentExplainerProps {
  experiment: Experiment;
  isOpen: boolean;
  mode: 'side' | 'cover';
  onToggle: () => void;
  onModeChange: (mode: 'side' | 'cover') => void;
}

export default function ExperimentExplainer({ 
  experiment, 
  isOpen, 
  mode, 
  onToggle, 
  onModeChange 
}: ExperimentExplainerProps) {
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && experiment.markdownFile) {
      loadMarkdownContent();
    }
  }, [isOpen, experiment.markdownFile]);

  const loadMarkdownContent = async () => {
    setIsLoading(true);
    try {
      // For now, we'll use mock content since we don't have actual markdown files
      // In a real implementation, you'd fetch from the markdownFile path
      const mockContent = getMockMarkdownContent(experiment.id);
      setMarkdownContent(mockContent);
    } catch (error) {
      console.error('Failed to load markdown content:', error);
      setMarkdownContent('Failed to load content. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMockMarkdownContent = (experimentId: number): string => {
    const contentMap: Record<number, string> = {
      1: `# Skeletal Muscle Response Experiment

## Background
Skeletal muscle tissue responds to electrical stimulation in predictable ways. This experiment explores the relationship between stimulus strength, frequency, and muscle contraction.

## Objectives
- Understand the relationship between stimulus strength and muscle response
- Explore frequency-dependent muscle fatigue
- Learn about the all-or-none principle in muscle physiology

## Procedure
1. Set the stimulus strength (0-10V)
2. Adjust frequency (0-100 Hz)
3. Set duration (0-1000 ms)
4. Run the experiment
5. Observe the muscle response curve

## Expected Results
- Higher stimulus strength should produce stronger contractions
- Higher frequencies may lead to muscle fatigue
- There's a minimum threshold for muscle activation

## Questions for Analysis
- What is the minimum stimulus required for muscle activation?
- How does frequency affect muscle fatigue?
- What happens when you exceed the maximum stimulus?

## Additional Notes
This experiment demonstrates fundamental principles of muscle physiology that are essential for understanding neuromuscular function. The relationship between stimulus strength and muscle response follows the all-or-none principle, where individual muscle fibers either contract fully or not at all.

The frequency of stimulation affects the force of contraction through a process called summation. At low frequencies, each stimulus produces a separate contraction. As frequency increases, contractions begin to overlap, resulting in increased force production. However, at very high frequencies, muscle fatigue sets in due to depletion of energy stores and accumulation of metabolic byproducts.

Understanding these principles is crucial for applications in physical therapy, sports medicine, and rehabilitation.`,
      2: `# Nerve Conduction Velocity Experiment

## Background
Nerve conduction velocity is a measure of how fast electrical impulses travel along nerve fibers.

## Objectives
- Measure nerve conduction velocity
- Understand factors affecting nerve signal speed
- Learn about nerve physiology

## Procedure
[Content will be added when this experiment is implemented]`,
      // Add more experiments as needed
    };

    return contentMap[experimentId] || 'Content not available for this experiment.';
  };

  const handleModeToggle = () => {
    const newMode = mode === 'side' ? 'cover' : 'side';
    onModeChange(newMode);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header with mode toggle */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-300">
          {experiment.name}
        </h2>
        
        {/* Mode Toggle - Only show on desktop */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={handleModeToggle}
            className={`p-2 rounded-lg transition-colors ${
              mode === 'cover' 
                ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300' 
                : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
            }`}
            title={mode === 'cover' ? 'Switch to side-by-side mode' : 'Switch to cover mode'}
          >
            {mode === 'cover' ? (
              <ViewColumnsIcon className="w-4 h-4" />
            ) : (
              <RectangleStackIcon className="w-4 h-4" />
            )}
          </button>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
            title="Close documentation"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onToggle}
          className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
          title="Close documentation"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Area with Scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="p-6 prose dark:prose-invert max-w-none">
            {markdownContent.split('\n').map((line, index) => {
              if (line.startsWith('# ')) {
                return <h1 key={index} className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-4">{line.substring(2)}</h1>;
              } else if (line.startsWith('## ')) {
                return <h2 key={index} className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-5 mb-3">{line.substring(3)}</h2>;
              } else if (line.startsWith('### ')) {
                return <h3 key={index} className="text-lg font-semibold text-gray-700 dark:text-gray-300 mt-4 mb-2">{line.substring(4)}</h3>;
              } else if (line.startsWith('- ')) {
                return <li key={index} className="text-gray-600 dark:text-gray-300 ml-4">{line.substring(2)}</li>;
              } else if (line.startsWith('1. ')) {
                return <li key={index} className="text-gray-600 dark:text-gray-300 ml-4">{line.substring(3)}</li>;
              } else if (line.trim() === '') {
                return <br key={index} />;
              } else {
                return <p key={index} className="text-gray-600 dark:text-gray-300 mb-2">{line}</p>;
              }
            })}
          </div>
        )}
      </div>
    </div>
  );
} 