export const IMG_DECK_BACK = "https://deckofcardsapi.com/static/img/back.png";

// Minimum visible portion of each card when overlapping (in pixels)
// Change this value to increase/decrease how much of each card remains visible.
export const MIN_CARD_VISIBLE_SPACE = 19; // px — configurable: try 10, 15, 20



export const GAME_STATE = Object.freeze({
	IDLE: "idle",
	LOADING: "loading",
	PLAYER_MOVE: "playerMove",
	PLAYER_BET: "playerBet",
	PLAYER_FOLDS: "playerFolds",
});

export const GAME_RESULT = Object.freeze({
	WINNER_DEALER: "Dealer",
	WINNER_PLAYER: "Player",
	GAME_TIE: "Push",
});