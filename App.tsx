import React, { useState, useCallback, useEffect } from 'react';
import Home from './components/views/Home';
import Quiz from './components/views/Quiz';
import Summary from './components/views/Summary';
import Feedback from './components/views/Feedback';
import NickModal from './components/modals/NickModal';
import { type QuizResult } from './types';
import Header from './components/ui/Header';
import AccessibilityProvider from './contexts/AccessibilityContext';
import ConfigModal from './components/modals/ConfigModal';

// 🗂️ ESTRUCTURA: Define las vistas principales de la aplicación.
type View = 'home' | 'quiz' | 'feedback' | 'summary';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [playerNick, setPlayerNick] = useState<string>('');
  const [isNickModalOpen, setIsNickModalOpen] = useState<boolean>(false);

  const handlePlayClick = useCallback(() => {
    setIsNickModalOpen(true);
  }, []);

  const handleStartQuiz = useCallback((nick: string) => {
    setPlayerNick(nick);
    setQuizResult(null);
    setIsNickModalOpen(false);
    setView('quiz');
  }, []);

  const handleQuizEnd = useCallback((result: QuizResult) => {
    setQuizResult(result);
    setView('feedback');
  }, []);

  const handleFeedbackTimeout = useCallback(() => {
    setView('summary');
  }, []);

  const goToHome = useCallback(() => {
    setView('home');
    setQuizResult(null);
    setPlayerNick('');
  }, []);
  
  // 🗂️ ESTRUCTURA: Este es el "router" principal de la aplicación. Renderiza la vista activa.
  const renderView = () => {
    switch (view) {
      case 'quiz':
        return <Quiz onQuizEnd={handleQuizEnd} />;
      case 'feedback':
        return quizResult ? <Feedback result={quizResult} onTimeout={handleFeedbackTimeout} /> : <Home onStartQuiz={handlePlayClick} />;
      case 'summary':
        return quizResult && playerNick ? <Summary result={quizResult} playerNick={playerNick} onGoHome={goToHome} /> : <Home onStartQuiz={handlePlayClick} />;
      case 'home':
      default:
        return <Home onStartQuiz={handlePlayClick} />;
    }
  };
  
  // ♿ ACCESIBILIDAD: Permite al usuario volver a la pantalla de inicio presionando la tecla 'Escape'.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (view !== 'home' && !isNickModalOpen) {
                goToHome();
            }
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [view, goToHome, isNickModalOpen]);

  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-light-bg text-light-text dark:bg-dark-bg dark:text-dark-text font-sans transition-colors duration-300 flex flex-col">
        {/* ♿ ACCESIBILIDAD: Enlace "Saltar al contenido" para usuarios de teclado y lectores de pantalla. Es el primer elemento enfocable. */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:p-3 focus:bg-accent focus:text-white rounded-lg">
            Saltar al contenido
        </a>
        
        {/* 🗂️ ESTRUCTURA: El encabezado de la aplicación. Puedes modificarlo en `components/ui/Header.tsx`. */}
        <Header />
        
        {/* 🗂️ ESTRUCTURA: Contenedor principal donde se renderizan las vistas (home, quiz, summary). */}
        <main id="main-content" className="container mx-auto p-4 md:p-6 flex-grow flex flex-col">
          {renderView()}
        </main>
        
        {/* 🔧 EDITABLE: El pie de página de la aplicación. Puedes cambiar el texto o añadir más información. */}
        <footer className="text-center p-4 text-sm text-gray-500 dark:text-gray-400">
            FoxMind Quiz - A Gemini-powered learning experience.
        </footer>
      </div>
      
      {/* 🗂️ ESTRUCTURA: El modal de configuración es global y se renderiza aquí. Su contenido está en `components/modals/ConfigModal.tsx`. */}
      <ConfigModal />
      <NickModal
        isOpen={isNickModalOpen}
        onClose={() => setIsNickModalOpen(false)}
        onStart={handleStartQuiz}
      />
    </AccessibilityProvider>
  );
};

export default App;