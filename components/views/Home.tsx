import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
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
      // FIX: Se ha refactorizado la lógica para ser más robusta.
      // 1. Primero, se borran los datos del localStorage.
      resetLeaderboard();
      // 2. Después, se vuelve a leer desde el localStorage (que ahora estará vacío)
      //    para asegurar que el estado de React se actualice con la fuente de verdad.
      const freshLeaderboard = getLeaderboard();
      setLeaderboard(freshLeaderboard);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          <div className="flex flex-col items-center text-center gap-6 lg:pt-8">
            {/* 🧮 CONTENIDO — 🔧 EDITABLE: Cambia el título y el texto de bienvenida de la aplicación. */}
            <h2 className="font-display text-4xl md:text-5xl font-extrabold text-primary">
              Bienvenido a FoxMind Quiz
            </h2>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-prose">
              Pon a prueba tus conocimientos en un desafío de 6 preguntas contra el reloj. ¡Demuestra tu agilidad mental y consigue el mejor puntaje!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
              <Button onClick={onStartQuiz} size="lg" className="w-full sm:w-auto">
                Jugar
              </Button>
            </div>
          </div>

          <section className="w-full bg-light-card dark:bg-dark-card rounded-lg shadow-md p-4 md:p-6 border border-gray-200 dark:border-gray-700" aria-labelledby="leaderboard-heading">
            {/* 🔧 EDITABLE: Cambia el título del leaderboard. */}
            <h3 id="leaderboard-heading" className="font-display font-bold text-2xl mb-4 text-center">Leaderboard (Top 5)</h3>
            <div className="overflow-x-auto">
              {leaderboard.length > 0 ? (
                <table className="w-full text-left table-auto min-w-[500px]">
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
                    {/* 🔧 EDITABLE: Cambia el `.slice(0, 5)` para mostrar más o menos jugadores en el Top. */}
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
            {leaderboard.length > 0 && (
              <div className="mt-6 text-center">
                <Button onClick={handleReset} variant="secondary" size="sm">Resetear Leaderboard</Button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Home;