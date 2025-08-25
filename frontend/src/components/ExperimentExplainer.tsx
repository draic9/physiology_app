import { useState, useEffect, useCallback, useMemo } from 'react';
import { marked } from 'marked';
import type { Experiment } from '../types/experiment';

interface ExperimentExplainerProps {
  experiment: Experiment | null;
  mode: 'side' | 'cover';
  onToggle: () => void;
  onModeChange: (mode: 'side' | 'cover') => void;
}

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
      // console.error('Error configuring marked:', error); // Removed console.error
    }
  }, []);

  const loadMarkdownContent = useCallback(async (experimentName: string) => {
    setIsLoading(true);
    try {
      // Próbuj wczytać z pliku w public/markdown/
      const fileName = experimentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const response = await fetch(`/markdown/${fileName}.md`);
      
      if (response.ok) {
        const content = await response.text();
        setMarkdownText(content);
      } else {
        setMarkdownText(getFallbackContent(experimentName));
      }
    } catch (error) {
      setMarkdownText(getFallbackContent(experimentName));
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

  const getFallbackContent = (experimentName: string): string => {
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
      
      // Upewnij się, że wynik jest stringiem
      if (typeof result === 'string') {
        return result;
      } else if (result && typeof result === 'object' && 'html' in result) {
        return String(result.html);
      } else {
        return `<p class="text-red-600 dark:text-red-400">Error: Unexpected content format</p>`;
      }
    } catch (error) {
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
          {/* Mode Toggle - Hidden on mobile */}
          <button
            onClick={() => onModeChange(mode === 'side' ? 'cover' : 'side')}
            className="hidden lg:block p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
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