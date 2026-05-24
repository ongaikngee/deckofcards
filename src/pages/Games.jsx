import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNewDeck } from "../services/api";
import NewGameBtn from "../components/NewGameBtn";

export const Games = ({ games, setGames }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addGame = async () => {
    try {
      const deckData = await getNewDeck();
      const inputName = window.prompt("Enter a name for this game (optional):");
      // If the user cancels the prompt (clicks Cancel), do not create a new game
      if (inputName === null) return;
      const name = inputName.trim() !== "" ? inputName.trim() : `Game ${deckData.deck_id.slice(0,6)}`;
      const newGame = { gameId: deckData.deck_id, name, drawn: [] };
      setGames((prevGames) => [...prevGames, newGame]);
      navigate(`/game/${deckData.deck_id}`);
    } catch (err) {
      console.log(err);
      setError("Failed to create a new game");
    }
  };

  const removeGame = (gameId) => {
    setGames((prevGames) => prevGames.filter((g) => g.gameId !== gameId));
  };

  if (!games || games.length === 0) {
    return (
      <div className="container">
        <h2>No Games Yet</h2>
        <p>Start adding games and they will appear here.</p>
        <NewGameBtn addGame={addGame} />
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <NewGameBtn addGame={addGame} />
      </div>
      <div className="container my-5">
        <div className="row justify-content-start">
          {games.map((game) => (
            <div key={game.gameId} className="col-12  col-sm-6 col-md-3">
              <div className="card">
                <img
                  src="https://deckofcardsapi.com/static/img/back.png"
                  className="card-img-top"
                  alt="Game Image"
                ></img>
                <div className="card-body">
                  <h3 className="card-title">{game.name || game.gameId}</h3>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-primary btn-sm flex-grow-1"
                      onClick={() => navigate(`/game/${game.gameId}`)}
                    >
                      Play
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeGame(game.gameId);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Games;
