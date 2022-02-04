const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const hearts = [];
const diamonds = [];
const spades = [];
const clubs = [];
let queenCount = 0;

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
    document.getElementById("alert").innerHTML = "Drawing cards...";
    startBtn.style.display = "none";
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
                if (card.value === "QUEEN") queenCount++;
            });
        })
        .then(() => {
            if (queenCount < 4) {
                return timeoutPromise().then(() => drawCards(deck_id));
            }

            spades.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            clubs.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            hearts.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });
            diamonds.sort((left, right) => { return sortOrder.indexOf(left) - sortOrder.indexOf(right); });

            console.log(
                `SPADES: [${spades.toString().replaceAll(",", ", ")}]\n` +
                `CLUBS: [${clubs.toString().replaceAll(",", ", ")}]\n` +
                `DIAMONDS: [${diamonds.toString().replaceAll(",", ", ")}]\n` +
                `HEARTS: [${hearts.toString().replaceAll(",", ", ")}]\n`
            );

            document.getElementById("spades").innerHTML = `SPADES: [${spades.toString().replaceAll(",", ", ")}]`
            document.getElementById("clubs").innerHTML = `CLUBS: [${clubs.toString().replaceAll(",", ", ")}]`
            document.getElementById("diamonds").innerHTML = `DIAMONDS: [${diamonds.toString().replaceAll(",", ", ")}]`
            document.getElementById("hearts").innerHTML = `HEARTS: [${hearts.toString().replaceAll(",", ", ")}]`
            document.getElementById('alert').innerHTML = "All Queen cards have now been drawn."
            startBtn.innerHTML = "Start"
            startBtn.style.display = "none"
            resetBtn.style.display = "flex";
        })
        .catch((err) => console.log(err.message));
}

function reset() {
    hearts.length = 0;
    diamonds.length = 0;
    spades.length = 0;
    clubs.length = 0;
    queenCount = 0;
    resetBtn.style.display = "none";
    startBtn.style.display = "flex";

    document.getElementById("spades").innerHTML = '';
    document.getElementById("clubs").innerHTML ='';
    document.getElementById("diamonds").innerHTML = '';
    document.getElementById("hearts").innerHTML = '';
    document.getElementById('alert').innerHTML = '';
}

/** delay each network request by 500ms */
const timeoutPromise = async () => {
    return new Promise(resolve => {
        setTimeout(resolve, 500);
    });
}

/** once start button is pressed, fetch a new shuffled deck of cards and call the drawCards function */
function start() {
    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
        .then((result) => { return result.json() })
        .then((deck) => { drawCards(deck.deck_id) })
        .catch((err) => console.log(err.message));
}