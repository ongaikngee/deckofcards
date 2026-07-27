import React, { useState, useEffect, useRef } from "react";

// components
import { useAuth } from "../features/auth/AuthContext";
import IntroBaccarat from "../features/games/BaccaratIntro";
import BaccaratPlayerMove from "../features/games/BaccaratPlayerMove";
import BaccaratCardsPanel from "../features/games/BaccaratCardsPanel";
import StudPokerHistory from "../features/games/StudPokerHistory";
import BigRoad from '../features/games/BigRoad';
import StudPokerLineChart from '../features/games/StudPokerLineChart';
import Spinner from "../components/Spinner";

// helpers
import { GAME_STATE, BETS_SETTINGS, CHIP_UPDATE_REASON, GAME_RESULT } from "../constants/games";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { getChipsHistoryService, updateChipsAmtService } from "../services/chipService";
import { formatCurrency } from "../utils/formatCurrency";

const BaccaratPage = () => {
  // Game cards state
  const [gameState, setGameState] = useState(GAME_STATE.INTRO);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Baccarat deal state
  const [deckId, setDeckId] = useState(null);
  const [playerCards, setPlayerCards] = useState([]);
  const [bankerCards, setBankerCards] = useState([]);
  const [dealMessage, setDealMessage] = useState("");
  const [dealLoading, setDealLoading] = useState(false);
  const [baccaratError, setBaccaratError] = useState("");
  const [baccaratWinner, setBaccaratWinner] = useState(null);
  const revealTimers = useRef([]);

  // Chips states
  const [chips, setChips] = useState(0);
  const [betAmount, setBetAmount] = useState(BETS_SETTINGS.BET_MIN);
  const [betType, setBetType] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [gameHistory, setGameHistory] = useState([]);

  const getChipsHistory = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await getChipsHistoryService(user.id);
      setChips(response.total_amount);
      setChartData([
        ["Games", "Chip count"],
        [0, response.total_amount],
      ]);
    } catch (e) {
      setError(e);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateChipCount = async (reason, amount) => {
    setError("");
    try {
      await updateChipsAmtService({
        user_id: user.id,
        amt: amount,
        reason,
      });
    } catch (e) {
      const errorMessage = e?.detail || e?.message || "Chip update failed";
      setError(errorMessage);
      console.error(e);
    }
  };

  const addGameHistory = (record, newChipCount) => {
    setGameHistory((prev) => [record, ...prev]);
    setChartData((prev) => [
      ...prev,
      [prev.length - 1, newChipCount],
    ]);
  };

  const settleBaccaratPayout = async (
    winner,
    finalPlayerCards,
    finalBankerCards,
  ) => {
    setBaccaratWinner(winner);

    const playerTotal = baccaratTotal(finalPlayerCards);
    const bankerTotal = baccaratTotal(finalBankerCards);
    const record = {
      winner,
      playerHand: finalPlayerCards,
      dealerHand: finalBankerCards,
      playerStrength: { descr: `Total: ${playerTotal}` },
      dealerStrength: { descr: `Total: ${bankerTotal}` },
      playerAction: betType === "tie" ? "Tie Bet" : `${betType} Bet`,
      winningPokerHandClass:
        winner === GAME_RESULT.WINNER_DEALER && bankerTotal === 6
          ? "Banker Tiger 6"
          : null,
      winningMultiplier: null,
      payoutAmt: 0,
      betAmount,
    };

    if (winner === GAME_RESULT.GAME_TIE) {
      if (betType === "tie") {
        const payoutAmount = betAmount * 8;
        const newChipCount = chips + payoutAmount;
        setDealMessage("Tie bet wins 8:1.");
        setChips(newChipCount);
        await updateChipCount(CHIP_UPDATE_REASON.PAYOUT, payoutAmount);
        record.winningMultiplier = 8;
        record.payoutAmt = payoutAmount;
        record.bettorWon = true;
        addGameHistory(record, newChipCount);
        return;
      }

      const returnAmount = betAmount;
      const newChipCount = chips + returnAmount;
      setDealMessage("Tie. Your wager is returned.");
      setChips(newChipCount);
      await updateChipCount(CHIP_UPDATE_REASON.PAYOUT, returnAmount);
      record.payoutAmt = returnAmount;
      record.bettorWon = false;
      addGameHistory(record, newChipCount);
      return;
    }

    const betWins =
      (winner === GAME_RESULT.WINNER_PLAYER && betType === "player") ||
      (winner === GAME_RESULT.WINNER_DEALER && betType === "banker");

    if (!betWins) {
      const newChipCount = chips;
      setDealMessage(
        `Round complete. ${winner === GAME_RESULT.WINNER_PLAYER ? "Player" : "Banker"
        } wins.`,
      );
      record.payoutAmt = 0;
      record.bettorWon = false;
      addGameHistory(record, newChipCount);
      return;
    }

    const isBankerTiger6 = winner === GAME_RESULT.WINNER_DEALER && bankerTotal === 6;
    const payoutMultiplier = isBankerTiger6 ? 1.5 : 2;
    const payoutAmount = betAmount * payoutMultiplier;
    const newChipCount = chips + payoutAmount;

    setDealMessage(
      `Round complete. ${winner === GAME_RESULT.WINNER_PLAYER ? "Player" : "Banker"
      } wins. ${isBankerTiger6 ? "Banker 🐯6 Payout 2:1." : "Payout 1:1."
      }`,
    );
    setChips(newChipCount);
    await updateChipCount(CHIP_UPDATE_REASON.PAYOUT, payoutAmount);
    record.winningMultiplier = isBankerTiger6 ? 1.5 : 1;
    record.payoutAmt = payoutAmount;
    record.bettorWon = true;
    addGameHistory(record, newChipCount);
  };

  useEffect(() => {
    getChipsHistory();
  }, []);

  const cardPoint = (card) => {
    switch (card?.value) {
      case "ACE":
        return 1;
      case "2":
        return 2;
      case "3":
        return 3;
      case "4":
        return 4;
      case "5":
        return 5;
      case "6":
        return 6;
      case "7":
        return 7;
      case "8":
        return 8;
      case "9":
        return 9;
      case "10":
      case "JACK":
      case "QUEEN":
      case "KING":
      default:
        return 0;
    }
  };

  const baccaratTotal = (cards) =>
    cards.reduce((sum, card) => sum + cardPoint(card), 0) % 10;

  const playerNeedsThird = (playerTotal) => playerTotal <= 5;

  const bankerNeedsThird = (bankerTotal, playerThirdCard) => {
    if (!playerThirdCard) {
      return bankerTotal <= 5;
    }

    const thirdValue = cardPoint(playerThirdCard);
    if (bankerTotal <= 2) return true;
    if (bankerTotal === 3) return thirdValue !== 8;
    if (bankerTotal === 4) return thirdValue >= 2 && thirdValue <= 7;
    if (bankerTotal === 5) return thirdValue >= 4 && thirdValue <= 7;
    if (bankerTotal === 6) return thirdValue === 6 || thirdValue === 7;
    return false;
  };

  const determineBaccaratWinner = (playerCards, bankerCards) => {
    const playerTotal = baccaratTotal(playerCards);
    const bankerTotal = baccaratTotal(bankerCards);
    if (playerTotal > bankerTotal) return GAME_RESULT.WINNER_PLAYER;
    if (playerTotal < bankerTotal) return GAME_RESULT.WINNER_DEALER;
    return GAME_RESULT.GAME_TIE;
  };

  useEffect(() => {
    const clearRevealTimers = () => {
      revealTimers.current.forEach(clearTimeout);
      revealTimers.current = [];
    };

    const revealSequence = (sequence = [], afterReveal) => {
      if (sequence.length === 0) {
        afterReveal?.();
        return;
      }

      sequence.forEach((entry, index) => {
        const timer = setTimeout(
          () => {
            setDealMessage(
              `Dealing ${entry.target} card ${entry.displayIndex}`,
            );

            if (entry.target === "player") {
              setPlayerCards((prev) => [...prev, entry.card]);
            } else {
              setBankerCards((prev) => [...prev, entry.card]);
            }

            if (index === sequence.length - 1) {
              afterReveal?.();
            }
          },
          (index + 1) * 1000,
        );

        revealTimers.current.push(timer);
      });
    };

    const dealBaccaratRound = async () => {
      clearRevealTimers();
      setBaccaratWinner(null);
      setBaccaratError("");
      setPlayerCards([]);
      setBankerCards([]);
      setDealMessage("Shuffling baccarat deck...");
      setDealLoading(true);

      try {
        const newDeck = await getNewDeck({
          noOfDecks: 1,
          jokersEnabled: false,
        });
        setDeckId(newDeck.deck_id);

        const openingDraw = await drawCardFromDeck(newDeck.deck_id, 4);
        if (!openingDraw.success || openingDraw.cards.length < 4) {
          throw new Error("Failed to draw the initial baccarat cards.");
        }

        const betDeduction = -betAmount;
        setChips((prev) => prev + betDeduction);
        await updateChipCount(CHIP_UPDATE_REASON.ANTE, betDeduction);

        const initialSequence = [
          { target: "player", card: openingDraw.cards[0], displayIndex: 1 },
          { target: "banker", card: openingDraw.cards[1], displayIndex: 1 },
          { target: "player", card: openingDraw.cards[2], displayIndex: 2 },
          { target: "banker", card: openingDraw.cards[3], displayIndex: 2 },
        ];

        const playerStartingCards = [openingDraw.cards[0], openingDraw.cards[2]];
        const bankerStartingCards = [openingDraw.cards[1], openingDraw.cards[3]];

        revealSequence(initialSequence, async () => {
          const playerTotal = baccaratTotal(playerStartingCards);
          const bankerTotal = baccaratTotal(bankerStartingCards);
          const natural = playerTotal >= 8 || bankerTotal >= 8;

          if (natural) {
            const winner = determineBaccaratWinner(
              playerStartingCards,
              bankerStartingCards,
            );
            await settleBaccaratPayout(
              winner,
              playerStartingCards,
              bankerStartingCards,
            );
            setBetType(undefined);
            setDealLoading(false);
            return;
          }

          let playerThirdCard = null;
          const extraSequence = [];
          const finalPlayerCards = [...playerStartingCards];
          const finalBankerCards = [...bankerStartingCards];

          if (playerNeedsThird(playerTotal)) {
            setDealMessage("Player draws a third card...");
            const drawResult = await drawCardFromDeck(newDeck.deck_id, 1);
            if (!drawResult.success || drawResult.cards.length < 1) {
              throw new Error("Failed to draw player third card.");
            }
            playerThirdCard = drawResult.cards[0];
            finalPlayerCards.push(playerThirdCard);
            extraSequence.push({
              target: "player",
              card: playerThirdCard,
              displayIndex: 3,
            });
          }

          if (bankerNeedsThird(bankerTotal, playerThirdCard)) {
            setDealMessage("Banker draws a third card...");
            const drawResult = await drawCardFromDeck(newDeck.deck_id, 1);
            if (!drawResult.success || drawResult.cards.length < 1) {
              throw new Error("Failed to draw banker third card.");
            }
            finalBankerCards.push(drawResult.cards[0]);
            extraSequence.push({
              target: "banker",
              card: drawResult.cards[0],
              displayIndex: playerThirdCard ? 3 : 3,
            });
          }

          if (extraSequence.length === 0) {
            const winner = determineBaccaratWinner(
              finalPlayerCards,
              finalBankerCards,
            );
            await settleBaccaratPayout(
              winner,
              finalPlayerCards,
              finalBankerCards,
            );
            setBetType(undefined);
            setDealLoading(false);
            return;
          }

          revealSequence(extraSequence, async () => {
            const winner = determineBaccaratWinner(
              finalPlayerCards,
              finalBankerCards,
            );
            await settleBaccaratPayout(
              winner,
              finalPlayerCards,
              finalBankerCards,
            );
            setBetType(undefined);
            setDealLoading(false);
          });
        });
      } catch (err) {
        console.error(err);
        setBaccaratError(err.message || "Could not deal baccarat hand.");
        setDealLoading(false);
      }
    };

    if (gameState === GAME_STATE.PLAYER_ACTED && betType) {
      dealBaccaratRound();
    }

    return () => {
      clearRevealTimers();
    };
  }, [gameState, betType]);

  return (
    <div className="container my-4">
      <div className="d-flex flex-column flex-sm-row justify-content-between mb-2">
        <div>
          <div className="h2 mb-0">Baccarat</div>
        </div>
        <div className="border border-warning border-opacity-100 border-2 px-3 py-1 mb-1 rounded bg-warning bg-opacity-25 ">
          <div className="d-flex align-items-center gap-2">
            <div className="h5 mb-0">Chips:{" "}
              {loading ? (
                <Spinner size="spinner-grow-sm" />
              ) : (
                formatCurrency(chips)
              )}</div>
          </div>
          {gameState !== GAME_STATE.INTRO && (
            <div>
              <div className="text-muted">
                Bet Amount: {formatCurrency(betAmount)}
              </div>
              <div className="text-muted">Bet Type: {betType}</div>
            </div>
          )}
        </div>
      </div>
      {/* intro */}
      {gameState === GAME_STATE.INTRO && (
        <IntroBaccarat setGameState={setGameState} />
      )}
      {/* Game cards panel */}
      {gameState !== GAME_STATE.INTRO && (
        <BaccaratCardsPanel
          gameState={gameState}
          playerCards={playerCards}
          bankerCards={bankerCards}
          dealMessage={dealMessage}
          dealLoading={dealLoading}
          baccaratError={baccaratError}
          baccaratWinner={baccaratWinner}
        />
      )}
      {gameState !== GAME_STATE.INTRO && (
        <BaccaratPlayerMove
          gameState={gameState}
          betAmount={betAmount}
          setGameState={setGameState}
          setBetAmount={setBetAmount}
          setBetType={setBetType}
          isDealing={dealLoading}
        />
      )}
      {gameState !== GAME_STATE.INTRO && gameHistory.length > 0 && (
        <>
          <hr />
          <BigRoad history={gameHistory} />
          <StudPokerLineChart chartData={chartData} />
          <StudPokerHistory SPGames={gameHistory} playerLabel="Player" opponentLabel="Banker" />
        </>
      )}
    </div>
  );
};

export default BaccaratPage;
