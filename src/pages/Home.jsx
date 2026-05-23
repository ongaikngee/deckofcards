import React from "react";
import { useState, useEffect } from "react";
import { getNewDeck, drawCardFromDeck } from "../services/api";

export const Home = () => {
  const [deckId, setDeckId] = useState(null);
  // const [card, setCard] = useState(null);
  // const [remaining, setRemaining] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [games, setGames] = useState([]);

  useEffect(() => {
    // const fetchDeck = async () => {
    //   try {
    //     const deckData = await getNewDeck()
    //     setDeckId(deckData.deck_id)
    //     setRemaining(deckData.remaining)
    //   } catch (error) {
    //     console.error('Error fetching deck:', error)
    //     setError('Could not create a new deck.')
    //   }
    // }
    // fetchDeck()
  }, []);

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
      setGames((prevGames) => [...prevGames, deckData.deck_id]);
    } catch (err) {
      console.log(err);
    }
  };

  const removeGame = (gameId) => {
    setGames((prevGames) => prevGames.filter((g) => g !== gameId));
  };

  if (games.length === 0) {
    return (
      <div className="container">
        <h2>No Games Yet</h2>
        <p>Start adding games and they will appear here.</p>

        <button type="button" onClick={addGame} className="btn btn-primary">
          New Game
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <button type="button" onClick={addGame} className="btn btn-primary">
          New Game
        </button>
      </div>
      <div className="container my-5">
        <div className="row justify-content-start">
          {games.map((game) => (
            <div key={game} className="col-12  col-sm-6 col-md-3">
              <div className="card">
                <img
                  src="https://deckofcardsapi.com/static/img/back.png"
                  className="card-img-top"
                  alt="Game Image"
                ></img>
                <div className="card-body">
                  <p className="card-title">{game}</p>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => removeGame(game)}
                  >
                    Delete
                  </button>
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
