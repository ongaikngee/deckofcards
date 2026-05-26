import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { drawCardFromDeck } from "../services/api";

export const CurrentGame = ({ games, setGames }) => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deckInfo, setDeckInfo] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deckLoading, setDeckLoading] = useState(false);
  const [error, setError] = useState(null);
  const cardsContainerRef = useRef(null);
  const firstCardRef = useRef(null);
  const [overlap, setOverlap] = useState(0);
  // Minimum visible portion (in pixels) of each card when overlapping.
  // Change this value to increase/decrease how much of each card remains visible.
  const CARD_OVERLAP_SPACING = 19; // px — configurable: try 10, 15, 20

  useEffect(() => {
    // Fetch initial deck information and set up the page
    const fetchDeckInfo = async () => {
      setDeckLoading(true);
      setError(null);
      try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/`);
        const data = await response.json();
        setDeckInfo(data);
      } catch (err) {
        setError("Failed to load deck information");
        console.error(err);
      } finally {
        setDeckLoading(false);
      }
    };

    if (deckId) {
      fetchDeckInfo();
    }
  }, [deckId]);

  // If the games prop contains drawn cards for this deck, load them
  useEffect(() => {
    if (!deckId || !games) return;
    const existing = games.find((g) => g.gameId === deckId);
    if (existing && Array.isArray(existing.drawn)) {
      setCards(existing.drawn);
    }
  }, [deckId, games]);

  // Calculate overlap amount so cards remain in one row and overlap when needed
  useLayoutEffect(() => {
    let cancelled = false;

    const calc = () => {
      const container = cardsContainerRef.current;
      const firstCard = firstCardRef.current;
      if (!container || cards.length === 0) {
        setOverlap(0);
        return;
      }

      // Wait until images inside the container have loaded, otherwise measurements may be 0
      const imgs = Array.from(container.querySelectorAll('img'));
      const notLoaded = imgs.filter((img) => !img.complete || img.naturalWidth === 0);
      if (notLoaded.length > 0) {
        const onLoaded = () => {
          if (cancelled) return;
          requestAnimationFrame(calc);
        };
        notLoaded.forEach((img) => img.addEventListener('load', onLoaded));

        // fallback: try again after a short delay in case load events didn't fire
        const fallback = setTimeout(() => { if (!cancelled) requestAnimationFrame(calc); }, 300);

        return () => {
          cancelled = true;
          notLoaded.forEach((img) => img.removeEventListener('load', onLoaded));
          clearTimeout(fallback);
        };
      }

      const containerW = container.clientWidth || 0;
      const cardW = firstCard ? firstCard.clientWidth : 160; // fallback
      const totalWidth = cardW * cards.length;

      if (totalWidth <= containerW) {
        setOverlap(0);
        return;
      }

      // ensure at least `minVisible` px of each card remains visible
      // `CARD_OVERLAP_SPACING` controls how many pixels of each card remain visible
      const minVisible = Math.min(CARD_OVERLAP_SPACING, Math.floor(cardW * 0.9));
      const maxOverlapPerGap = cardW - minVisible;

      const neededOverlap = Math.ceil((totalWidth - containerW) / (cards.length - 1));
      setOverlap(Math.min(neededOverlap, maxOverlapPerGap));
    };

    calc();
    window.addEventListener("resize", calc);
    return () => { cancelled = true; window.removeEventListener("resize", calc); };
  }, [cards]);

  const handleDrawCard = async () => {
    setLoading(true);
    setError(null);

    try {
      const drawData = await drawCardFromDeck(deckId, 1);
      if (!drawData.success) {
        throw new Error("Failed to draw a card from the deck.");
      }

      // update local cards state
      setCards((prevCards) => {
        const next = [...prevCards, ...drawData.cards];
        return next;
      });

      // update deck info
      setDeckInfo((prevInfo) => ({
        ...prevInfo,
        remaining: drawData.remaining,
      }));

      // persist drawn card into the parent games state
      if (setGames) {
        setGames((prevGames) =>
          prevGames.map((g) =>
            g.gameId === deckId ? { ...g, drawn: [...(g.drawn || []), ...drawData.cards] } : g
          )
        );
      }
    } catch (err) {
      setError(err.message || "Could not draw a card.");
      console.error("Error drawing card:", err);
    } finally {
      setLoading(false);
    }
  };

      const currentGame = games?.find((g) => g.gameId === deckId);
      const gameName = currentGame?.name || deckId;
      const gamesId = currentGame?.gameId

  if (!deckId) {
    return (
      <div className="container">
        <h2>Invalid Game ID</h2>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
        <h2 className="mb-0">{gameName}</h2>
        <p className="text-secondary">ID: {gamesId}</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/")}>
          Back to Games
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Deck Information</h5>

          {deckLoading && !deckInfo ? (
            <div className="d-flex justify-content-center my-4">
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : deckInfo ? (
            <div className="fade-in">
              <p>
                <strong>Deck ID:</strong> {deckInfo.deck_id}
              </p>
              <p>
                <strong>Cards Remaining:</strong> {deckInfo.remaining} / {deckInfo.remaining + cards.length}
              </p>
              <p>
                <strong>Shuffled:</strong> {deckInfo.shuffled ? "Yes" : "No"}
              </p>
            </div>
          ) : (
            <p className="text-muted">Deck information will appear here.</p>
          )}

          <button
            className="btn btn-primary"
            onClick={handleDrawCard}
            disabled={loading || deckLoading || (deckInfo?.remaining === 0)}
          >
            {loading ? "Drawing..." : "Draw Card"}
          </button>
        </div>
      </div>

      {cards.length > 0 && (
        <div className="mt-4">
          <h5>Cards Drawn</h5>
          <div
            ref={cardsContainerRef}
            className="d-flex cards-stack mt-2"
            aria-live="polite"
          >
            {cards.map((card, index) => (
              <div
                key={index}
                ref={index === 0 ? firstCardRef : null}
                className="card-stack-item mb-3"
                style={{ marginLeft: index === 0 ? 0 : `-${overlap}px`, zIndex: index }}
              >
                <img
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                  className="img-fluid"
                  style={{ maxHeight: "200px" }}
                />
                {/* <p className="text-center mt-2 mb-0">
                  {card.value} of {card.suit}
                </p> */}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
