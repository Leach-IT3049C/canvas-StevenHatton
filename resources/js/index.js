// START + DIFFICULTY SELECTION
let startWrapper = document.getElementById(`startWrapper`);
let difficultySelectForm = document.getElementById(`difficultySelect`);
let difficultySelect = document.getElementById(`difficulty`);

// GAME
let gameWrapper = document.getElementById(`gameWrapper`);
let guessesText = document.getElementById(`guesses`);
let wordHolderText = document.getElementById(`wordHolder`);

// GUESSING FORM
let guessForm = document.getElementById(`guessForm`);
let guessInput = document.getElementById(`guessInput`);
let guessSubmitButton = document.getElementById('guessSubmitButton');

// GAME RESET BUTTON
let resetGame = document.getElementById(`resetGame`);

// CANVAS
let canvas = document.getElementById(`hangmanCanvas`);

// The following Try-Catch Block will catch the errors thrown
try {
  // Instantiate a game Object using the Hangman class.
     let game = new Hangman(canvas);
  // add a submit Event Listener for the to the difficultySelectionForm
  //    get the difficulty input
  //    call the game start() method, the callback function should do the following
  //       1. hide the startWrapper
  //       2. show the gameWrapper
  //       3. call the game getWordHolderText and set it to the wordHolderText
  //       4. call the game getGuessessText and set it to the guessesText

  
  difficultySelectForm.addEventListener("submit", function (event) {
    event.preventDefault();
    difficultySelect = document.getElementById(`difficulty`);
    game.start(difficultySelect.value).then(()=>{
      startWrapper.style.display = "none";
      gameWrapper.style.display = "block";
      wordHolderText.innerHTML = game.getWordHolderText();
      guessesText.innerHTML = game.getGuessesText();
    }); 
  });

  

  
  // add a submit Event Listener to the guessForm
  //    get the guess input
  //    call the game guess() method
  //    set the wordHolderText to the game.getHolderText
  //    set the guessesText to the game.getGuessesText
  //    clear the guess input field
  // Given the Guess Function calls either the checkWin or the onWrongGuess methods
  // the value of the isOver and didWin would change after calling the guess() function.
  // Check if the game isOver:
  //      1. disable the guessInput
  //      2. disable the guessButton
  //      3. show the resetGame button
  // if the game is won or lost, show an alert.
  guessForm.addEventListener(`submit`, function (e) {
    e.preventDefault();
    guessInput = document.getElementById(`guessInput`);
    game.guess(guessInput.value);
    wordHolderText.innerHTML = game.getWordHolderText();
    guessesText.innerHTML = game.getGuessesText();
    guessInput.value = "";
    if(game.isOver == true){
      guessSubmitButton.disabled = true;
      guessInput.disabled = true;
      resetGame.style.display = "block";
      if(game.didWin == true){
        alert("Congratulations! You won.");
      } else{
        alert("Game Lost.");
      }
    }
  });

  // add a click Event Listener to the resetGame button
  //    show the startWrapper
  //    hide the gameWrapper
  resetGame.addEventListener(`click`, function (e) {
    gameWrapper.style.display = "none";
    startWrapper.style.display = "block";
    game.guesses = [];
    game.previousGuessedWord = [];
    guessInput.disabled = false;
    guessSubmitButton.disabled = false;
    wordHolderText.innerHTML = "";
    guessesText.innerHTML = "";
    resetGame.style.display = "none";
    game.gameCounter = 0;
    game.wordHolderCounter = 0;
  });
} catch (error) {
  console.error(error);
  alert(error);
}
