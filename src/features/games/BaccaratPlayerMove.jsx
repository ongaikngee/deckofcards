import React, { useState } from 'react'
import { GAME_STATE, BETS_SETTINGS } from '../../constants/games'

const BaccaratPlayerMove = ({
  gameState,
  betAmount,
  setGameState,
  setBetAmount,
  setBetType,
  isDealing,
}) => {
  const handleBet = (type) => {
    if (isDealing) return;
    setBetType(type);
    setGameState(GAME_STATE.PLAYER_ACTED);
  };

  return (
    <div className="my-4">
      <div className="mb-4">Game state: {gameState}</div>
      <h3>Place Your Bet</h3>
      <p>Select where you want to place your bet:</p>
      <button
        className="btn btn-primary me-2"
        type="button"
        disabled={isDealing}
        onClick={() => handleBet("player")}
      >
        Bet on Player
      </button>
      <button
        className="btn btn-secondary me-2"
        type="button"
        disabled={isDealing}
        onClick={() => handleBet("banker")}
      >
        Bet on Banker
      </button>
      <button
        className="btn btn-success"
        type="button"
        disabled={isDealing}
        onClick={() => handleBet("tie")}
      >
        Bet on Tie
      </button>
      <div className="col-sm-6 mt-3">
        <input
          type="range"
          className="form-range"
          id="betSize"
          min={BETS_SETTINGS.BET_MIN}
          max={BETS_SETTINGS.BET_MAX}
          step={BETS_SETTINGS.BET_STEP}
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.valueAsNumber)}
        />
      </div>
      {isDealing && (
        <div className="text-muted mt-2">Dealing cards... please wait.</div>
      )}
    </div>
  );
};

export default BaccaratPlayerMove