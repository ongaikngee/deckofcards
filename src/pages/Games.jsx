import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNewDeck } from "../services/deckService";
import NewDeckForm from "../components/NewDeckForm";

dayjs.extend(relativeTime);

const Games = ({ games, setGames }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const addGame = async ({ inputName, inputNoOfDecks, inputJokersEnabled }) => {
    try {
      const deckData = await getNewDeck({
        noOfDecks: inputNoOfDecks,
        jokersEnabled: inputJokersEnabled,
      });
      const name =
        inputName.trim() !== ""
          ? inputName.trim()
          : `Game ${deckData.deck_id.slice(0, 6)}`;
      const newGame = {
        gameId: deckData.deck_id,
        name,
        drawn: [],
        timestamp: deckData.timestamp,
      };
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
      <div className="container my-4">
        <h2>No Games Yet</h2>
        <p>Start adding games and they will appear here.</p>
        <NewDeckForm addGame={addGame} />
      </div>
    );
  }

  return (
    <>
      <div className="container my-4">
        <NewDeckForm addGame={addGame} />
      </div>
      <div className="container">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">Game</th>
              {/* Desktop */}
              <th className="d-none d-md-table-cell">Name</th>
              <th className="d-none d-md-table-cell">Started on</th>
              <th className="d-none d-md-table-cell">Play</th>
              <th className="d-none d-md-table-cell">Delete</th>

              {/* Mobile */}
              <th className="d-table-cell d-md-none">Name</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {games.map((game, index) => (
              <tr className="col_id" key={game.gameId}>
                <td>
                  <img
                    style={{ width: "120px" }}
                    src="https://deckofcardsapi.com/static/img/back.png"
                    className="card-img-top"
                    alt="Game Image"
                  ></img>
                </td>
                <td className="d-none d-md-table-cell">
                  <h3>{game.name || game.gameId}</h3>
                </td>
                <td className="d-none d-md-table-cell">
                  {game.timestamp ? dayjs(game.timestamp).fromNow() : "N/A"}
                </td>
                <td className="d-none d-md-table-cell">
                  <button
                    className="btn btn-primary btn-sm flex-grow-1"
                    onClick={() => navigate(`/game/${game.gameId}`)}
                  >
                    Play
                  </button>
                </td>
                <td className="d-none d-md-table-cell">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeGame(game.gameId);
                    }}
                  >
                    Delete
                  </button>
                </td>

                {/* Mobile */}
                <td className="d-table-cell d-md-none align-top">
                  <h3 className="text">{game.name || game.gameId}</h3>
                  <p className="text-secondary">
                    {game.timestamp ? dayjs(game.timestamp).fromNow() : "N/A"}
                  </p>
                  <button
                    className="me-2 btn btn-primary btn-sm flex-grow-1"
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Games;
