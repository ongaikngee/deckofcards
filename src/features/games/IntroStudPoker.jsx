import React, { useState } from "react";
import DisplayCards from "../../components/DisplayCards";
import { STUD_POKER_HANDS, STUD_POKER_PAYOUT } from "../../constants/games";

const IntroStudPoker = () => {
  const [expandedHand, setExpandedHand] = useState(null);

  const hands = STUD_POKER_HANDS.map((h) => ({
    name: h.name,
    description: h.description,
    cardCodes: h.cardCodes,
    multiplier: `${STUD_POKER_PAYOUT[h.payoutKey]}x`,
  }));

  const convertToCardObjects = (cardCodes) => {
    return cardCodes.map((code) => ({
      image: `https://deckofcardsapi.com/static/img/${code}.png`,
    }));
  };

  return (
    <div className="my-4">
      {/* Introduction */}
      <div className="mb-4">
        <h4 className="mb-3">How to Play Caribbean Stud Poker</h4>

        <p className="text-muted">
          Caribbean Stud Poker is a head-to-head card game where you compete
          against the dealer. Both you and the dealer receive a five-card hand
          from a single shuffled deck. Your hand is final — no draws or card
          exchanges are allowed.
        </p>

        <p className="text-muted">
          After reviewing your cards, you choose to <strong>Raise</strong>{" "}
          (continue with an additional bet) or <strong>Fold</strong> (forfeit
          your ante bet). The dealer then reveals their hand.
        </p>

        <p className="text-muted">
          To qualify, the dealer must have{" "}
          <strong>Ace-King high or better</strong>. If the dealer does not
          qualify, your ante bet wins according to the game rules and your raise
          bet is returned. If the dealer qualifies, your hand is compared with
          the dealer's hand using standard poker rankings. The higher hand wins,
          while equal hands result in a push (tie).
        </p>
      </div>

      {/* Hand Rankings & Payouts */}
      <div>
        <h5 className="mb-3">
          <span className="badge bg-warning">Hand Rankings & Payouts</span>
        </h5>

        {/* Desktop / Tablet: Scrollspy (md and up) */}
        <div className="d-none d-md-block">
          <div className="row g-3">
            {/* Left: Hand List */}
            <div className="col-3">
              <div id="hand-list" className="list-group sticky-top">
                {hands.map((hand, idx) => (
                  <a
                    key={idx}
                    className="list-group-item list-group-item-action"
                    href={`#hand-${idx}`}
                  >
                    <div className="text-truncate">
                      <small className="fw-bold">{hand.name}</small>
                      {/* <div className="small text-muted">{hand.multiplier}</div> */}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Scrollspy Content */}
            <div className="col-9">
              <div
                id="scrollspy-content"
                data-bs-spy="scroll"
                data-bs-target="#hand-list"
                data-bs-smooth-scroll="true"
                className="scrollspy-example"
                style={{ height: "360px", overflowY: "scroll" }}
              >
                {hands.map((hand, idx) => (
                  <div key={idx} id={`hand-${idx}`} className="mb-4">
                    <h6 className="mb-2">
                      <strong>{hand.name}</strong>
                      <span className="badge bg-success ms-2">{hand.multiplier}</span>
                    </h6>
                    <p className="small text-muted mb-3">{hand.description}</p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-start",
                        alignItems: "center",
                      }}
                    >
                      <DisplayCards
                        cards={convertToCardObjects(hand.cardCodes)}
                        size={60}
                        type="revealAll"
                      />
                    </div>
                    <hr className="my-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: stacked list (smaller screens) */}
        <div className="d-block d-md-none">
          <div className="list-group">
            {hands.map((hand, idx) => (
              <div
                key={idx}
                className="list-group-item"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setExpandedHand(expandedHand === idx ? null : idx)
                }
              >
                <div className="d-flex w-100 justify-content-between align-items-center">
                  <div>
                    <strong>{hand.name}</strong>
                    <div className="small text-muted">{hand.description}</div>
                  </div>
                  <div>
                    <span className="badge bg-success">{hand.multiplier}</span>
                  </div>
                </div>

                <div
                  className="mt-2"
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <DisplayCards
                    cards={convertToCardObjects(hand.cardCodes)}
                    size={60}
                    type="revealAll"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-3 bg-light rounded">
        <h6 className="mb-2">💡 Quick Tips</h6>
        <ul className="small mb-0">
          <li>Fold early if your hand is weak to minimize losses</li>
          <li>Royal Flush is the rarest but most valuable hand</li>
          <li>Remember: A pair of Jacks or better wins against high cards</li>
        </ul>
      </div>
    </div>
  );
};

export default IntroStudPoker;
