import React, { useState, useEffect } from "react";

// componenets
import { useAuth } from "../features/auth/AuthContext";
import IntroBaccarat from "../features/games/BaccaratIntro";
import BaccaratPlayerMove from "../features/games/BaccaratPlayerMove";
import BaccaratCardsPanel from "../features/games/BaccaratCardsPanel";

// helpers
import { GAME_STATE, BETS_SETTINGS } from "../constants/games";
import { getChipsHistoryService } from "../services/chipService";
import { formatCurrency } from "../utils/formatCurrency";

const BaccaratPage = () => {
  // Game cards state
  const [gameState, setGameState] = useState(GAME_STATE.INTRO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Chips states
  const [chips, setChips] = useState(0);
  const [betAmount, setBetAmount] = useState(BETS_SETTINGS.BET_MIN);
  const [betType, setBetType] = useState(null);

  const getChipsHistory = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getChipsHistoryService(user.id);
      setChips(response.total_amount);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChipsHistory();
  }, []);

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
        <div>
          <div className="h2 mb-0">Baccarat</div>
          <div className="text-muted">GameState: {gameState}</div>
        </div>
        <div className="border border-warning border-opacity-100 border-2 px-3 py-1 mb-1 rounded bg-warning bg-opacity-25 ">
          <div className="d-flex align-items-center gap-2">
            <div className="h5 mb-0">Chips:{formatCurrency(chips)}</div>
            {/* <div className="text-muted">Bet: {formatCurrency(betAmount)}</div> */}
          </div>
          <div className="text-muted">Bet Amount: {formatCurrency(betAmount)}</div>
          <div className="text-muted">Bet Type: {betType}</div>
        </div>
      </div>
      {/* intro */}
      {gameState === GAME_STATE.INTRO && <IntroBaccarat setGameState={setGameState} />}
      {/* Game cards panel */}
      {gameState !== GAME_STATE.INTRO && <BaccaratCardsPanel gameState={gameState} />}
      {gameState !== GAME_STATE.INTRO && <BaccaratPlayerMove gameState={gameState}
        BetAmount={betAmount}
        setGameState={setGameState}
        setBetAmount={setBetAmount}
        setBetType={setBetType} />}
    </div>
  );
};

export default BaccaratPage;
