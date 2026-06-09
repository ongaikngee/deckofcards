import { STUD_POKER_HAND, STUD_POKER_PAYOUT } from "../constants/games"

// Takes a poker hand strength object 
// and returns the matching stud poker payout multiplier and hand type based on its rank.
export const determinePlayerPayoutMultiplier = (strength) => {

	let payoutMultiplier = 0
	let pokerHand = null
	switch (strength.rank) {
		case 2:
			payoutMultiplier = STUD_POKER_PAYOUT.ONE_PAIR_OR_LESS
			pokerHand = STUD_POKER_HAND.ONE_PAIR_OR_LESS
			break;
		case 3:
			payoutMultiplier = STUD_POKER_PAYOUT.TWO_PAIRS
			pokerHand = STUD_POKER_HAND.TWO_PAIRS
			break;
		case 4:
			payoutMultiplier = STUD_POKER_PAYOUT.THREE_OF_A_KIND
			pokerHand = STUD_POKER_HAND.THREE_OF_A_KIND
			break;
		case 5:
			payoutMultiplier = STUD_POKER_PAYOUT.STRAIGHT
			pokerHand = STUD_POKER_HAND.STRAIGHT
			break;
		case 6:
			payoutMultiplier = STUD_POKER_PAYOUT.FLUSH
			pokerHand = STUD_POKER_HAND.FLUSH
			break;
		case 7:
			payoutMultiplier = STUD_POKER_PAYOUT.FULL_HOUSE
			pokerHand = STUD_POKER_HAND.FULL_HOUSE
			break;
		case 8:
			payoutMultiplier = STUD_POKER_PAYOUT.FOUR_OF_A_KIND
			pokerHand = STUD_POKER_HAND.FOUR_OF_A_KIND
			break;
		case 9:
			payoutMultiplier = STUD_POKER_PAYOUT.STRAIGHT_FLUSH
			pokerHand = STUD_POKER_HAND.STRAIGHT_FLUSH
			break;
		default:
			payoutMultiplier = 0;

	}
	return { payoutMultiplier, pokerHand }
}