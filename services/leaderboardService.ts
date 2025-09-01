
import { LEADERBOARD_KEY } from '../constants';
import { type LeaderboardEntry } from '../types';

export const getLeaderboard = (): LeaderboardEntry[] => {
  try {
    const data = localStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    const entries: LeaderboardEntry[] = JSON.parse(data);
    
    // Sort by score descending, then time ascending
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

export const saveScore = (nick: string, score: number, timeSeconds: number): void => {
  try {
    const leaderboard = getLeaderboard();
    const existingEntryIndex = leaderboard.findIndex(entry => entry.nick.toLowerCase() === nick.toLowerCase());

    if (existingEntryIndex > -1) {
        const existingEntry = leaderboard[existingEntryIndex];
        // Replace if new score is higher, or if scores are equal and new time is lower
        if (score > existingEntry.score || (score === existingEntry.score && timeSeconds < existingEntry.timeSeconds)) {
            leaderboard[existingEntryIndex] = { nick, score, timeSeconds, dateISO: new Date().toISOString() };
        }
    } else {
        leaderboard.push({ nick, score, timeSeconds, dateISO: new Date().toISOString() });
    }

    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (error) {
    console.error("Failed to save score to localStorage", error);
  }
};

export const resetLeaderboard = (): void => {
    try {
        localStorage.removeItem(LEADERBOARD_KEY);
    } catch (error) {
        console.error("Failed to reset leaderboard in localStorage", error);
    }
};
