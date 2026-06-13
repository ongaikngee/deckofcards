import React, { useState, useEffect } from "react";

// componenets
import DisplayCards from "../components/DisplayCards";
import Spinner from "../components/Spinner";
import IntroStudPoker from "../features/games/IntroStudPoker";
import StudPokerHistory from "../features/games/StudPokerHistory";
import StudPokerLineChart from "../features/games/StudPokerLineChart";
import Modal from "../components/Modal";

// helpers
import { formatCurrency } from "../utils/formatCurrency";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { determinePlayerPayoutMultiplier } from "../utils/studPokerHelper";
import { GAME_STATE, PLAYER_ACTION, GAME_RESULT, BETS_SETTINGS } from "../constants/games";

// 3rd party libraries
import { Hand } from "pokersolver";
import { CheckIcon, WarningCircleIcon } from "@phosphor-icons/react";

const StudPoker = () => {

  // Game cards state
  const [gameState, setGameState] = useState(GAME_STATE.IDLE);
  const [deck, setDeck] = useState(null);
  const [error, setError] = useState("");
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState(null);
  const [dealerStrength, setDealerStrength] = useState(null);

  // Payout states
  const [payout, setPayout] = useState("");
  const [payoutAmt, setPayoutAmt] = useState(0);
  const [isDealerQualified, setIsDealerQualified] = useState(undefined);
  const [playerAction, setPlayerAction] = useState("");
  const [winner, setWinner] = useState("");

  // History states
  const [chartData, setChartData] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

  // Chips states
  const [chips, setChips] = useState(BETS_SETTINGS.INITIAL_CHIPS);
  const [betAmount, setBetAmount] = useState(BETS_SETTINGS.DEFAULT_BET);
  const [isOverbet, setIsOverbet] = useState(undefined)

  // Settings
  const dealerCardSize = 60;
  const checkIconSize = 28;
  const checkIconWeight = "bold";
  const headerFontSize = "h2";
  const strengthFontSize = "h4";

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
    setPayout("");
    setPayoutAmt(0);

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
      deckId: "",
      winner: null,
      playerHand: null,
      dealerHand: null,
      playerAction: null,
      playerStrength: null,
      dealerStrength: null,
      winningPokerHandClass: null,
      winningMultiplier: null,
      payoutAmt: 0,
      betAmount: null,
    };

    // storing Hands in gameRecord
    if (
      Array.isArray(dealerHand) &&
      dealerHand.length > 0 &&
      Array.isArray(playerHand) &&
      playerHand.length > 0 &&
      deck !== null &&
      deck !== undefined &&
      playerStrength != null &&
      dealerStrength != null &&
      betAmount != 0
    ) {
      Object.assign(gameRecord, {
        deckId: deck,
        playerHand,
        dealerHand,
        playerStrength,
        dealerStrength,
        betAmount,
      });
    } else {
      const errorMsg = "Error when saving game history.";
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    // player fold,
    if (playerAction === PLAYER_ACTION.FOLD) {
      setWinner(GAME_RESULT.WINNER_DEALER);
      setPayoutAmt(-1 * betAmount);
      gameRecord.winner = GAME_RESULT.WINNER_DEALER;
      gameRecord.playerAction = PLAYER_ACTION.FOLD;
      gameRecord.payoutAmt = -1 * betAmount;
      setGameHistory((prev) => [gameRecord, ...prev]);
      return;
    }

    // Player bet, Dealer did not qualified, pays the bet
    if (!isDealerQualified) {
      setWinner(GAME_RESULT.WINNER_PLAYER);
      setPayoutAmt(betAmount);
      setChips((prev) => prev + betAmount + betAmount);

      gameRecord.winner = GAME_RESULT.WINNER_PLAYER;
      gameRecord.playerAction = "Did not qualified";
      gameRecord.payoutAmt = betAmount;
      setGameHistory((prev) => [gameRecord, ...prev]);

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
        gameRecord.winner = GAME_RESULT.GAME_TIE;
        gameRecord.playerAction = GAME_RESULT.GAME_TIE;
        setGameHistory((prev) => [gameRecord, ...prev]);
        return;
      }

      const determinedWinner =
        winner[0] === dealerStrength
          ? GAME_RESULT.WINNER_DEALER
          : GAME_RESULT.WINNER_PLAYER;

      setWinner(determinedWinner);

      if (determinedWinner === GAME_RESULT.WINNER_PLAYER) {
        // Win both ante and bet
        const { payoutMultiplier, pokerHand } =
          determinePlayerPayoutMultiplier(playerStrength);
        const winning = betAmount * payoutMultiplier;
        setPayoutAmt(betAmount * 2 + winning);
        setPayout(`Bet + Ante with ${payoutMultiplier}x`);
        setChips((prev) => prev + betAmount * 3 + winning);
        gameRecord.winner = GAME_RESULT.WINNER_PLAYER;
        gameRecord.payoutAmt = betAmount * 2 + winning;
        gameRecord.winningPokerHandClass = pokerHand;
        gameRecord.winningMultiplier = payoutMultiplier;
      } else if (determinedWinner === GAME_RESULT.WINNER_DEALER) {
        // Lose both ante and bet
        setPayoutAmt(betAmount * -3);
        setChips((prev) => prev - (betAmount + betAmount));
        gameRecord.winner = GAME_RESULT.WINNER_DEALER;
        gameRecord.payoutAmt = betAmount * -3;
      }
      gameRecord.playerAction = PLAYER_ACTION.BET;
      setGameHistory((prev) => [gameRecord, ...prev]);
    } catch (e) {
      console.error("getWinner error:", e);
      return null;
    }
  };

  useEffect(() => {
    switch (gameState) {
      case GAME_STATE.LOADING:
        initGame()
        break
      case GAME_STATE.PLAYER_ACTED:
        getDealerRemainingCards()
        break
      case GAME_STATE.DETERMINE_WINNER:
        determineWinner()
        break
    }
  }, [gameState]);

  useEffect(() => {
    if (gameHistory.length > 0) {
      setChartData((prev) => [...prev, [gameHistory.length, chips]]);
    } else {
      setChartData([
        ["Games", "Chip count"],
        [0, chips],
      ]);
    }
  }, [gameHistory]);

  useEffect(() => {
    setIsOverbet(betAmount * 3 > chips)
  }, [betAmount])

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
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
        <div>
          <div className="h2 mb-0">Stud Poker</div>
          <div className="text-muted">
            {" "}
            {deck ? "Deck id: " + deck.deck_id : <>&nbsp;</>}
          </div>
        </div>
        <div className="border border-warning border-opacity-100 border-2 px-3 py-1 mb-1 rounded bg-warning bg-opacity-25 ">
          <div className="d-flex align-items-center gap-2">
            <div className="h5 mb-0">Chips: {formatCurrency(chips)}</div>
            {payoutAmt !== 0 && (
              <span
                className={`badge bg-opacity-75 ${payoutAmt > 0 ? "text-bg-success" : "text-bg-danger"}`}
              >
                {formatCurrency(payoutAmt)}
              </span>
            )}
          </div>
          <div className="h5">Bet Amount: {formatCurrency(betAmount)}</div>
        </div>
      </div>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}
      {/* SECTION: intro or Dealer Section */}
      <div>
        {gameState === GAME_STATE.IDLE && <IntroStudPoker />}
        {gameState !== GAME_STATE.IDLE &&
          (
            <div>
              <div className="mb-3">
                {/* Dealer title part */}
                <div className="d-flex align-items-center gap-2">
                  {winner === GAME_RESULT.WINNER_DEALER && (
                    <CheckIcon
                      size={checkIconSize}
                      weight={checkIconWeight}
                      className="text-success"
                    />
                  )}
                  <div className={headerFontSize}>Dealer's Hand</div>
                  {isDealerQualified ? (
                    <h6>
                      <span className="badge text-bg-success">Qualified</span>
                    </h6>
                  ) : isDealerQualified === false ? (
                    <h6>
                      <span className="badge text-bg-danger">
                        Did not qualified
                      </span>
                    </h6>
                  ) : (
                    <>&nbsp;</>
                  )}
                </div>
                {/* Dealer display part */}
                <div
                  className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity"
                  style={{ height: "120px" }}
                >
                  <div className="d-flex justify-content-start align-items-center gap-2">
                    <DisplayCards
                      size={dealerCardSize}
                      cards={gameState === GAME_STATE.LOADING ? [1, 1, 1, 1, 1] :
                        gameState === GAME_STATE.DETERMINE_WINNER ? (dealerHand) :
                          ([1, 1, 1, 1, ...dealerHand])
                      }
                      type={gameState === GAME_STATE.LOADING ? "revealNone" :
                        gameState === GAME_STATE.DETERMINE_WINNER ? "revealAll" : "revealOne"
                      }
                    />
                    {gameState === GAME_STATE.LOADING && <Spinner />}
                  </div>
                </div>
                <div className={strengthFontSize}>
                  {gameState === GAME_STATE.DETERMINE_WINNER
                    ? <span className="badge text-bg-light">{dealerStrength.descr}</span>
                    : <>&nbsp;</>}
                </div>
              </div>
            </div>)}
      </div>
      {/* SECTION : Player Deck */}
      <div>
        {gameState !== GAME_STATE.IDLE && (
          <div className="mb-3">
            {/* Player title part */}
            <div className="d-flex align-items-center gap-2">
              {winner === GAME_RESULT.WINNER_PLAYER && (
                <CheckIcon
                  size={checkIconSize}
                  weight={checkIconWeight}
                  className="text-success"
                />
              )}
              <div className={headerFontSize}>Player's Hand</div>
            </div>
            {/* Player display part */}
            <div
              className="p-3 bg-success col-md-10 col-lg-8 bg-opacity-25 rounded-3 border border-success border-2 border-opacity"
              style={{ height: "180px" }}
            >
              <DisplayCards
                className="bg-success"
                cards={gameState === GAME_STATE.LOADING ? [1, 1, 1, 1, 1] : playerHand}
                type={gameState === GAME_STATE.LOADING ? "revealNone" :
                  playerAction === PLAYER_ACTION.FOLD ? "revealNone" : "revealAll"
                }
              />
            </div>
            <div className={strengthFontSize}>

              {gameState !== GAME_STATE.LOADING
                ? <span className="badge text-bg-light">{playerStrength.descr}</span>
                : <>&nbsp;</>}

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
              <div className="d-grid gap-2 col-sm-6">
                {/* Start Game Button */}
                <button
                  type="button"
                  // className={`btn btn-lg ${betAmount * 3 <= chips ? "btn-primary" : "btn-warning opacity-100"}`}
                  className="btn btn-lg btn-primary"
                  disabled={chips < betAmount}
                  onClick={isOverbet ? undefined : startGame}
                  data-bs-toggle={isOverbet ? "modal" : undefined}
                  data-bs-target={isOverbet ? "#overbet" : undefined}
                >
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    Bet Ante {formatCurrency(betAmount)}
                    {isOverbet && <WarningCircleIcon size={32} aria-hidden="true" className="text-warning"/>}
                  </div>
                </button>
              </div>
              {/* Betting Amount Range Selector */}
              <div className="col-sm-6 mt-3">
                <input
                  type="range"
                  className="form-range"
                  id="betSize"
                  min={BETS_SETTINGS.BET_MIN}
                  max={BETS_SETTINGS.BET_MAX}
                  step={BETS_SETTINGS.BET_STEP}
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.valueAsNumber)}
                ></input>
              </div>
              {/* Modal for overbetting */}
              <Modal
                modalID="overbet"
                modalTitle="Bet May Limit Future Play"
                modalInstruction={
                  <>
                    <div className="mb-2">
                      After this bet, you'll have only {formatCurrency(chips - betAmount)}, but {formatCurrency(betAmount * 2)} is required for a later bet.
                    </div>
                    <div>
                      Continue anyway?
                    </div>
                  </>
                }
                closeBtnLabel="Cancel Bet"
                okBtnLabel={`Bet ${formatCurrency(betAmount)} anyway`}
                okBtnFunc={startGame}
              />
            </div>
          )}
        {(gameState === GAME_STATE.LOADING ||
          gameState === GAME_STATE.PLAYER_ACTED ||
          gameState === GAME_STATE.PLAYER_MOVE) && (
            <div>
              {/* Bet Button */}
              <button
                type="button"
                className="btn btn-success btn-lg col-5 col-md-3 cursor-pointer me-3 "
                onClick={bet}
                disabled={(gameState === GAME_STATE.LOADING ||
                  gameState === GAME_STATE.PLAYER_ACTED ||
                  chips < betAmount * 2)}
              >
                {gameState === GAME_STATE.PLAYER_MOVE
                  ? (
                    <div>Bet {formatCurrency(betAmount * 2)}</div>
                  ) : (
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="spinner-grow spinner-grow-sm me-2" aria-hidden="true"></span>
                      <span role="status">Loading</span>
                    </div>
                  )}
              </button>
              {/* Fold Button */}
              <button
                type="button"
                className="btn btn-danger btn-lg col-5 col-md-3 cursor-pointer"
                onClick={fold}
                disabled={(gameState === GAME_STATE.LOADING ||
                  gameState === GAME_STATE.PLAYER_ACTED)}
              >
                <div className="d-flex align-items-center justify-content-center">
                  {gameState !== GAME_STATE.PLAYER_MOVE &&
                    (<span className="spinner-grow spinner-grow-sm me-2" aria-hidden="true"></span>)
                  }
                  <span role="status">Fold</span>
                </div>
              </button>
            </div>
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
