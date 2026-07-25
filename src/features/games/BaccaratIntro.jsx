import React from 'react'
import { GAME_STATE } from '../../constants/games'

const IntroBaccarat = ({ setGameState }) => {
  return (
    <div className="my-4">
      {/* Introduction */}
      <div className="mb-4">
        <h4 className="mb-3">How to Play Baccarat</h4>

        <p className="text-muted">
          Baccarat is one of the world's most popular casino card games, known
          for its simple rules and fast-paced gameplay. Unlike poker, players
          do not compete against each other or make strategic decisions during
          each hand. Instead, you simply predict which hand will have a total
          closest to 9: the Player, the Banker, or whether the hand will end in
          a Tie. Once all bets are placed, the cards are dealt automatically
          according to fixed drawing rules, making Baccarat a game of chance
          rather than skill.
        </p>

        <div className='text-muted'>
          Each hand begins with two cards dealt to both the Player and the Banker.
          Card values are straightforward: Aces are worth 1, cards 2–9 are worth
          their face value, and 10s, Jacks, Queens, and Kings are worth 0. If the
          total exceeds 9, only the last digit counts—for example, a total of 15
          becomes 5, while 18 becomes 8. In some situations, a third card is drawn
          based on predetermined rules. After all cards have been dealt, the hand
          with the total closest to 9 wins. A winning Banker bet typically pays 1:1
          minus a small commission, a winning Player bet pays 1:1, and a Tie usually
          offers a higher payout but occurs much less frequently.
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
