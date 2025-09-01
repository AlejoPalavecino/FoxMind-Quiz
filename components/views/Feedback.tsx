import React, { useState, useEffect, useMemo } from 'react';
import { getGeminiFeedback, PerformanceData } from '../../services/geminiService';
import { type QuizResult, Area } from '../../types';
import { FEEDBACK_AUTO_DURATION_MS, TOTAL_QUESTIONS } from '../../constants';

interface FeedbackProps {
  result: QuizResult;
  onTimeout: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ result, onTimeout }) => {
  const [feedback, setFeedback] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const performanceData = useMemo<PerformanceData>(() => {
    const totalCorrect = result.sessionResults.filter(r => r.isCorrect).length;
    const initialAreaStats = {
        [Area.Matematica]: { correct: 0, total: 0 },
        [Area.Lengua]: { correct: 0, total: 0 },
        [Area.CsNaturales]: { correct: 0, total: 0 },
        [Area.CsSociales]: { correct: 0, total: 0 },
    };
    const byArea = result.sessionResults.reduce((acc, r) => {
        const area = r.question.area;
        acc[area].total++;
        if (r.isCorrect) acc[area].correct++;
        return acc;
    }, initialAreaStats);
    let weakestArea: Area | null = null;
    let minPercentage = 101;
    (Object.keys(byArea) as Area[]).forEach(area => {
        const stats = byArea[area];
        if (stats.total > 0) {
            const percentage = (stats.correct / stats.total) * 100;
            if (percentage < minPercentage) {
                minPercentage = percentage;
                weakestArea = area;
            }
        }
    });
    return {
        totalQuestions: TOTAL_QUESTIONS,
        totalCorrect,
        totalTimeSeconds: result.totalTimeSeconds,
        byArea,
        weakestArea,
        sessionResults: result.sessionResults.map(r => ({ area: r.question.area, isCorrect: r.isCorrect })),
    };
  }, [result]);


  useEffect(() => {
    // ⏱️ TIEMPO: Inicia el temporizador para pasar automáticamente al resumen.
    const timer = setTimeout(() => {
      onTimeout();
    }, FEEDBACK_AUTO_DURATION_MS);

    const fetchFeedback = async () => {
      try {
        const generatedFeedback = await getGeminiFeedback(performanceData);
        setFeedback(generatedFeedback);
      } catch (err) {
        setError('No se pudo generar el feedback. Se mostrará un mensaje genérico.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeedback();

    return () => clearTimeout(timer);
  }, [performanceData, onTimeout]);

  return (
    <div className="flex-grow flex flex-col justify-center items-center">
      <section className="max-w-3xl w-full mx-auto p-4 md:p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl text-center">
        <h1 className="font-display text-4xl font-extrabold text-accent mb-4">Feedback Personalizado</h1>
        <div 
          aria-live="polite" 
          className="prose dark:prose-invert max-w-none text-left min-h-[200px]"
        >
          {isLoading && <p>Generando feedback con Gemini... 🧠</p>}
          {error && <p className="text-red-500">{error}</p>}
          {feedback && (
            <div dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
          )}
        </div>
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Avanzando al resumen en {FEEDBACK_AUTO_DURATION_MS / 1000} segundos...
        </div>
      </section>
    </div>
  );
};

export default Feedback;