import { useState, useEffect, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import type { Experiment } from '../types/experiment';

interface ExperimentExplainerProps {
  experiment: Experiment | null;
  mode: 'side' | 'cover';
  onToggle: () => void;
  onModeChange: (mode: 'side' | 'cover') => void;
}

// Markdown content for each experiment (fallback)
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
Blokują kanały napięciozależne L-Ca²⁺ w Fazie 2, co wpływa hamująco na powstawanie sprzężenia pobudzeniowo-skurczowego i uniemożliwia powstanie repolaryzacji miocytu.`,
  'Cardiomyocyte Potential Template': `# Cardiomyocyte Potential Experiment

## Overview
Advanced cardiac electrophysiology simulation with detailed ion channel modeling and real-time visualization.

## Features
- Real-time action potential simulation
- Ion channel dynamics modeling
- Drug effects simulation
- Interactive parameter control
- Comprehensive data analysis

## Parameters
- Stimulus strength and frequency
- Temperature effects
- Ion concentrations
- Drug interventions
- Cell type selection

## Expected Results
- Action potential waveforms
- Ion current analysis
- Drug effect quantification
- Conduction velocity measurements

*This is a template for advanced cardiac electrophysiology experiments.*`,
  'Skeletal Muscle Response': `# Skeletal Muscle Response Experiment

## Overview
Investigate the relationship between stimulus strength and muscle contraction in skeletal muscle tissue.

## Key Concepts
- Muscle contraction physiology
- Stimulus-response relationships
- Force generation mechanisms
- Fatigue and recovery processes

## Parameters
- Stimulus strength (voltage)
- Stimulus frequency
- Muscle length
- Temperature
- Fatigue protocols

## Expected Results
- Force-frequency relationships
- Length-tension curves
- Fatigue curves
- Recovery kinetics

*This experiment provides fundamental insights into muscle physiology.*`
};

export default function ExperimentExplainer({ experiment, mode, onToggle, onModeChange }: ExperimentExplainerProps) {
  const [markdownText, setMarkdownText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Konfiguracja marked
  const configureMarked = useCallback(() => {
    try {
      marked.setOptions({
        gfm: true,
        breaks: true
      });
    } catch (error) {
      console.error('Error configuring marked:', error);
    }
  }, []);

  const loadMarkdownContent = useCallback(async (experimentName: string) => {
    setIsLoading(true);
    try {
      // Próbuj wczytać z pliku w public/markdown/
      const fileName = experimentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      console.log('Trying to load markdown file:', `/markdown/${fileName}.md`);
      
      const response = await fetch(`/markdown/${fileName}.md`);
      
      if (response.ok) {
        const content = await response.text();
        console.log('Loaded markdown content:', content.substring(0, 100) + '...');
        setMarkdownText(content);
      } else {
        console.log('Markdown file not found, using fallback content');
        // Fallback do hardcoded content
        const content = EXPERIMENT_MARKDOWN[experimentName];
        if (content) {
          setMarkdownText(content);
        } else {
          console.warn(`Markdown content not found for: ${experimentName}, using placeholder content`);
          const placeholderContent = getPlaceholderContent(experimentName);
          setMarkdownText(placeholderContent);
        }
      }
    } catch (error) {
      console.error('Error loading markdown:', error);
      // Fallback do hardcoded content
      const content = EXPERIMENT_MARKDOWN[experimentName];
      if (content) {
        setMarkdownText(content);
      } else {
        const placeholderContent = getPlaceholderContent(experimentName);
        setMarkdownText(placeholderContent);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    configureMarked();
  }, [configureMarked]);

  useEffect(() => {
    if (experiment?.name) {
      loadMarkdownContent(experiment.name);
    }
  }, [experiment, loadMarkdownContent]);

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
      
      case 'Cardiomyocyte Potential Template':
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

## ⚠️ Brak opisu eksperymentu

**Nie mamy jeszcze opisu dla tego eksperymentu.**

### Co to oznacza?
- Eksperyment jest dostępny do uruchomienia
- Dokumentacja nie została jeszcze przygotowana
- Opis zostanie dodany w przyszłej aktualizacji

### Status
- ✅ Eksperyment: **Dostępny**
- ❌ Dokumentacja: **W przygotowaniu**

---

*To jest placeholder. Prawdziwy opis eksperymentu zostanie załadowany z pliku markdown gdy będzie dostępny.*`;
    }
  };

  // Konwertuj markdown na HTML z odpowiednimi klasami CSS
  const htmlContent = useMemo(() => {
    if (!markdownText) return '';
    try {
      const result = marked(markdownText);
      console.log('Marked result type:', typeof result, 'Value:', result);
      
      // Upewnij się, że wynik jest stringiem
      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object' && 'html' in result) {
        return String(result.html);
      } else {
        console.error('Unexpected marked result:', result);
        return `<p class="text-red-600 dark:text-red-400">Error: Unexpected content format</p>`;
      }
    } catch (error) {
      console.error('Error converting markdown to HTML:', error);
      return `<p class="text-red-600 dark:text-red-400">Error loading content: ${error instanceof Error ? error.message : 'Unknown error'}</p>`;
    }
  }, [markdownText]);

  return (
    <div className={`fixed top-16 right-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 shadow-2xl transition-all duration-300 ease-in-out z-40 ${mode === 'side' ? 'w-[32rem] lg:block' : 'w-full lg:w-[36rem]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {experiment?.name || 'Documentation'}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Mode Toggle */}
          <button
            onClick={() => onModeChange(mode === 'side' ? 'cover' : 'side')}
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
          
          {/* Close Button */}
          <button
            onClick={onToggle}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {isLoading ? (
          <div className="p-4 text-center text-gray-600 dark:text-gray-400">Loading documentation...</div>
        ) : (
          <div className="p-6 prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-700 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-ul:text-gray-700 dark:prose-ul:text-gray-300 prose-ol:text-gray-700 dark:prose-ol:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-hr:border-gray-300 dark:prose-hr:border-gray-600 prose-headings:font-sans prose-p:font-sans prose-strong:font-semibold prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-p:leading-relaxed prose-p:mb-4 prose-ul:mb-4 prose-ol:mb-4 prose-blockquote:pl-4 prose-blockquote:border-l-4 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm">
            <div 
              className="markdown-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }} 
            />
          </div>
        )}
      </div>
    </div>
  );
} 