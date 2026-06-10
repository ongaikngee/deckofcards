import React from 'react'
import DisplayCards from '../../components/DisplayCards'

// helpers
import { GAME_RESULT, PLAYER_ACTION } from '../../constants/games'
import { formatCurrency } from '../../utils/formatCurrency';

// 3rd party libraries
import { CheckIcon } from "@phosphor-icons/react";


export const StudPokerHistory = ({ SPGames }) => {

	if (!SPGames || SPGames.length === 0) {
		return (
			<div className="container my-4">
				<h2>No Games History</h2>
				<p>Start playing games by clicking on the button above. Good Luck!</p>
			</div>
		)
	}
	return (
		<div>
			<h2>Games's History</h2>
			<table className="table">
				<thead>
					<tr>
						<th scope="col" className='w-50 h5'>Player's hand</th>
						<th scope="col" className='w-50 h5'>Dealer's hand</th>
					</tr>
				</thead>
				<tbody>
					{SPGames.map((game, index) => (
						<tr key={index}
							className={`container ${game.winner === GAME_RESULT.WINNER_PLAYER ? "table-primary" : "table-danger"}`}
						>
							<td>
								<div>
									<div className='h6'>Bet Amount: {formatCurrency(game.betAmount)}</div>
									<DisplayCards cards={game.playerHand} size={77} />
									<div className="d-flex flex-wrap align-items-center gap-2">
										{game.winner === GAME_RESULT.WINNER_PLAYER && (
											<CheckIcon size={20} weight="bold" className="text-success" />
										)}
										<div>{game.playerStrength.descr}</div>
										{game.playerAction === PLAYER_ACTION.FOLD &&
											<span className="badge text-bg-danger">Fold</span>}
									</div>
									<div className="d-flex flex-wrap align-items-center gap-2 mt-1">
										{game.payoutAmt !== 0 && (
											<span
												className={`badge ${game.payoutAmt > 0 ? 'text-bg-success' : 'text-bg-danger'
													}`}
											>
												{formatCurrency(game.payoutAmt)}
											</span>
										)}
										{game.winningMultiplier && (
											<span className="badge text-bg-warning">{game.winningMultiplier}x - {game.winningPokerHandClass}</span>
										)}
									</div>
								</div>
							</td>
							<td>
								<div>
									<div className='h6'>{<>&nbsp;</>}</div>
									<DisplayCards cards={game.dealerHand} size={77} />
									<div className="d-flex flex-wrap align-items-center gap-2 row-gap-1">
										{game.winner === GAME_RESULT.WINNER_DEALER && (
											<CheckIcon size={20} weight="bold" className="text-success" />
										)}
										<div>{game.dealerStrength.descr}</div>
										{game.playerAction === "Did not qualified" &&
											<span className="badge text-bg-danger">Did not qualified</span>}
									</div>
								</div>
							</td>
						</tr>

					))}
				</tbody>
			</table>
		</div>
	)
}

export default StudPokerHistory