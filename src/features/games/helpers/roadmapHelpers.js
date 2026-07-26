/**
 * roadmapHelpers.js
 * Shared helpers for roadmap calculations and utilities.
 * Kept pure and framework-agnostic so other roadmap types can reuse them.
 */

export const normalizeWinner = (winner) => {
  if (!winner) return null;
  const w = String(winner).toLowerCase();
  if (w === 'player' || w === 'p' || w === 'winner_player') return 'PLAYER';
  if (w === 'banker' || w === 'b' || w === 'winner_dealer' || w === 'dealer') return 'BANKER';
  if (w === 'tie' || w === 'push' || w === 't') return 'TIE';
  return w.toUpperCase();
};

/**
 * Create an empty column with 6 rows (null filled)
 */
export const createEmptyColumn = () => Array(6).fill(null);

/**
 * Deep copy columns structure
 */
export const cloneColumns = (columns) => columns.map(col => col.slice());
