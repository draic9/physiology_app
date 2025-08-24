import { useState, useEffect } from 'react';
import { marked } from 'marked';
import type { Experiment } from '../types/experiment';

interface ExperimentExplainerProps {
  experiment: Experiment;
  isOpen: boolean;
  mode: 'side' | 'cover';
  onToggle: () => void;
  onModeChange: (mode: 'side' | 'cover') => void;
}

// Markdown content for each experiment (now hardcoded)
const EXPERIMENT_MARKDOWN: Record<string, string> = {
  'Cardiac Action Potential Simulator': `# Symulator Potencjału Czynnościowego Kardiomiocytów

## Przegląd
Zaawansowany symulator elektrofizjologii serca w czasie rzeczywistym z interaktywną wizualizacją i modelowaniem wpływu leków.

## Funkcje
- **Symulacja w czasie rzeczywistym** potencjału czynnościowego
- **Modelowanie farmakologiczne** - TTX, Werapamil, Diltiazem
- **Interaktywna kontrola** częstotliwości i prędkości
- **Wizualizacja faz** potencjału czynnościowego
- **Analiza parametrów** w czasie rzeczywistym

## Fazy Potencjału Czynnościowego

### Faza 0 - Depolaryzacja
- Szybka depolaryzacja przez kanały Na+
- Nadstrzał do +35mV
- Blokowana przez TTX

### Faza 1 - Wstępna repolaryzacja
- Spadek potencjału przez kanały K+
- Krótka faza przejściowa

### Faza 2 - Plateau
- Długie plateau przez kanały Ca2+ L-type
- Blokowane przez Werapamil i Diltiazem
- Kluczowa dla kurczliwości

### Faza 3 - Repolaryzacja
- Szybka repolaryzacja przez kanały K+
- Powrót do potencjału spoczynkowego

### Faza 4 - Spoczynek
- Potencjał spoczynkowy -90mV (komorowe)
- Przygotowanie do następnego cyklu

## Leki i ich działanie

### Tetrodotoksyna (TTX)
- **Mechanizm**: Blokuje kanały Na+
- **Efekt**: Zmniejsza szybkość depolaryzacji (Faza 0)
- **IC50**: 0.01 μM

### Werapamil
- **Mechanizm**: Blokuje kanały Ca2+ L-type
- **Efekt**: Skraca plateau (Faza 2)
- **IC50**: 0.1 μM

### Diltiazem
- **Mechanizm**: Blokuje kanały Ca2+ L-type
- **Efekt**: Podobny do Werapamilu
- **IC50**: 0.05 μM

## Parametry kontrolne

### Typ komórki
- **Komorowe**: -90mV spoczynek, dłuższe APD
- **Przedsionkowe**: -80mV spoczynek, krótsze APD

### Częstotliwość stymulacji
- Zakres: 0.5-3 Hz
- Wpływa na długość cyklu

### Prędkość symulacji
- Zakres: 0.1x-5x czasu rzeczywistego
- Kontrola szybkości aktualizacji

## Interpretacja wyników

### Parametry kluczowe
- **Amplituda**: Różnica między szczytem a spoczynkiem
- **APD90**: Czas do 90% repolaryzacji
- **Szybkość depolaryzacji**: Nachylenie Fazy 0

### Wpływ leków
- **TTX**: Zmniejsza amplitudę i szybkość
- **Werapamil/Diltiazem**: Skraca plateau
- **Kombinacje**: Efekty addytywne

## Zastosowania kliniczne
- Badanie działania leków antyarytmicznych
- Modelowanie zaburzeń rytmu
- Edukacja w elektrofizjologii serca
- Badania farmakologiczne in silico`,
  'Cardiac Muscle Physiology': `# FIZJOLOGIA UKŁADU KRĄŻENIA

## SERCE

### UKŁAD BODŹCOTWÓRCZO-PRZEWODZĄCY

Składa się z "sieci" komórek rozrusznikowych tworzących skupiska które umożliwiają prawidłową modulację skurczu. Skupiska te nazywamy:

#### Węzeł zatokowo-przedsionkowy (SA)
- Jest nazywany rozrusznikiem serca
- Znajduje się podnasierdziowo na powierzchni tylnej przedsionka prawego przy ujściu żyły głównej górnej
- Prędkość przewodzenia impulsu wynosi ok. 0,05 m/s

#### Węzeł przedsionkowo-komorowy (AV)
- Otrzymuje opóźniony impuls przekazywany z węzła SA, co powoduje późniejszy skurcz komór niż przedsionków
- Jest położony w przegrodzie międzyprzedsionkowej obok ujścia zatoki wieńcowej
- Samodzielnie nie jest w stanie pełnić funkcji rozrusznika serca

#### Pęczek przedsionkowo-komorowy (Hisa)
- Znajduje się podwsierdziowo po stronie prawego przedsionka
- Przechodzi przez trójkąt włóknisty prawy do przegrody międzykomorowej, gdzie oddaje lewą i prawą odnogę
- Odpowiada za przewodzenie impulsów z węzła AV do komór
- Prędkość przewodzenia wynosi 2-4 m/s

#### Odnoga lewa pęczka
- Biegnie po ścianie przegrody międzykomorowej w lewej komorze
- Oddaje 3 gałęzie

#### Odnoga prawa pęczka
- Zaopatruje prawą komorę
- Dzieli się na 3 gałęzie
- Na jej zakończeniach znajdują się włókna Purkiniego

#### Włókna Purkiniego
- Końcowe komórki komunikujące się bezpośrednio z kardiomiocytami, powodując ich skurcze
- Prędkość przewodzenia: 2-4 m/s

**Prędkość przewodzenia potencjału czynnościowego** w mięśniu przedsionkowym i mięśniu komór = ok. 1 m/s

---

## KOMÓRKI BUDUJĄCE SERCE - KARDIOMIOCYTY I ICH POTENCJAŁ SPOCZYNKOWY I CZYNNOŚCIOWY

### POTENCJAŁ SPOCZYNKOWY

Potencjał spoczynkowy dla kardiomiocytów wynosi:
- **Kardiomiocytów przedsionkowych** = ok. -80mV
- **Kardiomiocytów komorowych** = ok. -90mV

Wynika z ciągłego przemieszczania się jonów głównie Na⁺ i K⁺ przez kanały jonowe umieszczone w błonie komórkowej.

Błona ta w spoczynku jest około 100 razy bardziej przepuszczalna dla jonów K⁺ niż dla Na⁺, dlatego o wiele więcej K⁺ wydostaje się z komórki niż Na⁺ wchodzi do komórki, pomimo dodatniego potencjału powierzchni zewnętrznej błony komórkowej. Ta właściwość błony zapobiega ciągłej samoistnej depolaryzacji komórki i jej skurczowi w niekontrolowany sposób. Jony te poruszają się zgodnie z gradientem elektrycznym i chemicznym.

#### Przesunięcia jonowe w stanie spoczynku
Są to wyżej wyjaśnione przepływy jonów między kardiomiocytem a przestrzenią międzykomórkową. Prądy wywołane przez te przesunięcia noszą nazwę **prądów tła**, które odróżniamy na:
- **Odkomórkowy prąd K⁺** (EK = -95mV)
- **Dokomórkowy prąd Na⁺** (ENa = +75mV)

#### Pompa sodowo-potasowa a utrzymanie potencjału spoczynkowego kardiomiocytu
Pompa Na⁺/K⁺ jest zależna od ATP-azy. Wzrost stężenia Na⁺ wewnątrzkomórkowo oraz wzrost stężenia K⁺ zewnątrzkomórkowo powoduje aktywację ATP-azy, która uruchamia pompę sodowo-potasową. Powoduje to usunięcie jonów Na⁺ z kardiomiocytu i zastąpienie go K⁺ w stosunku 3:2, co oznacza, że przy jej działaniu zostaje zachowany ujemny potencjał wnętrza komórki, gdyż za 3 Na⁺ naładowane dodatnio otrzymujemy 2 K⁺ naładowane dodatnio, co prowadzi do zwiększenia ujemnego potencjału spoczynkowego. Mechanizm ten zapobiega depolaryzacji błony i skurczowi komórki.

---

### POTENCJAŁ CZYNNOŚCIOWY

Skurcz kardiomiocytów dyktowany jest otrzymaniem bodźca progowego, który powoduje stan pobudzenia, w którym następują zmiany:
- przepływ prądów jonowych z kanałów bramkowanych napięciem
- zmiana przepuszczalności błony
- zmiana przewodzenia błony

**Wartość bodźca progowego** - dla kardiomiocytów komorowych wynosi ok. -65mV i właśnie od tej wartości powstaje potencjał czynnościowy.

#### Zmiany wartości stężeń w fazach potencjału kardiomiocytu:

##### Faza 0 (wznoszenie)
Dokomórkowy prąd jonowy Na⁺ powoduje zwiększenie potencjału powyżej 0 mV, maksymalnie do +35 mV. Ten przedział potencjałów nosi nazwę **nadstrzału** i powoduje depolaryzację sarkolemy. Prąd ten jest spowodowany krótkotrwałym wzrostem przepuszczalności oraz przewodności sarkolemy dla Na⁺ - zjawisko to nosi nazwę **aktywacji sodowej**. Kilka milisekund później następuje wolny dokomórkowy prąd jonów Ca²⁺ spowodowany wzrostem przewodności błony kardiomiocytu, jednakże sam prąd Ca²⁺ ma niewielkie znaczenie dla wywoływania depolaryzacji błony kardiomiocytu.

##### Faza 1 (wstępna repolaryzacja)
W tej fazie rozpoczyna się spadek potencjału spowodowany silnym odkomórkowym prądem jonowym K⁺ poprzez krótkotrwałe zwiększenie przewodności błony dla K⁺ oraz zahamowanie dokomórkowego prądu jonowego Na⁺. Faza ta powoduje spadek potencjału powstałego na skutek nadstrzału.

##### Faza 2 (plateau)
W tej fazie przewodność błony kardiomiocytu dla jonów K⁺ wyraźnie spada, skutkując spadkiem odkomórkowego prądu jonowego K⁺, jednocześnie zachowany zostaje dokomórkowy prąd jonowy Ca²⁺. Jony Ca²⁺ są transportowane do sarkoplazmy z zewnętrznej powierzchni sarkoplazmy, gdzie są gromadzone w glikokaliksie dzięki kanałom L-Ca²⁺. Kanały te noszą nazwę **L - long lasting** (długotrwałe) i są wolne, gdyż do ich aktywacji potrzeba około 150-200ms. 

Podsumowując: suma różnic potencjałów jest równa zeru, co oznacza zachowanie stałego potencjału błonowego w tej fazie, której długość jest determinowana głównie stopniem aktywacji L-Ca²⁺ oraz stężeniem wewnątrzkomórkowym Ca²⁺, które powoduje uwalnianie zmagazynowanych jonów Ca²⁺ w kardiomiocycie. Umożliwia to rozpoczęcie sprzężenia pobudzeniowo-skurczowego i przejście do fazy 3.

##### Faza 3 (repolaryzacja miocytów)
Następuje stopniowo, spowodowana jest spadkiem przewodności błony dla jonów Ca²⁺ oraz wzrostem dla jonów K⁺. Właśnie ta zwiększona przewodność błony dla K⁺ powoduje wzrost odkomórkowego prądu K⁺, w wyniku czego następuje szybka repolaryzacja kardiomiocytów. Zbliżenie się potencjału w trakcie repolaryzacji do stanu równowagi dla K⁺ powoduje zahamowanie odkomórkowego prądu jonowego K⁺ i uzyskanie potencjału spoczynkowego.

##### Faza 4
Jest to faza, w której potencjał kardiomiocytu uzyskał wartość potencjału spoczynkowego.

---

## WPŁYW CZYNNIKÓW/LEKÓW NA ZMIANĘ POTENCJAŁÓW KARDIOMIOCYTU

### Tetrodotoksyna (TTX)
Jest to neurotoksyna powodująca selektywne zamknięcie kanałów sodowych napięciozależnych, co powoduje wyraźne zmniejszenie szybkości depolaryzacji, która ma miejsce w Fazie 0.

### Niedihydropirydyny (werapamil, diltiazem)
Blokują kanały napięciozależne L-Ca²⁺ w Fazie 2, co wpływa hamująco na powstawanie sprzężenia pobudzeniowo-skurczowego i uniemożliwia powstanie repolaryzacji miocytu.

---

## ZNACZENIE KLINICZNE

### Arytmie
- **Blok przewodzenia** na dowolnym poziomie (SA, AV, His, Purkinje)
- **Obwody re-entry** spowodowane spowolnionym przewodzeniem
- **Ogniska ektopowe** gdy węzeł SA zawodzi
- **Bradykardia** vs **tachykardia**

### Wpływ leków
- **Leki antyarytmiczne** celują w określone kanały jonowe
- **Blokery kanałów Ca²⁺** zmniejszają kurczliwość
- **Blokery kanałów Na⁺** spowalniają przewodzenie

### Zaburzenia układu przewodzącego
- **Dysfunkcja węzła SA** (zespół chorego węzła)
- **Blok AV** (I°, II°, III°)
- **Blok odnogi pęczka** (lewa/prawa)
- **Zespół Wolffa-Parkinsona-White'a**`,

  'Cardiomyocyte Potential': `# Cardiomyocyte Potential Experiment

## Overview
Advanced cardiac electrophysiology simulation with detailed ion channel modeling and mathematical precision.

## Experiment Goals
- **Real-time simulation** of cardiac action potential
- **Detailed ion channel kinetics** modeling
- **Pharmacological intervention** effects
- **Physiological parameter** manipulation
- **Advanced mathematical models** implementation

## Key Features

### Ion Channel Modeling
- **Na+ channels**: Fast activation, voltage-dependent inactivation
- **K+ channels**: Multiple types (IKr, IKs, IK1, Ito)
- **Ca2+ channels**: L-type and T-type with detailed kinetics
- **Background currents**: Maintaining resting potential

### Mathematical Models
- **Hodgkin-Huxley formalism** for channel gating
- **Goldman-Hodgkin-Katz equations** for ion fluxes
- **Nernst equation** for equilibrium potentials
- **Hill equation** for drug-receptor interactions

### Real-time Simulation
- **1000Hz sampling rate** for smooth waveforms
- **Adaptive time stepping** for efficiency
- **Parameter sensitivity analysis**
- **Multiple cell types** (atrial, ventricular, Purkinje)

## Experimental Parameters

### Basic Stimulation
- **Stimulus strength**: 0-20 mA (threshold determination)
- **Frequency**: 0-200 Hz (rate-dependent effects)
- **Duration**: 0-1000 ms (refractory period analysis)

### Physiological Variables
- **Temperature**: 20-45°C (Q10 effects on kinetics)
- **Extracellular K+**: 1-20 mM (resting potential effects)
- **Extracellular Ca2+**: 0.5-10 mM (plateau phase effects)
- **pH**: 6.5-8.0 (proton effects on channels)

### Advanced Parameters
- **Cell type selection**: Atrial vs. ventricular vs. Purkinje
- **Conduction path**: Normal vs. detailed (SA→AV→His→Purkinje)
- **Ion channel mutations**: Pathological variants
- **Metabolic state**: ATP levels, oxidative stress

## Pharmacological Interventions

### Na+ Channel Blockers
- **Tetrodotoxin (TTX)**: Selective Na+ channel blocker
- **Lidocaine**: Use-dependent Na+ channel inhibition
- **Flecainide**: Class IC antiarrhythmic

### Ca2+ Channel Blockers
- **Verapamil**: L-type Ca2+ channel blocker
- **Diltiazem**: Non-dihydropyridine Ca2+ blocker
- **Nifedipine**: Dihydropyridine Ca2+ blocker

### K+ Channel Modulators
- **Dofetilide**: IKr blocker (Class III)
- **Amiodarone**: Multiple channel effects
- **Sotalol**: β-blocker + K+ channel blocker

## Expected Outcomes

### Action Potential Analysis
- **Phase durations**: 0, 1, 2, 3, 4 timing
- **Amplitude changes**: Overshoot, plateau levels
- **Slope measurements**: Depolarization and repolarization rates
- **Refractory periods**: Absolute and relative

### Ion Current Analysis
- **Peak currents**: Maximum Na+, Ca2+, K+ fluxes
- **Current integrals**: Total charge movement
- **Channel kinetics**: Activation/inactivation time constants
- **Equilibrium potentials**: Nernst calculations

### Drug Effects
- **IC50 values**: Concentration-response curves
- **Hill coefficients**: Cooperativity analysis
- **Use-dependence**: Frequency-dependent effects
- **Recovery kinetics**: Washout time courses

## Clinical Applications

### Arrhythmia Mechanisms
- **Re-entry circuits**: Mathematical modeling
- **Triggered activity**: Early/late afterdepolarizations
- **Automaticity**: Enhanced pacemaker activity
- **Conduction block**: Rate-dependent phenomena

### Drug Development
- **Safety assessment**: Proarrhythmic potential
- **Efficacy optimization**: Dose-response relationships
- **Combination therapy**: Synergistic effects
- **Personalized medicine**: Genotype-specific responses

### Educational Value
- **Medical students**: Cardiac physiology fundamentals
- **Cardiologists**: Advanced electrophysiology concepts
- **Researchers**: Experimental design principles
- **Pharmaceutical industry**: Drug development insights

## Technical Implementation

### Simulation Engine
- **Differential equations**: ODE solver integration
- **Matrix operations**: Linear algebra for efficiency
- **Memory management**: Optimized data structures
- **Parallel processing**: Multi-core utilization

### Visualization
- **Real-time plotting**: Chart.js integration
- **Parameter controls**: Interactive sliders and inputs
- **Data export**: CSV, JSON, MATLAB formats
- **Screenshot capture**: High-resolution images

### Data Analysis
- **Statistical analysis**: Mean, SD, SEM calculations
- **Curve fitting**: Exponential, sigmoidal functions
- **Frequency analysis**: FFT for periodic phenomena
- **Correlation analysis**: Parameter relationships

## Future Enhancements

### Advanced Models
- **Multi-compartment models**: Cell geometry effects
- **Tissue-level simulation**: Conduction velocity
- **Organ-level modeling**: Whole heart simulation
- **Patient-specific models**: Individual variations

### Machine Learning
- **Parameter optimization**: Automated fitting
- **Pattern recognition**: Arrhythmia classification
- **Predictive modeling**: Drug response prediction
- **Anomaly detection**: Pathological identification

### Integration
- **ECG simulation**: Surface potential mapping
- **Imaging data**: MRI/CT anatomical correlation
- **Clinical databases**: Patient outcome correlation
- **Research platforms**: Multi-center collaboration

---

*This experiment represents the cutting edge of computational cardiac electrophysiology, combining rigorous mathematical modeling with intuitive user interface design to advance our understanding of heart function and disease.*`,

  'Skeletal Muscle Response': `# Skeletal Muscle Response Experiment

## Overview
Investigate the relationship between stimulus strength and muscle contraction in skeletal muscle tissue.

## Background
Skeletal muscle tissue responds to electrical stimulation in predictable ways. This experiment explores the fundamental principles of muscle physiology, including the all-or-none principle, summation, and fatigue mechanisms.

## Key Concepts

### Muscle Contraction Physiology
- **Motor unit**: Single motor neuron + muscle fibers
- **All-or-none principle**: Individual fibers contract fully or not at all
- **Motor unit recruitment**: Size principle (smaller units recruited first)
- **Frequency coding**: Rate of stimulation affects force

### Stimulus-Response Relationships
- **Threshold stimulus**: Minimum stimulus to produce contraction
- **Subthreshold**: No response
- **Threshold**: Minimal response
- **Suprathreshold**: Increased response up to maximum

### Force Generation
- **Twitch**: Single stimulus response
- **Summation**: Multiple stimuli before relaxation
- **Tetanus**: Sustained contraction at high frequency
- **Fatigue**: Decreased force with prolonged stimulation

### Fatigue Mechanisms
- **Metabolic**: ATP depletion, lactic acid accumulation
- **Neural**: Synaptic fatigue, neurotransmitter depletion
- **Muscular**: Ca2+ handling, contractile protein changes
- **Cardiovascular**: Blood flow limitations

## Experimental Parameters

### Stimulation
- **Stimulus strength**: 0-20 mA (threshold determination)
- **Frequency**: 0-100 Hz (summation and tetanus)
- **Duration**: 0-1000 ms (contraction timing)

### Measurement
- **Force**: Contraction strength (N or g)
- **Time**: Contraction and relaxation duration
- **Area**: Force-time integral
- **Rate**: Force development and relaxation

## Expected Results

### Stimulus Strength Response
- **Subthreshold**: No contraction
- **Threshold**: Minimal twitch
- **Linear range**: Force proportional to stimulus
- **Maximum**: No further increase in force

### Frequency Response
- **Low frequency**: Separate twitches
- **Increasing frequency**: Summation begins
- **High frequency**: Tetanus achieved
- **Very high frequency**: Fatigue development

### Time Course
- **Latency**: Delay from stimulus to response
- **Contraction time**: Force development
- **Relaxation time**: Force decline
- **Refractory period**: Cannot respond to new stimulus

## Analysis Questions

### Threshold Determination
- What is the minimum stimulus for muscle activation?
- How does threshold vary between individuals?
- What factors affect threshold (temperature, fatigue, etc.)?

### Summation Effects
- How does frequency affect force production?
- What is the optimal frequency for maximum force?
- When does tetanus occur?

### Fatigue Analysis
- How quickly does fatigue develop?
- What is the pattern of force decline?
- Can fatigue be reversed with rest?

## Clinical Applications

### Physical Therapy
- **Strength training**: Optimal stimulation parameters
- **Rehabilitation**: Progressive resistance exercise
- **Neuromuscular re-education**: Motor control training

### Sports Medicine
- **Performance optimization**: Training intensity and frequency
- **Injury prevention**: Fatigue management
- **Recovery protocols**: Rest and regeneration

### Research Applications
- **Muscle physiology**: Basic research questions
- **Drug development**: Muscle relaxants, stimulants
- **Disease models**: Muscular dystrophy, myasthenia

## Technical Considerations

### Equipment
- **Stimulator**: Constant current or voltage
- **Force transducer**: Load cell or strain gauge
- **Data acquisition**: High sampling rate (>1000 Hz)
- **Analysis software**: Real-time display and recording

### Data Quality
- **Signal-to-noise ratio**: Clear force measurements
- **Calibration**: Accurate force and time measurements
- **Artifact rejection**: Movement and electrical interference
- **Reproducibility**: Consistent experimental conditions

### Safety
- **Electrical safety**: Proper grounding and isolation
- **Subject comfort**: Non-painful stimulation levels
- **Monitoring**: Vital signs and discomfort assessment
- **Emergency procedures**: Stop stimulation if needed

## Future Directions

### Advanced Measurements
- **EMG**: Electrical activity recording
- **Ultrasound**: Muscle architecture changes
- **Biochemical**: Metabolite analysis
- **Genetic**: Individual response variations

### Computational Models
- **Mathematical modeling**: Force prediction
- **Machine learning**: Pattern recognition
- **Virtual reality**: Immersive training
- **Telemedicine**: Remote monitoring

---

*This experiment provides fundamental insights into muscle physiology that are essential for understanding human movement, performance, and rehabilitation.*`
};

