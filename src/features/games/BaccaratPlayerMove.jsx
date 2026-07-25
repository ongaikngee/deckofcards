import React, { useState } from 'react'
import { GAME_STATE, BETS_SETTINGS } from '../../constants/games'

const BaccaratPlayerMove = ({ gameState, betAmount, setGameState, setBetAmount, setBetType }) => {
	return (
		<div className="my-4">
			<div className="mb-4">Game state: {gameState}</div>
			<h3>Place Your Bet</h3>
			<p>Select where you want to place your bet:</p>
			<button className="btn btn-primary me-2" onClick={() => {
				setBetType("player")
				setGameState(GAME_STATE.PLAYER_ACTED)
			}}>Bet on Player</button>
			<button className="btn btn-secondary me-2" onClick={() => {
				setBetType("banker")
				setGameState(GAME_STATE.PLAYER_ACTED)
			}}>Bet on Banker</button>
			<button className="btn btn-success" onClick={() => {
				setBetType("tie")
				setGameState(GAME_STATE.PLAYER_ACTED)
			}}>Bet on Tie</button>
			<div className="col-sm-6 mt-3">
				<input
					type="range"
					className="form-range"
					id="betSize"
					min={BETS_SETTINGS.BET_MIN}
					max={BETS_SETTINGS.BET_MAX}
					step={BETS_SETTINGS.BET_STEP}
					value={betAmount}
					onChange={(e) => setBetAmount(e.target.valueAsNumber)}
				></input>
			</div>
		</div>
	)
}

export default BaccaratPlayerMove