export const IMG_DECK_BACK = "https://deckofcardsapi.com/static/img/back.png";

// Minimum visible portion of each card when overlapping (in pixels)
// Change this value to increase/decrease how much of each card remains visible.
export const MIN_CARD_VISIBLE_SPACE = 19; // px — configurable: try 10, 15, 20

export const GAME_STATE = Object.freeze({
	IDLE: "idle",
	LOADING: "loading",
	PLAYER_MOVE: "playerMove",
	PLAYER_ACTED: "playerActed",
	DETERMINE_WINNER: "determineWinner",
	// PLAYER_BET: "playerBet",
	// PLAYER_FOLDS: "playerFolds",
});

export const PLAYER_ACTION = Object.freeze({
	BET: "bet",
	FOLD: "fold",
});

export const GAME_RESULT = Object.freeze({
	WINNER_DEALER: "Dealer",
	WINNER_PLAYER: "Player",
	GAME_TIE: "Push",
});

export const STUD_POKER_PAYOUT = Object.freeze({
	ROYAL_FLUSH: 250,
	STRAIGHT_FLUSH: 50,
	FOUR_OF_A_KIND: 20,
	FULL_HOUSE: 7,
	STRAIGHT: 4,
	THREE_OF_A_KIND: 3,
	TWO_PAIRS: 2,
	ONE_PAIR_OR_LESS:1,
})