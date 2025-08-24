export interface Experiment {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  markdownFile: string; // Path to the markdown file
  component: string; // Name of the component to load
}

export interface ExperimentData {
  stimulus: number;
  frequency: number;
  duration: number;
  [key: string]: any; // Allow for additional experiment-specific parameters
}

export interface ExperimentResult {
  data: any[];
  labels: string[];
  [key: string]: any; // Allow for additional experiment-specific results
} 