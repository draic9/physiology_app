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
  // Cardiac-specific parameters
  drugConcentration?: number;
  drugType?: 'none' | 'TTX' | 'verapamil';
  temperature?: number;
  extracellularK?: number;
  extracellularCa?: number;
  // Additional cardiac parameters
  cellType?: 'atrial' | 'ventricular';
  conductionPath?: 'normal' | 'SA_AV_His_Purkinje';
  [key: string]: any; // Allow for additional experiment-specific parameters
}

export interface ExperimentResult {
  data: any[];
  labels: string[];
  // Cardiac-specific results
  actionPotential?: {
    time: number[];
    voltage: number[];
    phases: {
      phase0: { start: number; end: number; peak: number };
      phase1: { start: number; end: number; min: number };
      phase2: { start: number; end: number; plateau: number };
      phase3: { start: number; end: number; slope: number };
      phase4: { start: number; end: number; resting: number };
    };
  };
  drugEffects?: {
    naInhibition: number;
    caInhibition: number;
  };
  // Additional cardiac results
  conductionTimes?: {
    SA_AV: number;
    AV_His: number;
    His_Purkinje: number;
    total: number;
  };
  [key: string]: any; // Allow for additional experiment-specific results
} 