class Hangman {
  constructor(_canvas) {
    if (!_canvas) {
      throw new Error(`invalid canvas provided`);
    }
    this.finalWord = "";
    this.wordHolderCounter = 0;
    this.gameCounter = 0;
    this.previousGuessedWord = new Array();
    this.guesses = new Array();
    this.canvas = _canvas;
    this.ctx = this.canvas.getContext(`2d`);
  }

  /**
   * This function takes a difficulty string as a patameter
   * would use the Fetch API to get a random word from the Hangman
   * To get an easy word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=easy
   * To get an medium word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=medium
   * To get an hard word: https://hangman-micro-service-bpblrjerwh.now.sh?difficulty=hard
   * The results is a json object that looks like this:
   *    { word: "book" }
   * */
   async getRandomWord(difficulty) {
    // return await fetch(
    //   `https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`
    // )
    //   .then(r => r.json())
    //   .then(r => r.word);
    try {
      const request = await fetch(`https://hangman-micro-service.herokuapp.com/?difficulty=${difficulty}`);
      const response = await request.json();
      return response.word;
    } 
    catch{
      console.error(error);
      alert(error);
    }
  }

  /**
   *
   * @param {string} difficulty a difficulty string to be passed to the getRandomWord Function
   * @param {function} next callback function to be called after a word is reveived from the API.
   */
  async start(difficulty) {
    // get word and set it to the class's this.word
    // clear canvas
    // draw base
    // reset this.guesses to empty array
    // reset this.isOver to false
    // reset this.didWin to false
    const randomWord = await this.getRandomWord(difficulty);
    this.word = randomWord;
    this.clearCanvas();
    this.drawBase();
    this.isOver = false;
    this.didWin = false;
    return;
  }

  /**
   *
   * @param {string} letter the guessed letter.
   */
  guess(letter) {
    // Check if nothing was provided and throw an error if so
    // Check for invalid cases (numbers, symbols, ...) throw an error if it is
    // Check if more than one letter was provided. throw an error if it is.
    // if it's a letter, convert it to lower case for consistency.
    // check if this.guesses includes the letter. Throw an error if it has been guessed already.
    // add the new letter to the guesses array.
    // check if the word includes the guessed letter:
    //    if it's is call checkWin()
    //    if it's not call onWrongGuess()
    var checkCase = /^[A-Za-z]+$/;
    try{
      if(letter.length == 0){
        throw new Error("Please provide a letter.");
      } else if (!(letter.match(checkCase))){
        throw new Error("Guess should be a letter.");
      } else if (letter.length > 1){
        throw new Error("Please provide one letter.");
      } else {
        letter = letter.toLowerCase();
        if(this.guesses.includes(letter)){
          throw new Error ("Letter already exists, please provide a new one.");
        } else {
          this.guesses.push(letter);
        }
        if(this.word.includes(letter)){
          this.checkWin();
        } else{
          this.onWrongGuess();
        }
      }
    }
    catch (error){
      // console.error(error);
      alert(error);
    }
  }

  checkWin() {
    // using the word and the guesses array, figure out how many remaining unknowns.
    // if zero, set both didWin, and isOver to true
    const guessedWord = this.getWordHolderText();
    if(guessedWord === this.word){
      this.didWin = true;
      this.isOver = true;
    }
  }

  /**
   * Based on the number of wrong guesses, this function would determine and call the appropriate drawing function
   * drawHead, drawBody, drawRightArm, drawLeftArm, drawRightLeg, or drawLeftLeg.
   * if the number wrong guesses is 6, then also set isOver to true and didWin to false.
   */
  onWrongGuess() {
    
    this.gameCounter++;       
    if(this.gameCounter == 1){
      this.drawHead();
    } else if(this.gameCounter == 2){
      this.drawBody();
    } else if (this.gameCounter == 3){
      this.drawLeftArm();
    } else if(this.gameCounter == 4){
      this.drawRightArm();
    } else if(this.gameCounter == 5){
      this.drawLeftLeg();
    } else if (this.gameCounter == 6){
      this.drawRightLeg();
      this.isOver = true;
      this.didWin = false;
    }
  }

  /**
   * This function will return a string of the word placeholder
   * It will have underscores in the correct number and places of the unguessed letters.
   * i.e.: if the word is BOOK, and the letter O has been guessed, this would return _ O O _
   */
  getWordHolderText() {
    
    let wordHolder = "";
    var checkCase = /^[A-Za-z]+$/;
    for (let i = 0; i < this.word.length; i++){
      if(this.word[i] == this.guesses[this.guesses.length -1]){
        wordHolder += this.word[i];
      }
      else{
        wordHolder += "_";
      }
    }

    if(this.wordHolderCounter == 0){
      this.previousGuessedWord.push(wordHolder);
      this.wordHolderCounter++;
    }

    let previousGuessed = this.previousGuessedWord[this.previousGuessedWord.length - 1].split("");
    let i = 0;
    while(i < this.word.length){
      if(previousGuessed[i] == "_" && wordHolder[i].match(checkCase)){
        previousGuessed[i] = wordHolder[i];
      }
      i++;
    }
    this.previousGuessedWord[this.previousGuessedWord.length - 1] = previousGuessed.join("");
    return previousGuessed.join("");

  }

  /**
   * This function returns a string of all the previous guesses, seperated by a comma
   * This would return something that looks like
   * (Guesses: A, B, C)
   * Hint: use the Array.prototype.join method.
   */
  getGuessesText() {
    const guesses = this.guesses.join(', ');
    const returnValue = "(Guesses: " + guesses + " )";
    return returnValue;
  }

  /**
   * Clears the canvas
   */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws the hangman base
   */
  drawBase() {
    this.ctx.fillRect(95, 10, 150, 10); // Top
    this.ctx.fillRect(245, 10, 10, 50); // Noose
    this.ctx.fillRect(95, 10, 10, 400); // Main beam
    this.ctx.fillRect(10, 410, 175, 10); // Base
  }

  drawHead() {
    //var ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.arc(250, 100, 40, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  drawBody() {
    //var ctx = canvas.getContext("2d");
    this.ctx.beginPath();
    this.ctx.moveTo(250, 140);
    this.ctx.lineTo(250, 270);
    this.ctx.stroke();
  }

  drawLeftArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 140);
    this.ctx.lineTo(170, 200);
    this.ctx.stroke();
  }

  drawRightArm() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 140);
    this.ctx.lineTo(340, 200);
    this.ctx.stroke();
  }

  drawLeftLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 270);
    this.ctx.lineTo(170, 390);
    this.ctx.stroke();
  }

  drawRightLeg() {
    this.ctx.beginPath();
    this.ctx.moveTo(250, 270);
    this.ctx.lineTo(320, 390);
    this.ctx.stroke();
  }
}
