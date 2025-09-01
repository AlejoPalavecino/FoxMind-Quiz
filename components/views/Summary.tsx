
import React, { useMemo, useState } from 'react';
import { type QuizResult, Area } from '../../types';
import Button from '../ui/Button';
import LeaderboardModal from '../modals/LeaderboardModal';
import GeminiFeedbackModal from '../modals/GeminiFeedbackModal';

interface SummaryProps {
  result: QuizResult;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const areaIcons: { [key in Area]: string } = {
  [Area.Matematica]: '🔢',
  [Area.Lengua]: '✍️',
  [Area.CsNaturales]: '🌿',
  [Area.CsSociales]: '🏛️',
};

const Summary: React.FC<SummaryProps> = ({ result, onPlayAgain, onGoHome }) => {
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  const { totalCorrect, byArea, weakestArea } = useMemo(() => {
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
      if (r.isCorrect) {
        acc[area].correct++;
      }
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

    return { totalCorrect, byArea, weakestArea };
  }, [result.sessionResults]);

  const handleSaveScore = () => {
    setIsLeaderboardOpen(true);
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl text-center">
      <h2 className="font-display text-4xl font-extrabold text-primary mb-2">¡Partida Terminada!</h2>
      <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">Este es tu resumen de desempeño.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-2xl font-bold">
        <div className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow">
          Puntaje Final: <span className="text-primary">{totalCorrect} / {result.sessionResults.length}</span>
        </div>
        <div className="p-6 bg-white dark:bg-slate-700 rounded-lg shadow">
          Tiempo Total: <span className="text-primary">{result.totalTimeSeconds}s</span>
        </div>
      </div>
      
      <h3 className="font-display text-2xl font-bold mb-4">Desglose por Área</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {(Object.keys(byArea) as Area[]).map(area => {
          const stats = byArea[area];
          if (stats.total === 0) return null;
          const percentage = Math.round((stats.correct / stats.total) * 100);
          return (
            <div key={area} className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow">
              <div className="text-4xl mb-2">{areaIcons[area]}</div>
              <div className="font-bold">{area}</div>
              <div className="text-lg">{stats.correct} / {stats.total} ({percentage}%)</div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button onClick={onPlayAgain} size="lg" variant="primary">Jugar de Nuevo</Button>
        <Button onClick={handleSaveScore} size="lg" variant="secondary">Guardar Puntaje</Button>
        <Button onClick={() => setIsFeedbackModalOpen(true)} size="lg" variant="accent">Ver Feedback Personalizado</Button>
        <Button onClick={onGoHome} size="lg" variant="secondary">Ir al Inicio</Button>
      </div>
      
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        newScore={{ score: totalCorrect, time: result.totalTimeSeconds }}
      />
      
      <GeminiFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={() => setIsFeedbackModalOpen(false)}
        performanceData={{
          totalQuestions: result.sessionResults.length,
          totalCorrect,
          totalTimeSeconds: result.totalTimeSeconds,
          byArea,
          weakestArea,
          sessionResults: result.sessionResults.map(r => ({area: r.question.area, isCorrect: r.isCorrect})),
        }}
      />
    </div>
  );
};

export default Summary;
