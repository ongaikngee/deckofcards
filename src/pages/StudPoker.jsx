import React, { useState, useEffect } from "react";

// componenets
import DisplayCards from "../components/DisplayCards";
import IntroStudPoker from "../features/games/IntroStudPoker";

// helpers
import { formatCurrency } from "../utils/formatCurrency";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { GAME_STATE, PLAYER_ACTION, GAME_RESULT } from "../constants/games";

//3rd party libraries
import { Hand } from "pokersolver";
import { CheckIcon } from "@phosphor-icons/react";

const StudPoker = () => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [deck, setDeck] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState(null);
  const [dealerStrength, setDealerStrength] = useState(null);
  const [chips, setChips] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);
  const [isDealerQualified, setIsDealerQualified] = useState(undefined);
  const [playerAction, setPlayerAction] = useState("");
  const [winner, setWinner] = useState("");

  const getStrengthOfHand = (hands) => {
    const codes = hands.map((card) => card.code.replace("0", "T"));
    const hand = Hand.solve(codes);
    return hand;
  };

  // Dealer needs to have at least a Ace King to qualify.
  const checkDealerQualification = (strength) => {
    if (strength.rank > 1) {
      return true;
    }

    if (strength.descr === "A High") {
      return strength.values.some((slot) =>
        slot?.some((card) => card.value === "K"),
      );
    }

    return false;
  };

  const initGame = async () => {
    //Reset
    setDeck(null);
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerStrength(null);
    setDealerStrength(null);
    setIsDealerQualified(undefined);
    setPlayerAction(null);
    setWinner("");

    try {
      const fetchDeck = await getNewDeck({
        noOfDecks: 1,
        jokersEnabled: false,
      });
      setDeck(fetchDeck);

      // Fetching player hand and 1 of dealer's card
      let fetchCards = null;
      fetchCards = await drawCardFromDeck(fetchDeck.deck_id, 5);
      setPlayerHand(fetchCards.cards);

      if (fetchCards.cards.length === 5) {
        const strength = getStrengthOfHand(fetchCards.cards);
        setPlayerStrength(strength.descr);
      }

      fetchCards = await drawCardFromDeck(fetchDeck.deck_id);
      setDealerHand(fetchCards.cards);

      // deduct chips for the bet
      setChips((prev) => prev - betAmount);
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
      const dealerFinalCards = [...dealerHand, ...fetchCards.cards];
      setDealerHand(dealerFinalCards);
      if (dealerFinalCards.length === 5) {
        const strength = getStrengthOfHand(dealerFinalCards);
        setDealerStrength(strength.descr);
        const dealerQ = checkDealerQualification(strength);

        setIsDealerQualified(dealerQ);
      }
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setGameState(GAME_STATE.DETERMINE_WINNER);
    }
  };

  // This will determine the winner and calculate the payout
  const determineWinner = () => {
    const winning = 2;

    // player fold,
    if (playerAction === PLAYER_ACTION.FOLD) {
      setWinner(GAME_RESULT.WINNER_DEALER);
      return;
    }

    // Player bet, Dealer did not qualified, pays the bet
    if (!isDealerQualified) {
      setWinner(GAME_RESULT.WINNER_PLAYER);
      setChips((prev) => prev + betAmount * winning);

      return;
    }

    // Comparing hands
    try {
      const dealerCodes = dealerHand.map((card) => card.code.replace("0", "T"));
      const playerCodes = playerHand.map((card) => card.code.replace("0", "T"));
      const dealerSolved = Hand.solve(dealerCodes);
      const playerSolved = Hand.solve(playerCodes);
      const winner = Hand.winners([dealerSolved, playerSolved]);

      // When both strength has equal values
      if (winner.length > 1) {
        setWinner(GAME_RESULT.GAME_TIE);
        return;
      }

      const determinedWinner =
        winner[0] === dealerSolved
          ? GAME_RESULT.WINNER_DEALER
          : GAME_RESULT.WINNER_PLAYER;

      setWinner(determinedWinner);

      if (determinedWinner === GAME_RESULT.WINNER_PLAYER) {
        // Win both ante and bet
        setChips((prev) => prev + betAmount * winning * winning);
      } else if (determinedWinner === GAME_RESULT.WINNER_DEALER) {
        // Lose both ante and bet
        setChips((prev) => prev - betAmount * winning);
      }
    } catch (e) {
      console.error("getWinner error:", e);
      return null;
    }
  };

  useEffect(() => {
    if (gameState === GAME_STATE.LOADING) {
      initGame();
    }

    if (gameState === GAME_STATE.PLAYER_ACTED) {
      getDealerRemainingCards();
    }

    if (gameState === GAME_STATE.DETERMINE_WINNER) {
      determineWinner();
    }
  }, [gameState]);

  const startGame = () => {
    setGameState(GAME_STATE.LOADING);
  };

  const bet = () => {
    setPlayerAction(PLAYER_ACTION.BET);
    setGameState(GAME_STATE.PLAYER_ACTED);
  };

  const fold = () => {
    setPlayerAction(PLAYER_ACTION.FOLD);
    setGameState(GAME_STATE.PLAYER_ACTED);
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

        {gameState === GAME_STATE.DETERMINE_WINNER && dealerHand && (
          <div>
            <div className="container mb-5">
              <div className="d-flex align-items-center gap-2">
                <h2>Dealer's Hand</h2>
                {winner === GAME_RESULT.WINNER_DEALER && (
                  <CheckIcon size={32} weight="bold" className="text-success" />
                )}
              </div>
              {isDealerQualified ? (
                <p>Dealer qualified</p>
              ) : (
                <p>Dealer did not qualified</p>
              )}
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

        {gameState === GAME_STATE.DETERMINE_WINNER &&
          playerAction === PLAYER_ACTION.FOLD &&
          playerHand &&
          playerStrength && (
            <div>
              <div className="container mb-5">
                <div className="d-flex align-items-center gap-2">
                  <h2>Player's Hand</h2>
                  {winner === GAME_RESULT.WINNER_PLAYER && (
                    <CheckIcon
                      size={32}
                      weight="bold"
                      className="text-success"
                    />
                  )}
                </div>
                <DisplayCards cards={playerHand} type="revealNone" />
                <h3>{playerStrength}</h3>
              </div>
            </div>
          )}

        {gameState === GAME_STATE.DETERMINE_WINNER &&
          playerAction === PLAYER_ACTION.BET &&
          playerHand &&
          playerStrength && (
            <div>
              <div className="container mb-5">
                <div className="d-flex align-items-center gap-2">
                  <h2>Player's Hand</h2>
                  {winner === GAME_RESULT.WINNER_PLAYER && (
                    <CheckIcon
                      size={32}
                      weight="bold"
                      className="text-success"
                    />
                  )}
                </div>
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
          gameState === GAME_STATE.DETERMINE_WINNER) && (
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
