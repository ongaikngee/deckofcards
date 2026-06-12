import React from "react";
import { useState } from "react";

export const NewDeckForm = ({ addGame }) => {
  const [inputName, setName] = useState("");
  const [inputNoOfDecks, setDeckNumber] = useState(1);
  const [inputJokersEnabled, setJokersEnabled] = useState(false);

  return (
    <>
      {/* Button trigger modal */}
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#newDeck"
      >
        New Game
      </button>

      {/* Modal */}
      <div
        className="modal fade"
        id="newDeck"
        tabIndex="-1"
        aria-labelledby="newDeckForm"
        aria-hidden="true"
        onClick={(e) => {
          e.currentTarget.blur()
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="newDeckForm">
                New Game options
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={(e) => {
                  e.currentTarget.blur()
                }}
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="gameName" className="form-label">
                  Game Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="gameName"
                  placeholder="Enter game name"
                  value={inputName}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="deckNumber" className="form-label">
                  Number of Decks
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="deckNumber"
                  min="1"
                  value={inputNoOfDecks}
                  onChange={(e) => setDeckNumber(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="mb-3 form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="flexCheckChecked"
                  checked={inputJokersEnabled}
                  onChange={(e) => setJokersEnabled(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="flexCheckChecked">
                  Required Jokers? (2 per deck)
                </label>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={(e) => {
                    e.currentTarget.blur()
                  }}
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.currentTarget.blur(); // Remove focus from the button after click
                    addGame({
                      inputName: inputName,
                      inputNoOfDecks: inputNoOfDecks,
                      inputJokersEnabled: inputJokersEnabled,
                    });
                  }}
                  className="btn btn-primary"
                  data-bs-dismiss="modal"
                >
                  Play Now!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewDeckForm;
