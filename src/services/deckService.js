const BASE_URL = "https://deckofcardsapi.com/api/deck/"

export const getNewDeck = async ({noOfDecks = 1, jokersEnabled = true}) => {
    try {
        const response = await fetch(`${BASE_URL}new/shuffle/?deck_count=${noOfDecks}&jokers_enabled=${jokersEnabled}`);
        const data = await response.json()
        data.timestamp = new Date().toISOString();
        return data
    } catch (error) {
        console.error("Error fetching new deck:", error)
        throw error
    }
}

export const drawCardFromDeck = async (deckId, numCount = 1) => {
    try {
        const response = await fetch(`${BASE_URL}${deckId}/draw/?count=${numCount}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error drawing card from deck:", error)
        throw error
    }
}