export default function ExperimentExplainer({ 
  experiment, 
  isOpen, 
  mode, 
  onToggle, 
  onModeChange 
}: ExperimentExplainerProps) {
  const [markdownText, setMarkdownText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Load markdown content when experiment changes
  useEffect(() => {
    if (experiment?.name) {
      loadMarkdownContent(experiment.name);
    }
  }, [experiment]);

  const loadMarkdownContent = async (experimentName: string) => {
    setIsLoading(true);
    try {
      // Try to load markdown content from constants
      const content = EXPERIMENT_MARKDOWN[experimentName];
      if (content) {
        setMarkdownText(content);
      } else {
        // Fallback to placeholder content if not found
        console.warn(`Markdown content not found for: ${experimentName}, using placeholder content`);
        const placeholderContent = getPlaceholderContent(experimentName);
        setMarkdownText(placeholderContent);
      }
    } catch (error) {
      console.error('Error loading markdown:', error);
      // Fallback to placeholder content on error
      const placeholderContent = getPlaceholderContent(experimentName);
      setMarkdownText(placeholderContent);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlaceholderContent = (experimentName: string): string => {
    switch (experimentName) {
      case 'Cardiac Muscle Physiology':
        return `# Cardiac Muscle Physiology

## Overview
This experiment explores the electrical properties of cardiac muscle tissue, including action potential generation and propagation.

## Key Concepts
- Cardiac action potential phases
- Ion channel dynamics
- Conduction system physiology
- Pharmacological effects

## Parameters
- Stimulus strength and frequency
- Temperature effects
- Ion concentrations
- Drug interventions

*Note: This is placeholder content. The actual markdown file will be loaded dynamically.*`;
      
      case 'Cardiomyocyte Potential':
        return `# Cardiomyocyte Potential

## Overview
Advanced cardiac electrophysiology simulation with detailed ion channel modeling.

## Features
- Detailed ion channel kinetics
- Advanced mathematical models
- Real-time simulation
- Comprehensive parameter control

*Note: This is placeholder content. The actual markdown file will be loaded dynamically.*`;
      
      case 'Skeletal Muscle Response':
        return `# Skeletal Muscle Response

## Overview
Investigate the relationship between stimulus strength and muscle contraction.

## Key Concepts
- Muscle contraction physiology
- Stimulus-response relationships
- Force generation
- Fatigue mechanisms

*Note: This is placeholder content. The actual markdown file will be loaded dynamically.*`;
      
      default:
        return `# ${experimentName}

## Overview
Documentation for this experiment will be loaded from the corresponding markdown file.

## Status
This is placeholder content. The actual markdown file will be loaded dynamically from: \`${experiment?.markdownFile}\`

*Note: Markdown files should be placed in the \`public/markdown/\` directory.*`;
    }
  };

  const handleModeToggle = () => {
    onModeChange(mode === 'side' ? 'cover' : 'side');
  };

  if (!experiment) {
    return null;
  }

  // Convert markdown to HTML
  const htmlContent = marked(markdownText);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-lg font-bold text-emerald-600 dark:text-emerald-300">{experiment.name}</h2>
        <div className="hidden lg:flex items-center gap-2">
          <button 
            onClick={handleModeToggle}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            title={mode === 'cover' ? 'Switch to side-by-side mode' : 'Switch to cover mode'}
          >
            {mode === 'cover' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            )}
          </button>
          <button 
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
            title="Close documentation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <button 
          onClick={onToggle} 
          className="lg:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" 
          title="Close documentation"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">
            Loading documentation...
          </div>
        ) : (
          <div className="p-4 prose prose-sm max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
          </div>
        )}
      </div>
    </div>
  );
} 