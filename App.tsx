
import React, { useState, useCallback, useEffect } from 'react';
import Home from './components/views/Home';
import Quiz from './components/views/Quiz';
import Summary from './components/views/Summary';
import { type QuizResult } from './types';
import Header from './components/ui/Header';
import AccessibilityProvider from './contexts/AccessibilityContext';

type View = 'home' | 'quiz' | 'summary';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const startQuiz = useCallback(() => {
    setView('quiz');
    setQuizResult(null);
  }, []);

  const showSummary = useCallback((result: QuizResult) => {
    setQuizResult(result);
    setView('summary');
  }, []);

  const playAgain = useCallback(() => {
    startQuiz();
  }, [startQuiz]);
  
  const goToHome = useCallback(() => {
    setView('home');
    setQuizResult(null);
  }, []);
  
  const renderView = () => {
    switch (view) {
      case 'quiz':
        return <Quiz onQuizEnd={showSummary} />;
      case 'summary':
        return quizResult ? <Summary result={quizResult} onPlayAgain={playAgain} onGoHome={goToHome} /> : <Home onStartQuiz={startQuiz} />;
      case 'home':
      default:
        return <Home onStartQuiz={startQuiz} />;
    }
  };
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (view !== 'home') {
                goToHome();
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, goToHome]);

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text font-sans transition-colors duration-300">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:p-3 focus:bg-accent focus:text-white rounded-lg">
            Saltar al contenido
        </a>
        <Header />
        <main id="main-content" className="container mx-auto p-4 md:p-6">
          {renderView()}
        </main>
        <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
            FoxMind Quiz - A Gemini-powered learning experience.
        </footer>
      </div>
    </AccessibilityProvider>
  );
};

export default App;
