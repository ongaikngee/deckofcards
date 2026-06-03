import React from "react";
import { IMG_DECK_BACK } from "../constants/games";

const DisplayCards = ({ cards, size = 150, type = "standard" }) => {
  return (
    <div className="d-flex gap-2">
      {cards.map((card, index) => {
        const isRevealed = type !== "revealOne" || index === cards.length - 1;

        const src = isRevealed ? card.image : IMG_DECK_BACK;

        return (
          <img
            key={card.code || index}
            src={src}
            className="img-fluid"
            style={{ maxHeight: `${size}px` }}
          />
        );
      })}
    </div>
  );
};

export default DisplayCards;
