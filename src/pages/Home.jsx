import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNewDeck } from "../services/api";
import NewGameBtn from "../components/NewGameBtn";

export const Home = ({ games, setGames }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleDrawCard = async () => {
  //   if (!deckId) return

  //   setLoading(true)
  //   setError(null)

  //   try {
  //     const drawData = await drawCardFromDeck(deckId, 1)
  //     if (!drawData.success) {
  //       throw new Error('Failed to draw a card from the deck.')
  //     }

  //     const [drawnCard] = drawData.cards
  //     setCard(drawnCard)
  //     setRemaining(drawData.remaining)
  //   } catch (err) {
  //     console.error('Error drawing card:', err)
  //     setError(err.message || 'Could not draw a card.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  const addGame = async () => {
    try {
      const deckData = await getNewDeck();
      const newGame = { gameId: deckData.deck_id, drawn: [] };
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

  if (games.length === 0) {
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
                  <p className="card-title">{game.gameId}</p>
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
        {/* </div> */}
      </div>

      {/* <p>Deck ID: {deckId ?? "Loading..."}</p>
      <button onClick={handleDrawCard} disabled={!deckId || loading}>
        {loading ? "Drawing..." : "Draw a card"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {card && (
        <div className="card-draw-result">
          <img
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
            width="150"
          />
          <p>
            {card.value} of {card.suit}
          </p>
          <p>Remaining: {remaining}</p>
        </div>
      )} */}
    </>
  );
};
