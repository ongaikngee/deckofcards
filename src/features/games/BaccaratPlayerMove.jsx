import React, { useState } from "react";
import { GAME_STATE, BETS_SETTINGS } from "../../constants/games";
import { formatCurrency } from "../../utils/formatCurrency";

const BaccaratPlayerMove = ({
	gameState,
	betAmount,
	setGameState,
	setBetAmount,
	setBetType,
	isDealing,
}) => {
	const handleBet = (type) => {
		if (isDealing) return;
		setBetType(type);
		setGameState(GAME_STATE.PLAYER_ACTED);
	};

	return (
		<div className="">
			<div className="display-6">Place Your Bet of {formatCurrency(betAmount)}</div>
			<div>Select where you want to place your bet:</div>
			<div className="container">
				<div className="row g-2">
					<div className="col-4">
						<button
							className="btn btn-primary w-100"
							type="button"
							disabled={isDealing}
							onClick={() => handleBet("player")}
						>
							Player
						</button>
					</div>
					<div className="col-4">

						<button
							className="btn btn-success w-100"
							type="button"
							disabled={isDealing}
							onClick={() => handleBet("tie")}
						>
							Tie
						</button>
					</div>
					<div className="col-4">

						<button
							className="btn btn-secondary w-100"
							type="button"
							disabled={isDealing}
							onClick={() => handleBet("banker")}
						>
							Banker
						</button>
					</div>
				</div>
			</div>
			<div className="col-sm-6 mt-3">
				<input
					type="range"
					className="form-range"
					id="betSize"
					min={BETS_SETTINGS.BET_MIN}
					max={BETS_SETTINGS.BET_MAX}
					step={BETS_SETTINGS.BET_STEP}
					value={betAmount}
					disabled={isDealing}
					onChange={(e) => setBetAmount(e.target.valueAsNumber)}
				/>
			</div>
			{isDealing && (
				<div className="text-muted mt-2">Dealing cards... please wait.</div>
			)}
		</div>
	);
};

export default BaccaratPlayerMove;
