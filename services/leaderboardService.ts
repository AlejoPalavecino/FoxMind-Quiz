import { LEADERBOARD_KEY } from '../constants';
import { type LeaderboardEntry } from '../types';

/**
 * Obtiene las entradas del leaderboard desde localStorage y las ordena.
 * 🔧 EDITABLE: La lógica de ordenamiento actual es:
 * 1. Mayor puntaje primero.
 * 2. En caso de empate, menor tiempo primero.
 * Puedes cambiar los criterios en la función `sort`.
 * @returns {LeaderboardEntry[]} Un array de entradas del leaderboard ordenado.
 */
export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    const entries: LeaderboardEntry[] = JSON.parse(data);
    
    // Ordena por puntaje (descendente) y luego por tiempo (ascendente).
    return entries.sort((a, b) => {
        if (b.score !== a.score) {
            return b.score - a.score;
        }
        return a.timeSeconds - b.timeSeconds;
    });

  } catch (error) {
    console.error("Failed to get leaderboard from localStorage", error);
    return [];
  }
};

/**
 * Guarda una nueva puntuación en el leaderboard.
 * 🔧 EDITABLE: La política actual es que si un nick ya existe,
 * solo se actualiza si el nuevo puntaje es mejor (mayor puntaje o igual puntaje con menor tiempo).
 * Puedes cambiar esta lógica para permitir múltiples entradas por nick o diferentes criterios de actualización.
 * @param nick - El nombre del jugador.
 * @param score - El puntaje obtenido.
 * @param timeSeconds - El tiempo total en segundos.
 */
export const saveScore = (nick: string, score: number, timeSeconds: number): void => {
  try {
    const leaderboard = getLeaderboard();
    const existingEntryIndex = leaderboard.findIndex(entry => entry.nick.toLowerCase() === nick.toLowerCase());

    if (existingEntryIndex > -1) {
        const existingEntry = leaderboard[existingEntryIndex];
        // Reemplaza solo si la nueva puntuación es estrictamente mejor.
        if (score > existingEntry.score || (score === existingEntry.score && timeSeconds < existingEntry.timeSeconds)) {
            leaderboard[existingEntryIndex] = { nick, score, timeSeconds, dateISO: new Date().toISOString() };
        }
    } else {
        // Si el nick no existe, simplemente añade la nueva entrada.
        leaderboard.push({ nick, score, timeSeconds, dateISO: new Date().toISOString() });
    }

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error)
 {
    console.error("Failed to save score to localStorage", error);
  }
};

/**
 * Elimina todas las entradas del leaderboard y devuelve un array vacío.
 * @returns {LeaderboardEntry[]} Un array vacío para actualizar el estado de la UI.
 */
export const resetLeaderboard = (): LeaderboardEntry[] => {
    try {
        // Limpia explícitamente el almacenamiento para mayor fiabilidad.
        localStorage.setItem(LEADERBOARD_KEY, '[]');
        return [];
    } catch (error) {
        console.error("Failed to reset leaderboard in localStorage", error);
        return [];
    }
};