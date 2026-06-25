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
});

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
});

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
});

// Detailed hand definitions used by the UI (descriptions, example card codes, and payout key)
export const STUD_POKER_HANDS = [
  {
    payoutKey: "ROYAL_FLUSH",
    name: STUD_POKER_HAND.ROYAL_FLUSH,
    description: "A-K-Q-J-10 of the same suit",
    cardCodes: ["AS", "KS", "QS", "JS", "0S"],
  },
  {
    payoutKey: "STRAIGHT_FLUSH",
    name: STUD_POKER_HAND.STRAIGHT_FLUSH,
    description: "Five consecutive cards of the same suit",
    cardCodes: ["9H", "8H", "7H", "6H", "5H"],
  },
  {
    payoutKey: "FOUR_OF_A_KIND",
    name: STUD_POKER_HAND.FOUR_OF_A_KIND,
    description: "Four cards of the same rank",
    cardCodes: ["KC", "KD", "KH", "KS", "2C"],
  },
  {
    payoutKey: "FULL_HOUSE",
    name: STUD_POKER_HAND.FULL_HOUSE,
    description: "Three of a kind + a pair",
    cardCodes: ["QD", "QH", "QC", "3S", "3D"],
  },
  {
    payoutKey: "FLUSH",
    name: STUD_POKER_HAND.FLUSH,
    description: "Five cards of the same suit",
    cardCodes: ["2C", "5C", "7C", "9C", "JC"],
  },
  {
    payoutKey: "STRAIGHT",
    name: STUD_POKER_HAND.STRAIGHT,
    description: "Five consecutive cards of different suits",
    cardCodes: ["6S", "5H", "4D", "3C", "2S"],
  },
  {
    payoutKey: "THREE_OF_A_KIND",
    name: STUD_POKER_HAND.THREE_OF_A_KIND,
    description: "Three cards of the same rank",
    cardCodes: ["JH", "JD", "JC", "4S", "8H"],
  },
  {
    payoutKey: "TWO_PAIRS",
    name: STUD_POKER_HAND.TWO_PAIRS,
    description: "Two different pairs",
    cardCodes: ["9S", "9D", "5H", "5C", "2D"],
  },
  {
    payoutKey: "ONE_PAIR_OR_LESS",
    name: STUD_POKER_HAND.ONE_PAIR_OR_LESS,
    description: "Two cards of the same rank (Jacks or better)",
    cardCodes: ["AH", "AD", "3C", "7S", "0D"],
  },
];

export const CHIP_UPDATE_REASON = Object.freeze({
  TOPUP: "Topup",
  LOTTERY: "Lottery",
  JACKPOT: "Jackpot",
  PAYOUT: "Payout",
  LOSS: "Loss",
  BET: "Bet",
  ANTE: "Ante",
});
