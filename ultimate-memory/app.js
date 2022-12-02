// Här skapar vi referenser till alla element i startmenyn
const startBtn = document.querySelector(".start-btn");
const backBtn = document.querySelector(".back-btn");
const startGameBtn = document.querySelector(".start-game-btn");
const startMenu = document.querySelector(".start-menu");
const playerMenu = document.querySelector(".player-menu");
const gameDisplay = document.querySelector(".game-display");
const firstPlayerName = document.querySelector(".first-player-name");
const secondPlayerName = document.querySelector(".second-player-name");
const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");

// Här skapas ett objekt som samlar alla viktiga variablar som används i spelet

const gameState = {
  gameStarted: false,
  cardsFlipped: 0, // cardsFlipped håller koll på om man användaren tar sitt första eller sitt andra kort
  playerTurn: 0, // playerTurn växlar mellan 0 och 1, 0 är playerOne och 1 är playerTwo.
  playerOneScore: 0,
  playerTwoScore: 0,
  currentlyFlipped: false,

  playerOneName: "Spelare 1",
  playerTwoName: "Spelare 2",

  history: "",
};

/*
Dom här tre funktionerna nedan triggas av knapparna i startmenyn, vi ändrar bara visibility på menyerna
för att kunna gå fram och tillbaka.
 */

const startClick = () => {
  startMenu.style.visibility = "hidden";
  playerMenu.style.visibility = "visible";
};

startBtn.addEventListener("click", startClick);

const backClick = () => {
  startMenu.style.visibility = "visible";
  gameDisplay.style.visibility = "hidden";
  playerMenu.style.visibility = "hidden";
};

backBtn.addEventListener("click", backClick);

// Det här är sista knappen som drar igång spelet

const startGameClick = () => {
  playerMenu.style.visibility = "hidden";
  gameDisplay.style.visibility = "visible";

  gameState.playerOneName = player1.value;
  gameState.playerTwoName = player2.value;

  console.log(gameState.playerOneName);

  // HÄR STARTAR SPEL LOGIKEN
  createCards();
};

startGameBtn.addEventListener("click", startGameClick);

/*
Hela spellogiken här nere 
*/

// Börjar med att göra lite referenser till olika containers

const cardContainer = document.querySelector(".card-container");
const playerTurnText = document.querySelector(".player-turn-text");
const playerOneScoreText = document.querySelector(".player-one-score");
const playerTwoScoreText = document.querySelector(".player-two-score");
const playerOneNameLabel = document.querySelector(".player-one-name-label");
const playerTwoNameLabel = document.querySelector(".player-two-name-label");
const winnerText = document.querySelector(".winner-text");
const resultLabel = document.querySelector(".result-label");
const historyContainer = document.querySelector(".history");

let firstCard, secondCard, firstCardSymbol, secondCardSymbol;

// Här skapar vi en array med symboler, det är dom här symbolerna som blir på korten.
let symbols = [
  "✨",
  "❤️",
  "🎄",
  "😂",
  "🔥",
  "🎅",
  "💀",
  "🎉",
  "🥳",
  "❄️",
  "👀",
  "🎁",
];
// Duplicera hela arrayen så man får 2 av varje (det ska ju vara 2 kort)
symbols.forEach((e) => symbols.push(e));

