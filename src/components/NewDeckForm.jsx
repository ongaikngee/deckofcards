import React from 'react'
import {useState} from 'react'

export const NewDeckForm = ({ addGame }) => {
	const [inputName, setName] = useState("");
	const [inputDeckNumber, setDeckNumber] = useState(1);

	return (
		<>
			{/* Button trigger modal */}
			<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newDeck">
				New Game
			</button>

			{/* Modal */}
			<div className="modal fade" id="newDeck" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">New Game options</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label htmlFor="gameName" className="form-label">Game Name</label>
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
								<label htmlFor="deckNumber" className="form-label">Number of Decks</label>
								<input
									type="number"
									className="form-control"
									id="deckNumber"
									min="1"
									value={inputDeckNumber}
									onChange={(e) => setDeckNumber(parseInt(e.target.value) || 1)}
								/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
							<button type="button"
								onClick={(e) => {
									e.currentTarget.blur(); // Remove focus from the button after click
									addGame({inputName: inputName, inputDeckNumber: inputDeckNumber});
								}} className="btn btn-primary"
								data-bs-dismiss="modal">Save changes</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}


export default NewDeckForm;