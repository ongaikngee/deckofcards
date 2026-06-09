import React, { useState, useEffect } from "react";

// componenets
import DisplayCards from "../components/DisplayCards";
import Spinner from "../components/Spinner";
import IntroStudPoker from "../features/games/IntroStudPoker";
import StudPokerHistory from "../features/games/StudPokerHistory";
import StudPokerLineChart from "../features/games/StudPokerLineChart";

// helpers
import { formatCurrency } from "../utils/formatCurrency";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { determinePlayerPayoutMultiplier } from "../utils/studPokerHelper";
import {
  GAME_STATE,
  PLAYER_ACTION,
  GAME_RESULT,
} from "../constants/games";

// 3rd party libraries
import { Hand } from "pokersolver";
import { CheckIcon } from "@phosphor-icons/react";

const StudPoker = () => {
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState(null);
  const [dealerStrength, setDealerStrength] = useState(null);
  const [chips, setChips] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);
  const [chartData, setChartData] = useState([])

  const [payout, setpayout] = useState("")
  const [payoutAmt, setPayoutAmt] = useState(0)
  const [isDealerQualified, setIsDealerQualified] = useState(undefined);
  const [playerAction, setPlayerAction] = useState("");
  const [winner, setWinner] = useState("");
  const [winningHand, setWinningHand] = useState("")

  const [gameHistory, setGameHistory] = useState([])

  //settings
  const dealerCardSize = 60
  const checkIconSize = 28
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
    setpayout("");
    setPayoutAmt(0);
    setWinningHand("")

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
      const dealerFinalCards = [...fetchCards.cards, ...dealerHand];
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
    const gameRecord = {
      "deckId": "",
      "winner": null,
      "playerHand": null,
      "dealerHand": null,
      "playerAction": null,
      "playerStrength": null,
      "dealerStrength": null,
      "winningPokerHandClass": null,
      "winningMultiplier": null,
      "payoutAmt": 0,
    }

    // storing Hands in gameRecord
    if (
      Array.isArray(dealerHand) &&
      dealerHand.length > 0 &&
      Array.isArray(playerHand) &&
      playerHand.length > 0 &&
      deck !== null &&
      deck !== undefined &&
      playerStrength != null &&
      dealerStrength != null
    ) {
      Object.assign(gameRecord, {
        deckId: deck,
        playerHand,
        dealerHand,
        playerStrength,
        dealerStrength,
      })
    } else {
      const errorMsg = "Error when saving game history."
      setError(errorMsg)
      throw new Error(errorMsg)
    }

    // player fold,
    if (playerAction === PLAYER_ACTION.FOLD) {
      setWinner(GAME_RESULT.WINNER_DEALER);
      setPayoutAmt(-1 * betAmount)
      gameRecord.winner = GAME_RESULT.WINNER_DEALER
      gameRecord.playerAction = PLAYER_ACTION.FOLD
      gameRecord.payoutAmt = -1 * betAmount
      setGameHistory((prev) => [gameRecord, ...prev])
      return;
    }

    // Player bet, Dealer did not qualified, pays the bet
    if (!isDealerQualified) {
      setWinner(GAME_RESULT.WINNER_PLAYER);
      setPayoutAmt(betAmount)
      setChips((prev) => prev + betAmount + betAmount);

      gameRecord.winner = GAME_RESULT.WINNER_PLAYER
      gameRecord.playerAction = "Did not qualified"
      gameRecord.payoutAmt = betAmount
      setGameHistory((prev) => [gameRecord, ...prev])

      return;
    }

    // Comparing hands
    try {
      // Using PokerSolver's winners() to determine winner
      const winner = Hand.winners([dealerStrength, playerStrength]);

      // When both strength have equal values
      if (winner.length > 1) {
        setWinner(GAME_RESULT.GAME_TIE);
        setChips((prev) => prev + betAmount);
        gameRecord.winner = GAME_RESULT.GAME_TIE
        gameRecord.playerAction = GAME_RESULT.GAME_TIE
        setGameHistory((prev) => [gameRecord, ...prev])
        return;
      }

      const determinedWinner =
        winner[0] === dealerStrength
          ? GAME_RESULT.WINNER_DEALER
          : GAME_RESULT.WINNER_PLAYER;

      setWinner(determinedWinner);

      if (determinedWinner === GAME_RESULT.WINNER_PLAYER) {
        // Win both ante and bet
        const { payoutMultiplier, pokerHand } = determinePlayerPayoutMultiplier(playerStrength)
        const winning = betAmount * payoutMultiplier
        setPayoutAmt((betAmount * 2) + winning)
        setpayout(`Bet + Ante with ${payoutMultiplier}x`)
        setChips((prev) => prev + (betAmount * 3) + winning);
        gameRecord.winner = GAME_RESULT.WINNER_PLAYER
        gameRecord.payoutAmt = (betAmount * 2) + winning
        gameRecord.winningPokerHandClass = pokerHand
        gameRecord.winningMultiplier = payoutMultiplier
      } else if (determinedWinner === GAME_RESULT.WINNER_DEALER) {
        // Lose both ante and bet
        setPayoutAmt(betAmount * -3)
        setChips((prev) => prev - (betAmount + betAmount));
        gameRecord.winner = GAME_RESULT.WINNER_DEALER
        gameRecord.payoutAmt = betAmount * -3
      }
      gameRecord.playerAction = PLAYER_ACTION.BET
      setGameHistory((prev) => [gameRecord, ...prev])
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

  useEffect(() => {
    if (gameHistory.length > 0) {
      setChartData(prev => [...prev, [gameHistory.length, chips]]);
    } else {
      setChartData([["Games", "Chips"], [0, chips]]);

    }

  }, [gameHistory])

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
        <div className="border border-warning border-opacity-100 border-2 px-3 py-1 mb-1 rounded bg-warning bg-opacity-25 ">
          <div className="d-flex align-items-center gap-2">
            <div className="h5 mb-0">Chips: {formatCurrency(chips)}</div>
            {payoutAmt !== 0 && (
              <span
                className={`badge bg-opacity-75 ${payoutAmt > 0 ? 'text-bg-success' : 'text-bg-danger'}`}
              >
                {formatCurrency(payoutAmt)}
              </span>
            )}
          </div>
          <div className="h5">Bet Amount: {formatCurrency(betAmount)}</div>
        </div>
      </div>
      {/* SECTION: intro or Dealer Section */}
      <div>
        {gameState === GAME_STATE.IDLE && <IntroStudPoker />}
        {gameState === GAME_STATE.LOADING && (
          <div>
            <div className="mb-3">
              <div className={headerFontSize}>Dealer's Hand</div>
              <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "120px" }}>
                <div className="d-flex justify-content-start align-items-center gap-2">
                  <DisplayCards
                    cards={[1, 1, 1, 1, 1]}
                    size={dealerCardSize}
                    type="revealNone"
                  />
                  <Spinner />
                </div>
              </div>
              <div className={strengthFontSize}><span className="placeholder"></span></div>
            </div>
          </div>
        )}
        {(gameState === GAME_STATE.PLAYER_MOVE ||
          gameState === GAME_STATE.PLAYER_ACTED) &&
          dealerHand && (
            <div>
              <div className="mb-3">
                <div className={headerFontSize}>Dealer's Hand</div>
                <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "120px" }}>
                  <DisplayCards
                    cards={[1, 1, 1, 1, ...dealerHand]}
                    size={dealerCardSize}
                    type="revealOne"
                  />
                </div>
                <div className={strengthFontSize}><span className="placeholder"></span></div>
              </div>
            </div>
          )}

        {gameState === GAME_STATE.DETERMINE_WINNER && dealerHand && (
          <div>
            <div className="mb-2">
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
              <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "120px" }}>
                <DisplayCards cards={dealerHand} size={dealerCardSize} />
              </div>
              <div className={strengthFontSize}>
                <span className="badge text-bg-light">{dealerStrength.descr}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* SECTION : Player Deck */}
      <div>
        {gameState === GAME_STATE.LOADING && (
          <div className="mb-3">
            <div className="d-flex align-items-center gap-2">
              <div className={headerFontSize}>Player's Hand</div>
            </div>
            <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "180px" }}>
              <DisplayCards className="bg-success"
                cards={[1, 1, 1, 1, 1]}
                type="revealNone"
              />
            </div>
            <div className={strengthFontSize}><span className="placeholder"></span></div>

          </div>
        )}
        {gameState === GAME_STATE.PLAYER_MOVE &&
          playerHand &&
          playerStrength && (
            <div className="mb-3">
              <div className={headerFontSize}>Player's Hand</div>
              <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "180px" }}>
                <DisplayCards cards={playerHand} />
              </div>
              <div className={strengthFontSize}>
                <span className="badge text-bg-light">{playerStrength.descr}</span>
              </div>
            </div>
          )}

        {(gameState === GAME_STATE.DETERMINE_WINNER ||
          gameState === GAME_STATE.PLAYER_ACTED
        ) &&
          playerAction &&
          playerHand &&
          playerStrength && (
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2">
                {winner === GAME_RESULT.WINNER_PLAYER && (
                  <CheckIcon size={checkIconSize} weight={checkIconWeight} className="text-success" />
                )}
                <div className={headerFontSize}>Player's Hand</div>
              </div>
              <div className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity" style={{ height: "180px" }}>
                <DisplayCards cards={playerHand} type={playerAction === PLAYER_ACTION.FOLD ? "revealNone" : "revealAll"} />
              </div>
              <div className={strengthFontSize}>
                <span className="badge text-bg-light">{playerStrength.descr}</span>
              </div>
            </div>
          )}

      </div>
      {/* SECTION: Action */}
      <div>
        <hr></hr>
        {(gameState === GAME_STATE.IDLE ||
          gameState === GAME_STATE.DETERMINE_WINNER) && (
            <div>
              <button
                type="button"
                className="btn btn-primary btn-lg col-6"
                onClick={startGame}
                disabled={chips < betAmount}
              >
                New Game
              </button>
            </div>
          )}
        {gameState === GAME_STATE.LOADING && (
          <span>
            <button
              type="button"
              className="btn btn-success btn-lg col-5 col-md-3 cursor-pointer me-3 "
              onClick={bet}
              disabled={true}
            >
              Bet {formatCurrency(betAmount * 2)}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-lg col-5 col-md-3 cursor-pointer"
              onClick={fold}
              disabled={true}
            >
              fold
            </button>
          </span>
        )}
        {gameState === GAME_STATE.PLAYER_MOVE && (
          <span>
            <button
              type="button"
              className="btn btn-success btn-lg col-5 col-md-3 cursor-pointer me-3"
              onClick={bet}
              disabled={chips < betAmount * 2}
            >
              Bet {formatCurrency(betAmount * 2)}
            </button>
            <button
              type="button"
              className="btn btn-danger btn-lg col-5 col-md-3 cursor-pointer"
              onClick={fold}
            >
              fold
            </button>
          </span>
        )}
      </div>
      {/* SECTION: Game History */}
      {gameState === GAME_STATE.IDLE || (
        <div>
          <hr></hr>
          <StudPokerLineChart chartData={chartData} />
          <StudPokerHistory SPGames={gameHistory} />
        </div>
      )}
    </div>
  );
};

export default StudPoker;
