export const IMG_DECK_BACK = "https://deckofcardsapi.com/static/img/back.png";

// Minimum visible portion of each card when overlapping (in pixels)
// Change this value to increase/decrease how much of each card remains visible.
export const MIN_CARD_VISIBLE_SPACE = 19; // px — configurable: try 10, 15, 20

export const BETS_SETTINGS = Object.freeze({
	INITIAL_CHIPS: 1000,
	DEFAULT_BET: 50,
	BET_MIN: 25,
	BET_MAX: 500,
	BET_STEP: 25,
})

export const GAME_STATE = Object.freeze({
	IDLE: "idle",
	LOADING: "loading",
	PLAYER_MOVE: "playerMove",
	PLAYER_ACTED: "playerActed",
	DETERMINE_WINNER: "determineWinner",
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
	FLUSH: 5,
	STRAIGHT: 4,
	THREE_OF_A_KIND: 3,
	TWO_PAIRS: 2,
	ONE_PAIR_OR_LESS: 1,
})

export const STUD_POKER_HAND = Object.freeze({
	ROYAL_FLUSH: "Royal Flush",
	STRAIGHT_FLUSH: "Straight Flush",
	FOUR_OF_A_KIND: "Four of a Kind",
	FULL_HOUSE: "Full House",
	FLUSH: "Flush",
	STRAIGHT: "Straight",
	THREE_OF_A_KIND: "Three of a Kind",
	TWO_PAIRS: "Two Pair",
	ONE_PAIR_OR_LESS: "One Pair or less",
})

export const CHIP_UPDATE_REASON = Object.freeze({
	TOPUP = "Topup",
    LOTTERY = "Lottery",
    JACKPOT = "Jackpot",
    PAYOUT = "Payout",
    LOSS = "Loss",
})
