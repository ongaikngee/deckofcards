import React from 'react'
import { GAME_STATE } from '../../constants/games'

const IntroBaccarat = ({ setGameState }) => {
  return (
    <div className="my-4">
      {/* Introduction */}
      <div className="mb-4">
        <h4 className="mb-3">How to Play Baccarat</h4>

        <p className="text-muted">
          Baccarat is a casino card game built around simple dealing rules and
          a fast reveal. Players place a bet on whether the Player hand, the
          Banker hand, or a Tie will win. After betting, cards are dealt
          automatically by the app, and the final hand closest to 9 wins.
        </p>

        <div className="text-muted mb-3">
          <strong>Card values:</strong> Ace = 1, cards 2–9 = face value, 10/J/Q/K = 0.
          Hand totals only count the rightmost digit of the sum, so 14 becomes 4
          and 19 becomes 9.
        </div>

        <div className="text-muted mb-3">
          Each round starts with two cards for the Player and two cards for the Banker.
          A third card may be drawn according to the following rules:
        </div>

        <ul className="text-muted">
          <li>
            If either the Player or Banker has a total of 8 or 9 after the first two
            cards, this is called a natural and no third card is drawn.
          </li>
          <li>
            The Player draws a third card when the Player total is 0–5, and stands on
            6 or 7.
          </li>
          <li>
            The Banker draws a third card based on the Banker total and the Player’s
            third card:
            <ul>
              <li>Banker total 0–2: always draws.</li>
              <li>Banker total 3: draws unless the Player’s third card is 8.</li>
              <li>Banker total 4: draws if the Player’s third card is 2–7.</li>
              <li>Banker total 5: draws if the Player’s third card is 4–7.</li>
              <li>Banker total 6: draws if the Player’s third card is 6 or 7.</li>
              <li>Banker total 7: stands.</li>
            </ul>
          </li>
          <li>
            If the Player does not draw, the Banker draws only when the Banker total
            is 0–5.
          </li>
        </ul>

        <div className="text-muted">
          After dealing, the hand closest to 9 wins. Player bets pay 1:1, Banker bets
          typically pay 1:1 minus commission, and Tie bets pay a larger reward.
        </div>
        <div>
          <button
            type='button'
            className='btn btn-primary my-4'
            onClick={() => setGameState(GAME_STATE.PLAYER_MOVE)}
          >
            Begin game
          </button>
        </div>
      </div>
    </div>
  )
}

export default IntroBaccarat
