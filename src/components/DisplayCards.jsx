import React, { useState, useRef, useLayoutEffect } from "react";
import { IMG_DECK_BACK } from "../constants/games";
import { MIN_CARD_VISIBLE_SPACE } from "../constants/games";

const DisplayCards = ({ cards, size = 150, type = "revealAll" }) => {
  const displayRef = useRef(null);
  const firstCardRef = useRef(null);
  const [overlap, setOverlap] = useState(0);

  useLayoutEffect(() => {
    let cancelled = false;

    const calc = () => {
      const container = displayRef.current;
      const firstCard = firstCardRef.current;
      if (!container || cards.length === 0) {
        setOverlap(0);
        return;
      }

      // Wait until images have loaded
      const imgs = Array.from(container.querySelectorAll("img"));
      const notLoaded = imgs.filter(
        (img) => !img.complete || img.naturalWidth === 0,
      );
      if (notLoaded.length > 0) {
        const onLoaded = () => {
          if (cancelled) return;
          requestAnimationFrame(calc);
        };
        notLoaded.forEach((img) => img.addEventListener("load", onLoaded));

        const fallback = setTimeout(() => {
          if (!cancelled) requestAnimationFrame(calc);
        }, 300);

        return () => {
          cancelled = true;
          notLoaded.forEach((img) => img.removeEventListener("load", onLoaded));
          clearTimeout(fallback);
        };
      }

      const containerW = container.clientWidth || 0;
      const cardW = firstCard ? firstCard.clientWidth : size;
      const totalWidth = cardW * cards.length;

      // If all cards fit, no overlap needed
      if (totalWidth <= containerW) {
        setOverlap(0);
        return;
      }

      // Calculate overlap to keep minimum visible space per card
      const minVisible = Math.min(
        MIN_CARD_VISIBLE_SPACE,
        Math.floor(cardW * 0.9),
      );
      const maxOverlapPerGap = cardW - minVisible;
      const neededOverlap = Math.ceil(
        (totalWidth - containerW) / (cards.length - 1),
      );
      setOverlap(Math.min(neededOverlap, maxOverlapPerGap));
    };

    calc();
    window.addEventListener("resize", calc);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", calc);
    };
  }, [cards]);

  return (
    <div className="d-flex flex-nowrap" ref={displayRef}>
      {cards.map((card, index) => {
        let isRevealed = null; // default to null for safety
        if (type === "revealAll") {
          isRevealed = true;
        } else if (type === "revealOne") {
          isRevealed = index === cards.length - 1;
        } else if (type === "revealNone") {
          isRevealed = false;
        }

        const src = isRevealed ? card.image : IMG_DECK_BACK;

        return (
          <div
            key={index}
            ref={index === 0 ? firstCardRef : null}
            style={{
              marginLeft: index === 0 ? 0 : `-${overlap}px`,
              zIndex: index,
              flexShrink: 0,
            }}
          >
            <img
              src={src}
              className="img-fluid"
              style={{ width: `${size}px` }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default DisplayCards;
