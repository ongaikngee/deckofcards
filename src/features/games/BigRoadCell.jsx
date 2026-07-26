import React from 'react'

const BigRoadCell = ({ cell }) => {
  if (!cell) return <div className="p-1" style={{ width: 48, height: 48 }} />;

  const isPlayer = cell.winner === 'PLAYER';
  const isBanker = cell.winner === 'BANKER';

  // Use Bootstrap utilities for layout and coloring. Minimal inline styles are used
  // for the rotated tie slash since Bootstrap doesn't provide diagonal transforms.
  return (
    <div className="p-1 position-relative" style={{ width: 48, height: 48 }}>
      <div
        className={`d-flex align-items-center justify-content-center rounded-circle border-3 ${isPlayer ? 'border-primary text-primary' : ''} ${isBanker ? 'border-danger text-danger' : ''}`}
        style={{ width: 36, height: 36 }}
      >
        <span className="fw-bold">{isPlayer ? 'P' : 'B'}</span>
        {cell.ties > 0 && (
          <div
            style={{
              position: 'absolute',
              width: 2,
              height: 48,
              background: '#198754',
              transform: 'rotate(-45deg)',
              opacity: 0.95,
            }}
          />
        )}
        {cell.ties > 1 && (
          <div className="position-absolute top-0 end-0 small text-success" style={{ transform: 'translate(20%, -20%)' }}>{cell.ties}</div>
        )}
      </div>
    </div>
  )
}

export default BigRoadCell
