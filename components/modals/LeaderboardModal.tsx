
import React, { useState, useEffect } from 'react';
import { getLeaderboard, saveScore, resetLeaderboard } from '../../services/leaderboardService';
import { type LeaderboardEntry } from '../../types';
import Button from '../ui/Button';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  newScore?: { score: number; time: number };
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ isOpen, onClose, newScore }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [nick, setNick] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLeaderboard(getLeaderboard());
    }
  }, [isOpen]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (nick.trim() && newScore) {
      saveScore(nick.trim(), newScore.score, newScore.time);
      setNick('');
      setLeaderboard(getLeaderboard());
      onClose();
    }
  };

  const handleReset = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todo el leaderboard? Esta acción no se puede deshacer.')) {
        resetLeaderboard();
        setLeaderboard([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="leaderboard-title"
    >
      <div
        className="bg-light-card dark:bg-dark-card rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="leaderboard-title" className="font-display text-3xl font-bold text-primary">Leaderboard</h2>
          <Button onClick={onClose} variant="secondary" size="sm" aria-label="Cerrar modal">X</Button>
        </div>
        
        {newScore && (
          <form onSubmit={handleSave} className="mb-6 p-4 bg-white dark:bg-slate-700 rounded-lg">
            <h3 className="font-bold text-lg mb-2">¡Gran puntaje! Guárdalo:</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={nick}
                onChange={(e) => setNick(e.target.value)}
                placeholder="Ingresa tu nick"
                maxLength={15}
                className="flex-grow p-2 rounded-md bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        )}
        
        <div className="overflow-y-auto flex-grow">
          {leaderboard.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-300 dark:border-gray-600">
                  <th className="p-2 font-display">#</th>
                  <th className="p-2 font-display">Nick</th>
                  <th className="p-2 font-display">Puntaje</th>
                  <th className="p-2 font-display">Tiempo</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700">
                    <td className="p-2 font-bold">{index + 1}</td>
                    <td className="p-2">{entry.nick}</td>
                    <td className="p-2">{entry.score}</td>
                    <td className="p-2">{entry.timeSeconds}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-8 text-gray-500">El leaderboard está vacío. ¡Juega para ser el primero!</p>
          )}
        </div>

        <div className="mt-6 text-right">
            <Button onClick={handleReset} variant="secondary">Resetear Leaderboard</Button>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardModal;
