import React from "react";
import { useState } from "react";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";

const StudPoker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
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
    setIsLoading(true);
    try {
      setPlayerHand([]);
      setDealerHand([]);
      setDeck(null);

      const fetchDeck = await getDeck();
      if (!fetchDeck) return;

      setDeck(fetchDeck);
      setIsActive(true);

      const playerHand = await getHand(fetchDeck.deck_id);
      setPlayerHand(playerHand);

      const dealerHand = await getHand(fetchDeck.deck_id);
      setDealerHand(dealerHand);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h2>Stud Poker</h2>
      {!isActive ? (
        <div className="container">
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="container">
          {isLoading ? (
            <div className="container">
              <div className="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="container">
              <h2>Start</h2>

              <p>Deck: {deck?.deck_id}</p>
              <p>Player: {JSON.stringify(playerHand)}</p>
              <p>Dealer: {JSON.stringify(dealerHand)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudPoker;
