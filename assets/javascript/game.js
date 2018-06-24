//declare global variables
// var words = ["cylon", "raider", "earth", "kobol", "toaster"];
var words = ["cylon", "raider"];
var wordIndex;
var currentWord;
var validInputRegEx = /^[a-z]$/i;
var wins = 0;
const MAX_GUESSES = 10;
var guesses;
var matchedLetters;
var guessedLetters;
var gameState = "new";

//bind variables to HTML output elements
var headerElement = document.querySelector("header");
var mainElement = document.querySelector("main");
var mainInstructionsElement = document.querySelector ("main > .instructions");
var winElement = document.querySelector(".wins");
var wordElement = document.querySelector(".word");
var guessesElement = document.querySelector(".guesses");
var lettersElement = document.querySelector(".letters");
var successElement = document.querySelector(".success-container");
var failureElement = document.querySelector(".failure-container");
var endWordElement = document.querySelectorAll(".end-word");
var gameOverElement = document.querySelector(".game-over-container");
var audioTheme = document.querySelector("audio.theme");
var audioBlaster = document.querySelector("audio.blaster");
var audioRicochet = document.querySelector("audio.ricochet");
var audioFail = document.querySelector("audio.fail");
var audioGameOver = document.querySelector("audio.game-over");

//initialize new round
function initialize() {
    //if all words played, end the game
    if (words.length < 1) {
        gameOverElement.style.opacity = 1;
        audioTheme.pause();
        audioGameOver.play();
        gameState = "game-over";
        return
    }
    //select random word and remove from list of possible words  
    wordIndex = Math.floor(Math.random() * words.length);
    currentWord = words.slice(wordIndex, wordIndex + 1)[0].toUpperCase();
    words.splice(wordIndex, wordIndex + 1);
    //reset variables
    matchedLetters = [];
    guessedLetters = [];
    guesses = MAX_GUESSES;
    //reset display elements
    displayWins();
    displayGuesses();
    displayMatchedLetters();
    displayGuessedLetters();
    headerElement.style.opacity = 1;
    mainElement.style.opacity = 1;
    successElement.style.opacity = 0;
    failureElement.style.opacity = 0;
    endWordElement[0].innerHTML = currentWord;
    endWordElement[1].innerHTML = currentWord;

    //send current word to console (for testing)
    console.log(currentWord);
}

//return the current matched letters to display
function displayMatchedLetters() {
    var output = ""
    for (let i = 0; i < currentWord.length; i++) {
        if (matchedLetters[i]) {
            output += matchedLetters[i] + " ";
        }
        else {
            output += "_ ";
        }
    }
    wordElement.innerHTML = output;
    return output;
}

//return the guessed letters to display
function displayGuessedLetters() {
    var output = ""
    for (let i = 0; i < guessedLetters.length; i++) {
        output += guessedLetters[i] + " ";
    }
    lettersElement.innerHTML = output;
    return output;
}

//display # of wins
function displayWins() {
    winElement.innerHTML = wins;
}

//display guesses remaining
function displayGuesses() {
    guessesElement.innerHTML = guesses;
}

//check letter for possible match and return status
function checkMatch(letter) {
    var match = false;

    //check if input is valid letter
    if (!validInputRegEx.test(letter)) {
        return "invalid";
    }

    //check if letter already in guessedLetter list
    for (let i = 0; i < guessedLetters.length; i++) {
        if (letter === guessedLetters[i]) {
            return "prevLetter";
        }
    }

    //check if letter alredy in matchLetter list
    for (let i = 0; i < matchedLetters.length; i++) {
        if (letter === matchedLetters[i]) {
            return "prevLetter";
        }
    }
    
    //check if letter matches current word
    for (let i = 0; i < currentWord.length; i++) {
        if (letter === currentWord[i]) {
            matchedLetters[i] = letter;
            match = true;
        }
    }
    
    if (match) {
        audioBlaster.play();
        guesses--;
        displayGuesses();
        return "match";
    }
    else {
        audioRicochet.play();
        guessedLetters.push(letter);
        guesses--;
        displayGuesses();
        return "noMatch";
    }
}

//check for complete word matched
function checkSuccess() {
    var successFlag = true;
    for (let i = 0; i < currentWord.length; i++) {
        if (!matchedLetters[i]) successFlag = false;
    }
    return successFlag;
}

function successEvent() {
    wins++;
    displayWins();
    headerElement.style.opacity = 0;
    mainElement.style.opacity = 0;
    successElement.style.opacity = 1;
    gameState = "end-round"
}

function failureEvent() {
    audioFail.play();
    headerElement.style.opacity = 0;
    mainElement.style.opacity = 0;
    failureElement.style.opacity = 1;
    gameState = "end-round"
}

//initialize new round
initialize();

//listen for key input
document.onkeyup = function(event) {
    if (gameState === "new") {
        //play theme music
        audioTheme.volume = .02;
        audioTheme.play();
        gameState = "start";
        mainInstructionsElement.innerHTML = "Choose a letter...";
        return;
    }
    //check if end of round or end of game
    else if (gameState === "end-round") {
        gameState = "new-round";
        initialize();
        return;
    }
    else if (gameState === "game-over") {
        location.reload();
    }

    var keyInput = event.key.toUpperCase();

    //check match status
    var matchStatus = checkMatch(keyInput);
    if (matchStatus === "match") {
        displayMatchedLetters();
        if (checkSuccess()) {
            successEvent();
        }
        else if (guesses < 1) {
            failureEvent();
        }
    }
    else if (matchStatus === "noMatch") {
        displayGuessedLetters();
        if (guesses < 1) {
            failureEvent();
        }
    }
}
