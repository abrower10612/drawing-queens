const hearts = [];
const diamonds = [];
const spades = [];
const clubs = [];

const sortOrder = [
    "ACE",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING"
];

/** draw cards and push queen cards onto suit arrays until all 4 queen cards are drawn */
const drawCards = deck_id => {
    fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`)
        .then((result) => {
            console.log("drawing cards");
            return result.json();
        })
        .then((data) => {
            data.cards.forEach((card) => {
                if (card.suit === "HEARTS") hearts.push(card.value);
                if (card.suit === "DIAMONDS") diamonds.push(card.value);
                if (card.suit === "SPADES") spades.push(card.value);
                if (card.suit === "CLUBS") clubs.push(card.value);
            });
        })
        .then(() => {
            if (
                !hearts.includes("QUEEN") ||
                !diamonds.includes("QUEEN") ||
                !spades.includes("QUEEN") ||
                !clubs.includes("QUEEN")
            ) {
                return timeoutPromise().then(() => drawCards(deck_id));
            }

            spades.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            clubs.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            hearts.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            diamonds.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });

            console.log(
                `SPADES: [${spades.toString().replaceAll(",", ", ")}]\n` +
                `CLUBS: [${clubs.toString().replaceAll(",", ", ")}]\n` +
                `HEARTS: [${hearts.toString().replaceAll(",", ", ")}]\n` +
                `DIAMONDS: [${diamonds.toString().replaceAll(",", ", ")}]\n`
            );
        })
        .catch((err) => console.log(err.message));
}

/** delay each network request by 500ms */
const timeoutPromise = async () => {
    return new Promise(resolve => {
        setTimeout(resolve, 500);
    });
}

/** upon page load, fetch a new shuffled deck of cards and call the drawCards function */
fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((result) => { return result.json() })
    .then((deck) => { drawCards(deck.deck_id) })
    .catch((err) => console.log(err.message));