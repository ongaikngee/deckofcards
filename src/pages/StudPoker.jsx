import React, { useState, useEffect } from "react";

// componenets
import DisplayCards from "../components/DisplayCards";
import IntroStudPoker from "../features/games/IntroStudPoker";
import { formatCurrency } from "../utils/formatCurrency";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";

import { GAME_STATE } from "../constants/games";

//3rd party libraries
import { Hand } from "pokersolver";

const StudPoker = () => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [deck, setDeck] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState(null);
  const [dealerStrength, setDealerStrength] = useState(null);

  const [chips, setChips] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);

  const getStrengthOfHand = (hands) => {
    const codes = hands.map((card) => card.code.replace("0", "T"));
    const hand = Hand.solve(codes);
    return hand;
  };

  useEffect(() => {
    const initGame = async () => {
      try {
        const fetchDeck = await getNewDeck({
          noOfDecks: 1,
          jokersEnabled: false,
        });
        setDeck(fetchDeck);

        let fetchCards = null;
        fetchCards = await drawCardFromDeck(fetchDeck.deck_id, 5);
        setPlayerHand(fetchCards.cards);

        if (fetchCards.cards.length === 5) {
          const strength = getStrengthOfHand(fetchCards.cards);
          setPlayerStrength(strength.descr);
        }

        fetchCards = await drawCardFromDeck(fetchDeck.deck_id);
        setDealerHand(fetchCards.cards);
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setGameState(GAME_STATE.PLAYER_MOVE);
      }
    };

    const getDealerRemainingCards = async () => {
      try {
        const fetchCards = await drawCardFromDeck(deck.deck_id, 4);
        setDealerHand((prev) => [...prev, ...fetchCards.cards]);
        const dealerFinalCards = [...dealerHand, ...fetchCards.cards];
        if (dealerFinalCards.length === 5) {
          const strength = getStrengthOfHand(dealerFinalCards);
          setDealerStrength(strength.descr);
        }
      } catch (e) {
        console.error(e);
        throw e;
      }
    };

    if (gameState === GAME_STATE.LOADING) {
      initGame();
    }

    if (
      gameState === GAME_STATE.PLAYER_FOLDS ||
      gameState === GAME_STATE.PLAYER_BET
    ) {
      getDealerRemainingCards();
    }
  }, [gameState]);

  const startGame = () => {
    setGameState(GAME_STATE.LOADING);
  };

  const bet = () => {
    setGameState(GAME_STATE.PLAYER_BET);
  };

  const fold = () => {
    setGameState(GAME_STATE.PLAYER_FOLDS);
  };

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between">
        <div>
          <p className="h2">Stud Poker</p>
          {deck && <p className="text-muted">Deck id: {deck.deck_id}</p>}
        </div>
        <div className="border p-3 mb-4 rounded bg-success bg-opacity-25 ">
          <p className="h5">Chips: {formatCurrency(chips)}</p>
          <p className="h5">Bet Amount: {formatCurrency(betAmount)}</p>
        </div>
      </div>
      {/* SECTION: intro or Dealer Section */}
      <div>
        {gameState === GAME_STATE.IDLE && <IntroStudPoker />}
        {gameState === GAME_STATE.LOADING && (
          <div className="spinner-grow" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
        {gameState === GAME_STATE.PLAYER_MOVE && dealerHand && (
          <div>
            <div className="container mb-5">
              <h2>Dealer's Hand</h2>
              <DisplayCards
                cards={[1, 1, 1, 1, ...dealerHand]}
                size={100}
                type="revealOne"
              />
            </div>
          </div>
        )}

        {(gameState === GAME_STATE.PLAYER_FOLDS || gameState === GAME_STATE.PLAYER_BET) && dealerHand && (
          <div>
            <div className="container mb-5">
              <h2>Dealer's Hand</h2>
              <DisplayCards cards={dealerHand} size={100} />
              <h3>{dealerStrength}</h3>
            </div>
          </div>
        )}
      </div>
      {/* SECTION : Player Deck */}
      <div>
        {gameState === GAME_STATE.PLAYER_MOVE &&
          playerHand &&
          playerStrength && (
            <div>
              <div className="container mb-5">
                <h2>Player's Hand</h2>
                <DisplayCards cards={playerHand} />
                <h3>{playerStrength}</h3>
              </div>
            </div>
          )}

        {gameState === GAME_STATE.PLAYER_FOLDS &&
          playerHand &&
          playerStrength && (
            <div>
              <div className="container mb-5">
                <h2>Player's Hand</h2>
                <DisplayCards cards={playerHand} type="revealNone" />
                <h3>{playerStrength}</h3>
              </div>
            </div>
          )}

        {gameState === GAME_STATE.PLAYER_BET &&
          playerHand &&
          playerStrength && (
            <div>
              <div className="container mb-5">
                <h2>Player's Hand</h2>
                <DisplayCards cards={playerHand} />
                <h3>{playerStrength}</h3>
              </div>
            </div>
          )}
      </div>
      {/* SECTION: Action */}

      <div>
        <hr></hr>
        <h2>Action</h2>
        {(gameState === GAME_STATE.IDLE ||
          gameState === GAME_STATE.PLAYER_FOLDS ||
          gameState === GAME_STATE.PLAYER_BET 
        ) && (
          <div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={startGame}
              disabled={chips < betAmount}
            >
              New Game
            </button>
          </div>
        )}
        {gameState === GAME_STATE.PLAYER_MOVE && (
          <span>
            <button
              type="button"
              className="btn btn-success cursor-pointer me-3"
              onClick={bet}
              disabled={chips < betAmount * 2}
            >
              Bet {formatCurrency(betAmount * 2)}
            </button>
            <button
              type="button"
              className="btn btn-danger cursor-pointer"
              onClick={fold}
            >
              fold
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default StudPoker;
