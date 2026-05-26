import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { drawCardFromDeck } from "../services/api";

export const CurrentGame = ({ games, setGames }) => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const [deckInfo, setDeckInfo] = useState(null);
  const [cards, setCards] = useState([]);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch initial deck information and set up the page
    const fetchDeckInfo = async () => {
      try {
        const response = await fetch(
          `https://deckofcardsapi.com/api/deck/${deckId}/`,
        );
        const data = await response.json();
        setDeckInfo(data);
      } catch (err) {
        setError("Failed to load deck information");
        console.error(err);
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
    if (existing) {
      if (Array.isArray(existing.drawn)) {
        setCards(existing.drawn);
      }
      if (Array.isArray(existing.players)) {
        setPlayers(existing.players);
      }
    }
  }, [deckId, games]);

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
            g.gameId === deckId
              ? { ...g, drawn: [...(g.drawn || []), ...drawData.cards] }
              : g,
          ),
        );
      }
    } catch (err) {
      setError(err.message || "Could not draw a card.");
      console.error("Error drawing card:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlayer = () => {
    const name = window.prompt("Enter player name:");
    if (!name) return;

    const newPlayer = { id: Date.now().toString(), name };
    setPlayers((prev) => {
      const next = [...prev, newPlayer];
      return next;
    });

    if (setGames) {
      setGames((prevGames) =>
        prevGames.map((g) =>
          g.gameId === deckId
            ? { ...g, players: [...(g.players || []), newPlayer] }
            : g,
        ),
      );
    }
  };
  const currentGame = games?.find((g) => g.gameId === deckId);
  const gameName = currentGame?.name || deckId;
  const gamesId = currentGame?.gameId;

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

      {deckInfo && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Deck Information</h5>
            <p>
              <strong>Deck ID:</strong> {deckInfo.deck_id}
            </p>
            <p>
              <strong>Cards Remaining:</strong> {deckInfo.remaining} /{" "}
              {deckInfo.remaining + cards.length}
            </p>
            <p>
              <strong>Shuffled:</strong> {deckInfo.shuffled ? "Yes" : "No"}
            </p>
            <button
              className="btn btn-primary"
              onClick={handleDrawCard}
              disabled={loading || deckInfo.remaining === 0}
            >
              {loading ? "Drawing..." : "Draw Card"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5>Players</h5>
          <button className="btn btn-sm btn-success" onClick={handleAddPlayer}>
            Add Player
          </button>
        </div>

        {players && players.length > 0 ? (
          <ul className="list-group">
            {players.map((p) => (
              <li key={p.id} className="list-group-item">
                {p.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No players yet. Add one to start.</p>
        )}
      </div>

      {cards.length > 0 && (
        <div className="mt-4">
          <h5>Cards Drawn</h5>
          <div className="row">
            {cards.map((card, index) => (
              <div key={index} className="col-md-3 col-sm-6 mb-3">
                <img
                  src={card.image}
                  alt={`${card.value} of ${card.suit}`}
                  className="img-fluid"
                  style={{ maxHeight: "200px" }}
                />
                <p className="text-center mt-2">
                  {card.value} of {card.suit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
