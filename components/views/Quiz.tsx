import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getQuizQuestions } from '../../services/questionService';
import { TIME_LIMIT_SECONDS, TOTAL_QUESTIONS } from '../../constants';
import { type Question, type SessionResult, Area } from '../../types';
import Button from '../ui/Button';
import { useAccessibility } from '../../hooks/useAccessibility';

interface QuizProps {
  onQuizEnd: (result: { sessionResults: SessionResult[], totalTimeSeconds: number }) => void;
}

// 🎨 MARCA — 🔧 EDITABLE: Define los colores de fondo para cada área temática del quiz.
// 🛠️ CÓMO CAMBIAR: Usa clases de color de Tailwind CSS.
const areaColors: { [key in Area]: string } = {
    [Area.Matematica]: 'bg-sky-500',
    [Area.Lengua]: 'bg-rose-500',
    [Area.CsNaturales]: 'bg-green-500',
    [Area.CsSociales]: 'bg-amber-500',
};

const Quiz: React.FC<QuizProps> = ({ onQuizEnd }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT_SECONDS);
  const [sessionResults, setSessionResults] = useState<SessionResult[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const startTimeRef = useRef(Date.now());
  const timerRef = useRef<number | null>(null);

  const { speak, isTtsEnabled } = useAccessibility();

  const endQuiz = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const endTime = Date.now();
    const totalTimeSeconds = Math.round((endTime - startTimeRef.current) / 1000);
    onQuizEnd({ sessionResults, totalTimeSeconds });
  }, [onQuizEnd, sessionResults]);

  useEffect(() => {
    setQuestions(getQuizQuestions());
    startTimeRef.current = Date.now();

    // ⏱️ TIEMPO: Este es el temporizador principal del juego.
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  // ♿ ACCESIBILIDAD: Efecto para leer la pregunta en voz alta cuando el TTS está activado.
  useEffect(() => {
    if (currentQuestion && isTtsEnabled) {
      // 🧮 CONTENIDO — 🔧 EDITABLE: Modifica esta plantilla para cambiar cómo se leen las preguntas y opciones.
      const textToSpeak = `Pregunta de ${currentQuestion.area}. ${currentQuestion.prompt}. Opción A: ${currentQuestion.options[0]}. Opción B: ${currentQuestion.options[1]}. Opción C: ${currentQuestion.options[2]}. Opción D: ${currentQuestion.options[3]}.`;
      speak(textToSpeak, { interrupt: true });
    }
  }, [currentQuestion, isTtsEnabled, speak]);


  const handleAnswer = (selectedIndex: number) => {
    if (isAnswered) return;

    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    setSelectedAnswer(selectedIndex);
    setIsAnswered(true);

    const timeAtAnswerMs = Date.now() - startTimeRef.current;
    setSessionResults(prev => [
      ...prev,
      {
        question: currentQuestion,
        chosenIndex: selectedIndex,
        isCorrect,
        timeAtAnswerMs,
      },
    ]);
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < TOTAL_QUESTIONS - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      endQuiz();
    }
  };
  
  const repeatQuestion = useCallback(() => {
     if (currentQuestion) {
        const textToSpeak = `Pregunta de ${currentQuestion.area}. ${currentQuestion.prompt}. Opción A: ${currentQuestion.options[0]}. Opción B: ${currentQuestion.options[1]}. Opción C: ${currentQuestion.options[2]}. Opción D: ${currentQuestion.options[3]}.`;
        speak(textToSpeak, { interrupt: true });
    }
  }, [currentQuestion, speak]);
  
  // ♿ ACCESIBILIDAD: Atajos de teclado para responder, avanzar y repetir la pregunta.
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnswered) {
        if (e.key.toLowerCase() === 'n' || e.key === 'Enter') handleNext();
      } else {
        if (e.key >= '1' && e.key <= '4') {
          handleAnswer(parseInt(e.key, 10) - 1);
        }
      }
      if (e.key.toLowerCase() === 'r') {
        repeatQuestion();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAnswered, repeatQuestion]);
  

  if (!currentQuestion) {
    return <div className="text-center p-8">Cargando preguntas...</div>;
  }
  
  const timePercentage = (timeLeft / TIME_LIMIT_SECONDS) * 100;

  return (
    <div className="flex-grow flex flex-col justify-center">
        <div className="max-w-3xl w-full mx-auto p-4 md:p-6 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="font-display font-bold text-lg">Pregunta {currentQuestionIndex + 1}/{TOTAL_QUESTIONS}</div>
            <div className="w-full sm:w-1/2">
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-4 relative">
                    <div 
                        className="bg-primary h-4 rounded-full transition-all duration-500" 
                        style={{ width: `${timePercentage}%` }}
                    ></div>
                    <span className="absolute inset-0 text-center text-xs font-bold text-white leading-4" aria-live="polite">
                    Tiempo restante: {timeLeft}s
                    </span>
                </div>
            </div>
            <div className="font-display font-bold text-lg">Puntaje: {sessionResults.filter(r => r.isCorrect).length}</div>
        </div>
        
        {/* Question */}
        <div className="text-center p-4 border-b-2 border-gray-200 dark:border-gray-700 mb-6">
            <span className={`px-3 py-1 text-sm font-bold text-white rounded-full ${areaColors[currentQuestion.area]}`}>{currentQuestion.area}</span>
            <h3 className="text-2xl md:text-3xl font-display font-bold mt-4 mb-2">{currentQuestion.prompt}</h3>
        </div>
        
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => {
            const isCorrect = index === currentQuestion.correctIndex;
            const isSelected = index === selectedAnswer;
            let buttonClass = 'border-2 border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-primary';
            if (isAnswered) {
                if (isCorrect) {
                    buttonClass = 'bg-green-500 text-white border-green-500 ring-4 ring-green-300';
                } else if (isSelected) {
                    buttonClass = 'bg-red-500 text-white border-red-500 ring-4 ring-red-300';
                } else {
                    buttonClass = 'border-2 border-gray-300 dark:border-gray-600 opacity-60';
                }
            }
            
            return (
                <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={isAnswered}
                className={`p-4 rounded-lg text-left w-full transition-all duration-200 min-h-[44px] flex items-center ${buttonClass}`}
                >
                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                <span>{option}</span>
                </button>
            )
            })}
        </div>
        
        {/* Feedback and Next Button */}
        {isAnswered && (
            <div className="mt-6 text-center">
                <div aria-live="assertive" className="mb-4 font-bold text-lg">
                    {selectedAnswer === currentQuestion.correctIndex ? (
                        <p className="text-green-600 dark:text-green-400">¡Correcto!</p>
                    ) : (
                        <p className="text-red-600 dark:text-red-400">Incorrecto. La respuesta correcta era: {currentQuestion.options[currentQuestion.correctIndex]}</p>
                    )}
                </div>
                <Button onClick={handleNext} size="lg">
                    Siguiente
                </Button>
            </div>
        )}
        
        {isTtsEnabled && !isAnswered && (
            <div className="text-center mt-6">
                <Button onClick={repeatQuestion} variant="secondary">Repetir Pregunta</Button>
            </div>
        )}
        </div>
    </div>
  );
};

export default Quiz;