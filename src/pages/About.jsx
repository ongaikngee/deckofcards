import React from "react";

const About = () => {
  return (
    <div className="container my-4">
      <h2>About / How to play</h2>
      <p>
        This app lets you create and manage multiple card game decks. Click
        "Games" to see existing games or create a new one.
      </p>

      <h4>Game flow</h4>
      <ul>
        <li>
          <strong>Create New Game:</strong> Click the <em>New Game</em> button
          to request a new shuffled deck from the API. You'll be taken to the
          game's page where you can draw cards.
        </li>
        <li>
          <strong>Play / Continue:</strong> From the <em>Games</em> list click
          <em>Play</em> on a game to view its current state. Drawn cards are
          retained while the app is running so you can return and continue the
          same game.
        </li>
        <li>
          <strong>Delete:</strong> Use <em>Delete</em> to remove a game from the
          list.
        </li>
      </ul>

      <h4>Notes</h4>
      <p>
        Drawn cards are stored in the application's in-memory state for each
        game object (`gameId` + `drawn` array). They persist while the
        application runs. Refreshing the page will reset the in-memory state.
      </p>
    </div>
  );
};

export default About;
