import React from "react";
import DisplayCards from "../../components/DisplayCards";

const BaccaratCardsPanel = ({
  gameState,
  playerCards = [],
  bankerCards = [],
  dealMessage,
  dealLoading,
  baccaratError,
}) => {
  return (
    <div className="bg-success bg-opacity-25 p-4 mb-4">
      <div className="mb-3">{`Game State: ${gameState}`}</div>
      {dealMessage && (
        <div className="alert alert-info py-2">{dealMessage}</div>
      )}
      {baccaratError && (
        <div className="alert alert-danger py-2">{baccaratError}</div>
      )}
      <div className="d-flex flex-column flex-md-row gap-3">
        <div className="flex-fill">
          <h4>Player's Hand</h4>
          <div className="border border-success border-opacity-50 p-2 rounded bg-white">
            {playerCards.length > 0 ? (
              <DisplayCards cards={playerCards} size={100} type="revealAll" />
            ) : (
              <div className="text-muted">Waiting for player cards...</div>
            )}
          </div>
        </div>
        <div className="flex-fill">
          <h4>Banker's Hand</h4>
          <div className="border border-success border-opacity-50 p-2 rounded bg-white">
            {bankerCards.length > 0 ? (
              <DisplayCards cards={bankerCards} size={100} type="revealAll" />
            ) : (
              <div className="text-muted">Waiting for banker cards...</div>
            )}
          </div>
        </div>
      </div>
      {dealLoading && (
        <div className="mt-3 text-muted">Dealing in progress — please wait.</div>
      )}
    </div>
  );
};

export default BaccaratCardsPanel;
