import React, { useState, useEffect } from "react";

// componenets
import DisplayCards from "../components/DisplayCards";
import Spinner from "../components/Spinner";
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

  //settings
  const dealerCardSize = 60
  const checkIconSize = 16
  const checkIconWeight = "bold"
  const headerFontSize = "h2"
  const strengthFontSize = "h4"

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
        setPlayerStrength(strength);
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
        setDealerStrength(strength);
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
      // Using PokerSolver's winners() to determine winner
      const winner = Hand.winners([dealerStrength, playerStrength]);

      // When both strength have equal values
      if (winner.length > 1) {
        setWinner(GAME_RESULT.GAME_TIE);
        return;
      }

      const determinedWinner =
        winner[0] === dealerStrength
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
          <div className="h2 mb-0">Stud Poker</div>
          {deck && <div className="text-muted">Deck id: {deck.deck_id}</div>}
        </div>
        <div className="border px-3 py-1 mb-4 rounded bg-success bg-opacity-25 ">
          <div className="h5 mb-0">Chips: {formatCurrency(chips)}</div>
          <div className="h5">Bet Amount: {formatCurrency(betAmount)}</div>
        </div>
      </div>
      {/* SECTION: intro or Dealer Section */}
      <div>
        {gameState === GAME_STATE.IDLE && <IntroStudPoker />}
        {gameState === GAME_STATE.LOADING && <Spinner />}
        {gameState === GAME_STATE.PLAYER_MOVE && dealerHand && (
          <div>
            <div className="container mb-3">
              <div className={headerFontSize}>Dealer's Hand</div>
              <DisplayCards
                cards={[1, 1, 1, 1, ...dealerHand]}
                size={dealerCardSize}
                type="revealOne"
              />
            </div>
          </div>
        )}

        {gameState === GAME_STATE.DETERMINE_WINNER && dealerHand && (
          <div>
            <div className="container mb-3">
              <div className="d-flex align-items-center gap-2">
                {winner === GAME_RESULT.WINNER_DEALER && (
                  <CheckIcon size={checkIconSize} weight={checkIconWeight} className="text-success" />
                )}
                <div className={headerFontSize}>Dealer's Hand</div>
                {isDealerQualified ? (
                  <h6><span className="badge text-bg-success">Qualified</span></h6>
                ) : (
                  <h6><span className="badge text-bg-danger">Did not qualified</span></h6>
                )}
              </div>
              <DisplayCards cards={dealerHand} size={dealerCardSize} />
              <div className={strengthFontSize}>{dealerStrength.descr}</div>
            </div>
          </div>
        )}
      </div>
      {/* SECTION : Player Deck */}
      <div>
        {gameState === GAME_STATE.PLAYER_MOVE &&
          playerHand &&
          playerStrength && (
            <div className="container mb-3">
              <div className={headerFontSize}>Player's Hand</div>
              <DisplayCards cards={playerHand} />
              <div className={strengthFontSize}>{playerStrength.descr}</div>
            </div>
          )}

        {gameState === GAME_STATE.DETERMINE_WINNER &&
          playerAction &&
          playerHand &&
          playerStrength && (
            <div className="container mb-3">
              <div className="d-flex align-items-center gap-2">
                {winner === GAME_RESULT.WINNER_PLAYER && (
                  <CheckIcon size={checkIconSize} weight={checkIconWeight} className="text-success" />
                )}
                <div className={headerFontSize}>Player's Hand</div>
              </div>
              <DisplayCards cards={playerHand} type={playerAction === PLAYER_ACTION.FOLD ? "revealNone" : "revealAll"} />
              <div className={strengthFontSize}>{playerStrength.descr}</div>
            </div>
          )}

      </div>
      {/* SECTION: Action */}
      <div>
        <hr></hr>
        <div className={headerFontSize}>Action</div>
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
