import React, { useState, useEffect} from "react";

// componenets
import { useAuth } from "../features/auth/AuthContext";
import IntroBaccarat from "../features/games/IntroBaccarat";

// helpers
import { GAME_STATE } from "../constants/games";
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
          </div>
        </div>
      </div>
      {gameState === GAME_STATE.INTRO && <IntroBaccarat setGameState={setGameState}/>}
    </div>
  );
};

export default BaccaratPage;
