import React from "react";
import { useState } from "react";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { IMG_DECK_BACK } from "../constants/games";

const StudPoker = () => {
  const [gameState, setGameState] = useState("idle");
  //   idle, loading, playerMove, strength
  const [deck, setDeck] = useState(null);

  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);

  const getDeck = async () => {
    try {
      const deckData = await getNewDeck({
        noOfDecks: 1,
        jokersEnabled: false,
      });
      return deckData;
    } catch (e) {
      console.log(e);
    }
  };

  const getHand = async (deck_id) => {
    try {
      const drawnCards = await drawCardFromDeck(deck_id, 5);
      return drawnCards;
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const startGame = async () => {
    setGameState("loading");
    try {
      setPlayerHand([]);
      setDealerHand([]);
      setDeck(null);

      const fetchDeck = await getDeck();
      if (!fetchDeck) return;

      setDeck(fetchDeck);
      setGameState("playerMove");

      const playerHand = await getHand(fetchDeck.deck_id);
      setPlayerHand(playerHand.cards);

      const dealerHand = await getHand(fetchDeck.deck_id);
      setDealerHand(dealerHand.cards);
    } catch (e) {
      console.error(e);
    }
  };

  const bet = () => {
    setGameState("strength");
  };

  const fold = () => {
    setGameState("idle");
  };

  if (gameState === "idle") {
    return (
      <div className="container my-4">
        <h2>Stud Poker</h2>
        <div className="container">
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  if (gameState === "loading") {
    return (
      <div className="container my-4">
        <h2>Stud Poker</h2>
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (gameState === "playerMove") {
    return (
      <div className="container my-4">
        <h2>Stud Poker</h2>
        <p>Deck: {deck?.deck_id}</p>
        <div className="container">
          <h2>Dealer's Hand</h2>
          {dealerHand.map((card, index) =>
            index === 4 ? (
              <img
                key={card.code || index}
                src={card.image}
                className="img-fluid"
                style={{ maxHeight: "100px" }}
              />
            ) : (
              <img
                key={card.code || index}
                src={IMG_DECK_BACK}
                className="img-fluid"
                style={{ maxHeight: "100px" }}
              />
            ),
          )}
        </div>

        <div className="container">
          <h2>Player's Hand</h2>
          {playerHand.map((card) => (
            <img
              key={card.code || index}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "150px" }}
            />
          ))}
        </div>
        <div className="container">
          <h2>Action</h2>
          <span>
            <button type="button" className="btn btn-success" onClick={bet}>
              Ante
            </button>
            <button type="button" className="btn btn-danger" onClick={fold}>
              fold
            </button>
          </span>
        </div>
      </div>
    );
  }

  if (gameState === "strength") {
    return (
      <div className="container my-4">
        <h2>Stud Poker</h2>
        <p>Deck: {deck?.deck_id}</p>
        <div className="container">
          <h2>Dealer's Hand</h2>
          {dealerHand.map((card) => (
            <img
              key={card.code}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "100px" }}
            />
          ))}
        </div>

        <div className="container">
          <h2>Player's Hand</h2>
          {playerHand.map((card) => (
            <img
              key={card.code}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "150px" }}
            />
          ))}
        </div>
        <div className="container">
          <h2>Result</h2>

          <button type="button" className="btn btn-primary" onClick={startGame}>
            Start Game
          </button>
        </div>
        {/* <p>Player: {JSON.stringify(playerHand)}</p>
        <p>Dealer: {JSON.stringify(dealerHand)}</p> */}
      </div>
    );
  }
};

export default StudPoker;
