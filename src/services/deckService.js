const BASE_URL = "https://deckofcardsapi.com/api/deck/"

export const getNewDeck = async (count = 1) => {
    try {
        const response = await fetch(`${BASE_URL}new/shuffle/?deck_count=${count}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error fetching new deck:", error)
        throw error
    }
}

export const drawCardFromDeck = async (deckId, count = 1) => {
    try {
        const response = await fetch(`${BASE_URL}${deckId}/draw/?count=${count}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.error("Error drawing card from deck:", error)
        throw error
    }
}
