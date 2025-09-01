import React, { useMemo, useEffect } from 'react';
import { type QuizResult, Area } from '../../types';
import { saveScore } from '../../services/leaderboardService';
import { pushRecentIds } from '../../services/questionService';
import { SUMMARY_AUTO_DURATION_MS } from '../../constants';

interface SummaryProps {
  result: QuizResult;
  playerNick: string;
  onGoHome: () => void;
}

// 🧮 CONTENIDO — 🔧 EDITABLE: Cambia los emojis o íconos para cada área temática.
const areaIcons: { [key in Area]: string } = {
  [Area.Matematica]: '🔢',
  [Area.Lengua]: '✍️',
  [Area.CsNaturales]: '🌿',
  [Area.CsSociales]: '🏛️',
};

const Summary: React.FC<SummaryProps> = ({ result, playerNick, onGoHome }) => {
  const { totalCorrect, byArea } = useMemo(() => {
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
    
    return { totalCorrect, byArea };
  }, [result.sessionResults]);

  useEffect(() => {
    // UX: Guarda los IDs de las preguntas de esta sesión para evitar repetirlas pronto.
    const questionIds = result.sessionResults.map(r => r.question.id);
    pushRecentIds(questionIds);
    
    // Guardado automático en el leaderboard
    if (playerNick) {
      saveScore(playerNick, totalCorrect, result.totalTimeSeconds);
    }

    // ⏱️ TIEMPO: Vuelve al inicio automáticamente después de un tiempo.
    const timer = setTimeout(() => {
      onGoHome();
    }, SUMMARY_AUTO_DURATION_MS);
    
    return () => clearTimeout(timer);
  }, [result, playerNick, onGoHome, totalCorrect]);

  return (
    <div className="flex-grow flex flex-col justify-center">
      <div className="max-w-3xl w-full mx-auto p-4 md:p-8 bg-light-card dark:bg-dark-card rounded-xl shadow-2xl text-center">
        {/* 🧮 CONTENIDO — 🔧 EDITABLE: Cambia los textos de la pantalla de resumen. */}
        <h2 className="font-display text-4xl font-extrabold text-primary mb-2">Resumen de la Partida</h2>
        <p className="text-xl mb-6 text-gray-700 dark:text-gray-300">¡Resultado guardado para <strong>{playerNick}</strong>!</p>

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
        
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Volviendo al inicio en {SUMMARY_AUTO_DURATION_MS / 1000} segundos...
        </p>
      </div>
    </div>
  );
};

export default Summary;