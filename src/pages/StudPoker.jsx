import React, { useEffect, useState } from "react";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { IMG_DECK_BACK } from "../constants/games";
import { Hand } from "pokersolver";
import { CheckIcon } from "@phosphor-icons/react";
import DisplayCards from "../components/DisplayCards";
import { formatCurrency } from "../utils/formatCurrency";

const StudPoker = () => {
  const [gameState, setGameState] = useState("idle");
  //   idle, loading, playerMove, playerBet, playerFolds
  const [deck, setDeck] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState(null);
  const [dealerStrength, setDealerStrength] = useState(null);
  const [winner, setWinner] = useState("");

  const [chips, setChips] = useState(1000);
  const [betAmount, setBetAmount] = useState(50);

  const [isDealerQualified, setIsDealerQualified] = useState(false);

  const getDeck = async () => {
    try {
      const deckData = await getNewDeck({
        noOfDecks: 1,
        jokersEnabled: false,
      });
      return deckData;
    } catch (e) {
      console.error(e);
      throw e;
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

  const getWinner = () => {
    if (
      !dealerHand ||
      !playerHand ||
      dealerHand.length === 0 ||
      playerHand.length === 0
    )
      return null;
    try {
      const dealerCodes = dealerHand.map((card) => card.code.replace("0", "T"));
      const playerCodes = playerHand.map((card) => card.code.replace("0", "T"));
      const dealerSolved = Hand.solve(dealerCodes);
      const playerSolved = Hand.solve(playerCodes);
      const winner = Hand.winners([dealerSolved, playerSolved]);

      if (winner.length > 1) return "Push";
      return winner[0] === dealerSolved ? "Dealer" : "Player";
    } catch (e) {
      console.error("getWinner error:", e);
      return null;
    }
  };

  // Dealer needs to have at least a Ace King to qualify.
  // If the dealer does not qualify, the player wins and is paid 1:1 on the ante bet,
  // and the play bet is returned to the player.
  // If the dealer qualifies, then the hands are compared to determine the winner.
  // If the dealer's hand is better than the player's hand, the dealer wins and takes both the
  // ante and play bets.
  // If the player's hand is better than the dealer's hand, the player wins and is paid 1:1 on both the
  // ante and play bets.
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

  const getStrengthOfHand = (hands) => {
    const codes = hands.map((card) => card.code.replace("0", "T"));
    const hand = Hand.solve(codes);
    return hand;
  };

  useEffect(() => {
    if (gameState === "playerMove" && playerHand.length === 5) {
      const strength = getStrengthOfHand(playerHand);
      setPlayerStrength(strength.descr);
    }
    if (gameState === "playerMove" && dealerHand.length === 5) {
      const strength = getStrengthOfHand(dealerHand);
      setDealerStrength(strength.descr);
      const dealerQ = checkDealerQualification(strength);
      setIsDealerQualified(dealerQ);
    }
    if (gameState === "playerBet") {
      const winner = getWinner();
      const winning = 2

      if (!isDealerQualified) {
        // Dealer doesn't qualify → player wins ante only
        setChips((prev) => prev + betAmount * winning);
        setWinner("Player");
      } else {
        if (winner === "Player") {
          // Win both ante and bet
          setChips((prev) => prev + betAmount * winning * winning);
        } else if (winner === "Dealer") {
          // Lose both ante and bet
          setChips((prev) => prev - betAmount * winning);
        }
        setWinner(winner);
      }
    }
    if (gameState === "playerFolds") {
      setWinner("Dealer");
    }
  }, [gameState, playerHand, dealerHand]);

  const startGame = async () => {
    setGameState("loading");
    try {
      // reset all state for new game
      setPlayerHand([]);
      setDealerHand([]);
      setPlayerStrength(null);
      setDealerStrength(null);
      setWinner("");
      setDeck(null);

      const fetchDeck = await getDeck();
      if (!fetchDeck) return;

      setDeck(fetchDeck);

      const playerHand = await getHand(fetchDeck.deck_id);
      setPlayerHand(playerHand.cards);

      const dealerHand = await getHand(fetchDeck.deck_id);
      setDealerHand(dealerHand.cards);

      // deduct chips for the bet
      setChips((prev) => prev - betAmount);
    } catch (e) {
      console.error(e);
      throw e;
    } finally {
      setGameState("playerMove");
    }
  };

  const bet = () => {
    setGameState("playerBet");
  };

  const fold = () => {
    setGameState("playerFolds");
  };

  if (gameState === "idle") {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-between mb-3">
          <p className="h2">Stud Poker</p>
          <div className="border p-3 rounded bg-success bg-opacity-25">
            <p className="h5">Chips: {formatCurrency(chips)}</p>
            <p className="h5">Bet Amount: {formatCurrency(betAmount)}</p>
          </div>
        </div>
        <div>
          <p>
            Stud Poker is a head-to-head card game between you and the dealer.
            Each player is dealt a five-card hand from a single shuffled deck.
            You cannot swap or draw new cards — your hand is final once dealt.
          </p>

          <p>
            The dealer keeps most of their cards hidden until the reveal. After
            reviewing your hand, you can choose to Ante (bet) or Fold. The
            winner is decided using standard poker hand rankings like pairs,
            straights, flushes, and full houses.
          </p>

          <p>If both hands have equal strength, the round ends in a push.</p>
        </div>
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
      </div>
    );
  }

  if (gameState === "loading") {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-between">
          <div>
            <p className="h2">Stud Poker</p>
          </div>
          <div className="border p-3 rounded bg-success bg-opacity-25">
            <p className="h5">Chips: {formatCurrency(chips)}</p>
            <p className="h5">Bet Amount: {formatCurrency(betAmount)}</p>
          </div>
        </div>
        <div className="spinner-grow" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (gameState === "playerMove") {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-between">
          <div>
            <p className="h2">Stud Poker</p>
            <p className="small text-muted">Deck: {deck?.deck_id}</p>
          </div>
          <div className="border p-3 rounded bg-success bg-opacity-25">
            <p className="h5">Chips: {formatCurrency(chips)}</p>
            <p className="h5">Bet Amount: {formatCurrency(betAmount)}</p>
          </div>
        </div>
        <div className="container mb-5">
          <h2>Dealer's Hand</h2>
          <DisplayCards cards={dealerHand} size={100} type="revealOne" />
        </div>

        <div className="container mb-5">
          <h2>Player's Hand</h2>
          <DisplayCards cards={playerHand} />
          <h3>{playerStrength}</h3>
        </div>
        <div className="container">
          <h2>Action</h2>
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
        </div>
      </div>
    );
  }

  if (gameState === "playerBet" || gameState === "playerFolds") {
    return (
      <div className="container my-4">
        <div className="d-flex justify-content-between">
          <div>
            <p className="h2">Stud Poker</p>
            <p className="small text-muted">Deck: {deck?.deck_id}</p>
          </div>
          <div className="border p-3 rounded bg-success bg-opacity-25">
            <p className="h5">Chips: {formatCurrency(chips)}</p>
            <p className="h5">Bet Amount: {formatCurrency(betAmount)}</p>
          </div>
        </div>
        <div className="container mb-5">
          <div className="d-flex align-items-center gap-2">
            <h2>Dealer's Hand</h2>
            {winner === "Dealer" && (
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

        <div className="container mb-5">
          <div className="d-flex align-items-center gap-2">
            <h2>Player's Hand</h2>
            {winner === "Player" && (
              <CheckIcon size={32} weight="bold" className="text-success" />
            )}
          </div>
          <DisplayCards
            cards={playerHand}
            type={gameState === "playerFolds" ? "revealNone" : "revealAll"}
          />
          <h3>{playerStrength}</h3>
        </div>
        <div className="container">
          <button
            type="button"
            className="btn btn-primary"
            onClick={startGame}
            disabled={chips < betAmount}
          >
            Next Game
          </button>
        </div>
      </div>
    );
  }
};

export default StudPoker;
