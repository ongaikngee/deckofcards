import React, { useMemo } from 'react'
import buildBigRoad from './helpers/buildBigRoad'
import BigRoadCell from './BigRoadCell'

/**
 * BigRoad
 * Renders the Big Road roadmap for Baccarat.
 * Accepts `history` prop (ordered oldest -> newest) where each item contains a `winner` key.
 */
const BigRoad = ({ history = [] }) => {
  // buildBigRoad is pure and deterministic; useMemo to avoid recalculations on every render
  const columns = useMemo(() => buildBigRoad(history), [history]);

  // columns is array of columns, each column is array length 6 (rows)
  const rows = 6;

  // Presentation: ensure roadmap grows to the right (new columns appear after previous ones).
  // Some data sources may generate columns with newest-first; to guarantee correct visual direction
  // we render a left-to-right ordering where the oldest column is leftmost and the newest is rightmost.
  // Render columns left-to-right with newest column on the right. If the builder produced
  // columns with newest-first, reversing here makes newest appear on the right side.
  const columnsToRender = columns.slice().reverse(); // do not mutate original

  return (
    <div className="bigroad-container">
      <div className="d-flex align-items-start">
        { /* render grid: rows are vertical, columns horizontal */ }
        <div className="bigroad-grid">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} style={{ display: 'flex' }}>
              {columnsToRender.map((col, colIdx) => (
                <div key={colIdx} className="bigroad-column">
                  <BigRoadCell cell={col[rowIdx]} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BigRoad
