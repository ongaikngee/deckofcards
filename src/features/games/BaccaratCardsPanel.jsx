import React from "react";
import { CheckIcon } from "@phosphor-icons/react";
import { GAME_RESULT } from "../../constants/games";
import DisplayCards from "../../components/DisplayCards";

const BaccaratCardsPanel = ({
  gameState,
  playerCards = [],
  bankerCards = [],
  dealMessage,
  dealLoading,
  baccaratError,
  baccaratWinner,
}) => {
  return (
    <div>
      {baccaratError && (
        <div className="alert alert-danger py-2">{baccaratError}</div>
      )}
      <div className="bg-success p-4 rounded mb-4">
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h4 className="text-white mb-0">Player's Hand</h4>
                {(baccaratWinner === GAME_RESULT.WINNER_PLAYER || baccaratWinner === GAME_RESULT.GAME_TIE) && (
                <CheckIcon size={24} weight="bold" className="text-white" />
              )}
            </div>
            <div
              className="p-2 rounded bg-success bg-opacity-25 border border-white"
              style={{ minHeight: "160px" }}
            >
              {playerCards.length > 0 ? (
                <DisplayCards cards={playerCards} size={100} type="revealAll" />
              ) : (
                <div className="text-muted">Waiting for player cards...</div>
              )}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-2">
              <h4 className="text-white mb-0">Banker's Hand</h4>
                {(baccaratWinner === GAME_RESULT.WINNER_DEALER || baccaratWinner === GAME_RESULT.GAME_TIE) && (
                <CheckIcon size={24} weight="bold" className="text-white" />
              )}
            </div>
            <div
              className="p-2 rounded bg-success bg-opacity-25 border border-white"
              style={{ minHeight: "160px" }}
            >
              {bankerCards.length > 0 ? (
                <DisplayCards cards={bankerCards} size={100} type="revealAll" />
              ) : (
                <div className="text-muted">Waiting for banker cards...</div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-3 text-white"> {dealMessage || "\u00A0"}</div>
      </div>
    </div>
  );
};

export default BaccaratCardsPanel;
