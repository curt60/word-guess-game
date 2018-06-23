//declare global variables
var words = ["cylon", "raider", "earth", "kobol"];
var wordIndex;
var currentWord;
var validInputRegEx = /^[a-z]$/i;
var wins = 0;
const MAX_GUESSES = 10;
var guesses;
var matchedLetters;
var guessedLetters;

//bind variables to HTML output elements
var winElement = document.querySelector(".wins");
var wordElement = document.querySelector(".word");
var guessesElement = document.querySelector(".guesses");
var lettersElement = document.querySelector(".letters");

//randomly select a word and reset variables
function selectWord() {
    wordIndex = Math.floor(Math.random() * words.length);
    currentWord = words.slice(wordIndex, wordIndex + 1)[0].toUpperCase();
    words.splice(wordIndex, wordIndex + 1);
    matchedLetters = [];
    guessedLetters = [];
    guesses = MAX_GUESSES;
    displayGuesses();
    displayWins();
    console.log(currentWord);
}

//return the current matched letters to display
function matchedLetterDisplay() {
    var output = ""
    for (let i = 0; i < currentWord.length; i++) {
        if (matchedLetters[i]) {
            output += matchedLetters[i] + " ";
        }
        else {
            output += "_ ";
        }
    }
    console.log("matched letters: " + output);
    wordElement.innerHTML = output;
    return output;
}

//return the guessed letters to display
function guessedLetterDisplay() {
    var output = ""
    for (let i = 0; i < guessedLetters.length; i++) {
        output += guessedLetters[i] + " ";
    }
    console.log("guessed letters: " + output);
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
        guesses--;
        displayGuesses();
        return "match";
    }
    else {
        guessedLetters.push(letter);
        guesses--;
        displayGuesses();
        return "noMatch";
    }
}

//check for complete word matched
function checkSuccess() {
    var success = true;
    for (let i = 0; i < currentWord.length; i++) {
        if (!matchedLetters[i]) success = false;
    }
    return success;
}


//select initial word and initialize variables
selectWord();
wordElement.innerHTML = matchedLetterDisplay();

//listen for key input
document.onkeyup = function() {
    var keyInput = event.key.toUpperCase();

    //check match status
    var matchStatus = checkMatch(keyInput);
    if (matchStatus === "match") {
        wordElement.innerHTML = matchedLetterDisplay();
        if (checkSuccess()) {
            wins++;
            displayWins();
            // alert("You won this round!");
            if (words.length < 1) alert("Game Over");
            else selectWord();
        }
        else if (guesses < 1) {
            alert("You lost this round");
            if (words.length < 1) alert("Game Over");
            else selectWord();
        }
    }
    else if (matchStatus === "noMatch") {
        lettersElement.innerHTML = guessedLetterDisplay();
        if (guesses < 1) {
            alert("You lost this round");
            if (words.length < 1) alert("Game Over");
            else selectWord();
        }
    }
}
