/**
 * buildBigRoad.js
 * Pure function to convert an ordered baccarat history into a Big Road columns matrix.
 *
 * Output: Array of columns. Each column is an array of 6 slots (row 0..5). A slot is either null
 * or an object: { winner: 'PLAYER'|'BANKER', ties: number }
 *
 * Rules implemented (summary):
 * - Ties do not create a new cell; they increment the `ties` count on the most recent non-tie cell.
 * - Consecutive identical winners continue downward in the same column until the next available row.
 * - When a winner changes (PLAYER->BANKER or BANKER->PLAYER) start a new column to the right at row 0,
 *   unless that slot is occupied — in which case skip columns until an empty slot at the desired row is found.
 * - If a streak continues but the next row in the current column is occupied or at bottom, start a new
 *   column to the right and attempt to place the cell at the same row index as the last placed cell.
 *
 * This implementation favors clarity and testability. It separates concerns so other roadmap types can
 * reuse the same `columns` structure.
 */

import { normalizeWinner, createEmptyColumn } from './roadmapHelpers';

export default function buildBigRoad(history = []) {
  const columns = [];
  let lastNonTie = null; // { col, row, winner }

  const ensureColumn = (index) => {
    while (columns.length <= index) columns.push(createEmptyColumn());
  };

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const winnerRaw = entry.winner || entry.result || entry.winnerName;
    const winner = normalizeWinner(winnerRaw);

    if (!winner) continue;

    if (winner === 'TIE') {
      // If tie occurs before any non-tie, ignore (no place to attach)
      if (!lastNonTie) continue;
      const { col, row } = lastNonTie;
      const cell = columns[col][row] || { winner: lastNonTie.winner, ties: 0 };
      cell.ties = (cell.ties || 0) + 1;
      columns[col][row] = cell;
      continue;
    }

    // Non-tie result
    if (!lastNonTie) {
      // first non-tie: place at column 0, row 0
      ensureColumn(0);
      columns[0][0] = { winner, ties: 0 };
      lastNonTie = { col: 0, row: 0, winner };
      continue;
    }

    // If same winner as last non-tie, attempt to continue downward
    if (winner === lastNonTie.winner) {
      const col = lastNonTie.col;
      let row = lastNonTie.row + 1;

      // If next row within bounds and empty, place it there
      if (row < 6 && !columns[col][row]) {
        columns[col][row] = { winner, ties: 0 };
        lastNonTie = { col, row, winner };
        continue;
      }

      // Otherwise, start searching to the right for a column with the same row index free.
      // Desired row index is the last placed row (we keep streak alignment).
      let desiredRow = lastNonTie.row;
      let targetCol = col + 1;
      while (true) {
        ensureColumn(targetCol);
        if (!columns[targetCol][desiredRow]) {
          columns[targetCol][desiredRow] = { winner, ties: 0 };
          lastNonTie = { col: targetCol, row: desiredRow, winner };
          break;
        }
        targetCol += 1;
      }
      continue;
    }

    // Winner changed: start a new column to the right and place at row 0 (or find the first free slot at row 0)
    let targetCol = lastNonTie.col + 1;
    const desiredRow = 0;
    while (true) {
      ensureColumn(targetCol);
      if (!columns[targetCol][desiredRow]) {
        columns[targetCol][desiredRow] = { winner, ties: 0 };
        lastNonTie = { col: targetCol, row: desiredRow, winner };
        break;
      }
      targetCol += 1;
    }
  }

  return columns;
}
