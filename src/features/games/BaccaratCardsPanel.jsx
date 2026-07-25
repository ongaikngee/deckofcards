import React from 'react'

const BaccaratCardsPanel = ({ gameState }) => {
	return (
		<div className="bg-success bg-opacity-25 p-4 mb-4" >
			<div className="mb-3">{`Game State: ${gameState}`}</div>
			<div className="d-flex justify-content-between">
				<div>
					<h4>Player's Hand</h4>
					<div className="border border-success border-opacity-50 p-2 rounded">
						{/* placeholder for player cards */}
						<div className="text-muted">[Player Cards Placeholder]</div>
					</div>
				</div>
				<div>
					<h4>Banker's Hand</h4>
					<div className="border border-success border-opacity-50 p-2 rounded">
						{/* placeholder for banker cards */}
						<div className="text-muted">[Banker Cards Placeholder]</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BaccaratCardsPanel