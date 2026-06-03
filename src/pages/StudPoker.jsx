import React, { useEffect, useState } from "react";
import { getNewDeck, drawCardFromDeck } from "../services/deckService";
import { IMG_DECK_BACK } from "../constants/games";
import { Hand } from "pokersolver";
import { CheckIcon } from "@phosphor-icons/react";

const StudPoker = () => {
  const [gameState, setGameState] = useState("idle");
  //   idle, loading, playerMove, strength
  const [deck, setDeck] = useState(null);

  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [playerStrength, setPlayerStrength] = useState("");
  const [dealerStrength, setDealerStrength] = useState("");
  const [winner, setWinner] = useState("");

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

  const getStrengthOfHand = (hands) => {
    const codes = hands.map((card) => card.code.replace("0", "T"));
    const hand = Hand.solve(codes);
    return hand.descr;
  };

  useEffect(() => {
    if (gameState === "playerMove" && playerHand.length === 5) {
      const hand = getStrengthOfHand(playerHand);
      setPlayerStrength(hand);
    }
    if (gameState === "strength" && dealerHand.length === 5) {
      const hand = getStrengthOfHand(dealerHand);
      setDealerStrength(hand);
      setWinner(getWinner());
    }
  }, [gameState, playerHand, dealerHand]);

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
      throw e;
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
          <button type="button" className="btn btn-primary" onClick={startGame}>
            New Game
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
        <div className="container mb-5">
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

        <div className="container mb-5">
          <h2>Player's Hand</h2>
          {playerHand.map((card) => (
            <img
              key={card.code || index}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "150px" }}
            />
          ))}
          <h3>{playerStrength}</h3>
        </div>
        <div className="container">
          <h2>Action</h2>
          <span>
            <button
              type="button"
              className="btn btn-success cursor-pointer me-3"
              onClick={bet}
            >
              Bet
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

  if (gameState === "strength") {
    return (
      <div className="container my-4">
        <h2>Stud Poker</h2>
        <p>Deck: {deck?.deck_id}</p>
        <div className="container mb-5">
          {winner === "Dealer" && (
            <CheckIcon size={32} weight="bold" className="text-success" />
          )}
          <h2>Dealer's Hand</h2>
          {dealerHand.map((card) => (
            <img
              key={card.code}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "100px" }}
            />
          ))}
          <h3>{dealerStrength}</h3>
        </div>

        <div className="container mb-5">
          <div className="d-flex align-items-center gap-2">
            {winner === "Player" && (
              <CheckIcon size={32} weight="bold" className="text-success" />
            )}
            <h2>Player's Hand</h2>
          </div>
          {playerHand.map((card) => (
            <img
              key={card.code}
              src={card.image}
              className="img-fluid"
              style={{ maxHeight: "150px" }}
            />
          ))}
          <h3>{playerStrength}</h3>
        </div>
        <div className="container">
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Next Game
          </button>
        </div>
      </div>
    );
  }
};

export default StudPoker;