// Här slumpar vi arrayen med korten så dom hamnar på olika platser, detta körs varje gång spelet startar eller startas om.
function randomizeSymbolArray(array) {
  // Tar varje item i arrayen och stoppar in det på en random plats.
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function createCards() {
  //Börja med att ta bort befintliga kort och resetta alla poäng så det börjar från början.
  deleteAllCards();
  gameState.history = ""; // Detta tar bort historiken för alla drag som gjorts
  // symbols = randomizeSymbolArray(symbols); // Randomizar arrayen...
  /* resettar score */
  gameState.playerOneScore = 0;
  gameState.playerTwoScore = 0;
  gameState.cardsFlipped = 0;

  winnerText.style.display = "none"; // Döljer texten som visas i slutet när man vinner
  playerTurnText.style.display = "block"; // Gör playerTurn texten synlig, (den blir dold när matchen är över)
  updateGraphics();

  // Nu börjar kortet skapas
  // Här loopar vi igenom våran symbol array och skapar upp en div med en bak och framsida med alla klasserna som behövs
  for (let i = 0; i < symbols.length; i++) {
    card = document.createElement("div");

    front = document.createElement("div");
    back = document.createElement("div");
    front.classList.add("front");
    back.classList.add("back");

    back.innerText = symbols[i]; // Här sätter vi symbolen på kortet
    card.classList.add("card");

    cardContainer.append(card); // Här sätts kortet ut i DOMen
    card.append(front, back);

    card.addEventListener("click", (e) => {
      // Här lägger vi på en EventListener på varje kort så vi kan ta emot klick eventet, alltså vad som ska hända när man trycker på kortet
      flipCard(e, symbols[i]); // dvs denna funktion körs när man trycker på varje kort.
      // Attributen e, är själva kortobjektet som blir tryckt på, attributen symbols[i] är enbart symbolen/emojin.
      // Kortobjektet (e) tar vi med för då kan vi manipulera det senare i koden, alltså lägga på flip klassen osv.
    });
  }
}

function addPoint() {
  //Här kollar vi vilkens spelare tur det var och ger sedan poäng till rätt spelare
  if (gameState.playerTurn == 0) {
    gameState.playerOneScore += 1;
  } else if (gameState.playerTurn == 1) {
    gameState.playerTwoScore += 1;
  }
}

function updateGraphics() {
  // Denna funktion körs rätt ofta och används för att uppdatera DOMen när poäng, speltur och historik ändras.
  if (gameState.playerTurn == 0) {
    playerTurnText.innerText = gameState.playerOneName + "'s tur";
  } else {
    playerTurnText.innerText = gameState.playerTwoName + "'s tur";
  }
  playerOneNameLabel.innerText = gameState.playerOneName + ": ";
  playerTwoNameLabel.innerText = gameState.playerTwoName + ": ";
  playerOneScoreText.innerText = gameState.playerOneScore;
  playerTwoScoreText.innerText = gameState.playerTwoScore;
  historyContainer.innerHTML = gameState.history;
}

function updateHistory() {
  // Här uppdateras historiken, detta körs bara om någon har tagit 2 matchande kort.
  // Först kollar vi vilken spelares tur det är och sen lägger vi till text i historyContainer som säger att spelaren har hittat ett par
  if (gameState.playerTurn == 0) {
    // Spelare 1
    gameState.history +=
      "<p> " +
      gameState.playerOneName +
      " hittade " +
      firstCardSymbol +
      " </p>";
    historyContainer.innerHTML = gameState.history;
  } else {
    // Spelare 2...
    gameState.history +=
      "<p> " +
      gameState.playerTwoName +
      " hittade " +
      firstCardSymbol +
      " </p>";
    historyContainer.innerHTML = gameState.history;
  }

  console.log(history);
}

// Exit knappen inne i spelet
function exit() {
  createCards(); // Resettar alla poäng och kort

  startMenu.style.visibility = "visible";
  gameDisplay.style.visibility = "hidden"; // Tar en tillbaka till start menyn, döljer själva spelplanen
  playerMenu.style.visibility = "hidden";
}

// Här kollar vi om de 2 korten som plockats upp matchar!
function checkIfCardsMatch() {
  if (firstCardSymbol == secondCardSymbol) {
    //Detta körs om båda korten matchar varandra

    console.log("Korten matchade!");
    addPoint(); // Ge poäng till rätt spelaren
    updateGraphics(); // Updatera grafiken så poängen som visas stämmer
    updateHistory(); // Uppdatera historiken på sidan
    firstCard.classList.add("correct"); // Här ger vi båda korten klassen "correct" som gör korten gröna
    secondCard.classList.add("correct");
    setTimeout(() => {
      // Efter en sekund så läggs klass "hide" på korten, då försvinner dom. Korten tas inte bort helt utan dom blir bara osynliga.
      firstCard.classList.add("hide");
      secondCard.classList.add("hide");
      checkIfGameEnded(); // Kolla sedan om det var dom sista korten så matchen kan ta slut.
    }, 1000);
  } else {
    // Detta körs om korten inte matchade varandra
    console.log("Korten matchade inte");
    gameState.playerTurn = 1 - gameState.playerTurn; // Ändrar till andra spelarens tur
    updateGraphics(); //uppdatera grafiken
  }
}

// Här kollar vi bara hur många kort som finns kvar på bordet, ger tillbaka ett nummer.
function checkCardsLeft() {
  let cardsLeft = 0;
  let allCards = document.querySelectorAll(".card");
  for (let i = 0; i < allCards.length; i++) {
    // Loopar igenom alla kort
    if (!allCards[i].classList.contains("hide")) {
      cardsLeft += 1;
    }
  }
  return cardsLeft;
}

// Här kollar vi om matchen har tagit slut, körs varje gång nån tar upp matchande kort.
function checkIfGameEnded() {
  const playerNameLabel = document.querySelector(".player-name-label");
  if (checkCardsLeft() == 0) {
    // Kolla om det är 0 kort kvar, om det är 0 kort kvar så har matchen tagit slut
    if (gameState.playerOneScore > gameState.playerTwoScore) {
      //Spelare ett vann
      playerNameLabel.innerText = gameState.playerOneName;
      resultLabel.innerText = " vann!🎉";
    } else if (gameState.playerTwoScore > gameState.playerOneScore) {
      //Spelare två vann
      playerNameLabel.innerText = gameState.playerTwoName;
      resultLabel.innerText = " vann!🎉";
    } else {
      // Båda fick lika mycket poäng
      playerNameLabel.innerText = "";
      resultLabel.innerHTML = "Oavgjort!";
      console.log("Tie!");
    }
    // Ta sedan bort alla kort så vi kan skapa nya på nya platser.
    deleteAllCards();
    winnerText.style.display = "block"; // Gör vinnar texten synlig
    playerTurnText.innerText = ""; // Döljer speltur texten
  }
}

// Denna funktion loopar igenom alla kort och tar sedan bort dom helt.
function deleteAllCards() {
  let allCards = document.querySelectorAll(".card");
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].remove();
  }
}

