import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import AccessibilityControls from '../ui/AccessibilityControls';
import { getLeaderboard, resetLeaderboard } from '../../services/leaderboardService';
import { type LeaderboardEntry } from '../../types';

interface HomeProps {
  onStartQuiz: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartQuiz }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el leaderboard? Esta acción no se puede deshacer.')) {
      resetLeaderboard();
      setLeaderboard([]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-2xl w-full">
        <h2 className="font-display text-4xl md:text-5xl font-extrabold text-primary mb-4">
          Bienvenido a FoxMind Quiz
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
          Pon a prueba tus conocimientos en un desafío de 6 preguntas contra el reloj. ¡Demuestra tu agilidad mental y consigue el mejor puntaje!
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onStartQuiz} size="lg" className="w-full sm:w-auto">
            Jugar
          </Button>
        </div>
        <AccessibilityControls />

        <section className="mt-8 w-full bg-light-card dark:bg-dark-card rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700" aria-labelledby="leaderboard-heading">
          <h3 id="leaderboard-heading" className="font-display font-bold text-2xl mb-4 text-center">Leaderboard (Top 5)</h3>
          <div className="overflow-x-auto">
            {leaderboard.length > 0 ? (
              <table className="w-full text-left table-auto">
                <caption className="sr-only">Tabla de posiciones de los 5 mejores jugadores</caption>
                <thead>
                  <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                    <th className="p-2 font-display text-sm sm:text-base">#</th>
                    <th className="p-2 font-display text-sm sm:text-base">Nick</th>
                    <th className="p-2 font-display text-sm sm:text-base text-center">Puntaje</th>
                    <th className="p-2 font-display text-sm sm:text-base text-center">Tiempo</th>
                    <th className="p-2 font-display text-sm sm:text-base">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.slice(0, 5).map((entry, index) => (
                    <tr key={index} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                      <td className="p-2 font-bold">{index + 1}</td>
                      <td className="p-2 truncate" title={entry.nick}>{entry.nick}</td>
                      <td className="p-2 text-center">{entry.score}</td>
                      <td className="p-2 text-center">{entry.timeSeconds}s</td>
                      <td className="p-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">{new Date(entry.dateISO).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center p-4 text-gray-500 dark:text-gray-400">El leaderboard está vacío. ¡Juega para ser el primero!</p>
            )}
          </div>
          <div className="mt-6 text-center">
            <Button onClick={handleReset} variant="secondary" size="sm">Resetear Leaderboard</Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
