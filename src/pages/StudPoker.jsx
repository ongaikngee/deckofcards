import React from "react";
import { useState } from "react";

const StudPoker = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [deck, setDeck] = useState();

  const startGame = () => {
    setIsLoading(true);
    console.log("Getting Deck");
    setIsActive(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 5000);
  };

  return (
    <div className="container my-4">
      <h2>Stud Poker</h2>
      {!isActive ? (
        <div className="container">
          <button type="button" className="btn btn-primary" onClick={startGame}>
            Start Game
          </button>
        </div>
      ) : (
        <div className="container">
          {isLoading ? (
            <div className="container">
              <div class="spinner-grow" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="container">
              <h2>Start</h2>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudPoker;