function flipBackCards() {
  // Vänd tillbaka alla kort med klassen flip
  let allFlippedCards = document.querySelectorAll(".flip");
  allFlippedCards.forEach((card) => card.classList.toggle("flip"));
  gameState.currentlyFlipped = false; // Denna blir till false när alla kort är tillbaka vända, används i if-satsen i flipCard nedan.
}

function flipCard(card, symbol) {
  if (
    !gameState.currentlyFlipped &&
    !card.currentTarget.classList.contains("hide")
  ) {
    //If-sats som förhindrar spelaren att öppna flera kort medans 2 redan är vända, eller öppna ett kort som redan har blivit hittat.
    card = card.currentTarget;
    card.classList.add("flip"); //Lägger till styling-classen flip på kortet som tryckts på

    if (gameState.cardsFlipped == 0) {
      // Detta körs för första kortet
      //Körs när första kortet väljs.

      firstCard = card;
      firstCardSymbol = symbol;
      gameState.cardsFlipped += 1; // Nu har ett kort vänts, då ökar vi cardsFlipped med 1, så nästa gång vi trycker på ett kort så kommer det bli secondCard.
    } else if (card != firstCard) {
      // Detta körs för andra kortet som väljs, kollar så man inte tryckt på samma kort som första.

      secondCard = card;
      secondCardSymbol = symbol;
      gameState.cardsFlipped = 0; // Nu har vi valt 2 kort, då sätter vi cardsflipped till 0 igen och börjar om.

      checkIfCardsMatch(); // Kolla om korten matchar!!

      //Flippa tillbaka alla kort så dom vänds tillbaka
      gameState.currentlyFlipped = true; // currentlyFlipped blir till true och förhindrar spelaren att ta flera kort tills dom som vänts har blivit tillbaka vända.
      setTimeout(flipBackCards, 1000); // Vänta en sekund med att flippa tillbaka korten, så spelaren hinner se vilka kort dom tryckt på.
    }
  }
}
