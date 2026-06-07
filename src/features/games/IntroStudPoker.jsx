import React from "react";

const IntroStudPoker = () => {
  return (
    <div className="my-3">
      <p>
        Stud Poker is a head-to-head card game between you and the dealer. Each
        player is dealt a five-card hand from a single shuffled deck. You cannot
        swap or draw new cards — your hand is final once dealt.
      </p>

      <p>
        The dealer keeps most of their cards hidden until the reveal. After
        reviewing your hand, you can choose to Ante (bet) or Fold. The winner is
        decided using standard poker hand rankings like pairs, straights,
        flushes, and full houses.
      </p>

      <p>If both hands have equal strength, the round ends in a push.</p>
    </div>
  );
};

export default IntroStudPoker;
