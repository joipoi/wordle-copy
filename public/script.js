let currentRow = 0;
let currentLetter = 0;
let currentWord;
let currentDict = [];
initialize();
async function initialize() {
  currentDict = await loadDictionary(); 
  
  startGame();
}
function startGame(){
  currentRow = 0;
  currentLetter = 0;
  getRandomWord().then((randomWord) => {
    currentWord = randomWord.toLowerCase();
    //uncomment if you want the current word printed in the console
    console.log(currentWord);
  });
  document.getElementById('result').innerHTML = "";
  makeKeyboard();
  makeGuessRows();
}

async function loadDictionary() {
  try {
    const response = await fetch("dictionary.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const words = Object.keys(data);
    return words;
  } catch (error) {
    console.error("Error fetching the dictionary:", error);
  }
}

async function getRandomWord() {
  try {
    const response = await fetch("common_dictionary.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const words = data["commonWords"]; // Get the keys (words) from the object
    const fiveLetterWords = getWordsByLength(words, 5);
    const randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
    return fiveLetterWords[randomIndex];
  } catch (error) {
    console.error("Error fetching the dictionary:", error);
  }
}

function getWordsByLength(dictionary, length) {
  const sameLengthWords = [];

  dictionary.forEach((word) => {
    if (word.length === length) {
      sameLengthWords.push(word);
    }
  });
  return sameLengthWords;
}

function makeKeyboard() {
  const keyboard = document.getElementById("keyboard");
  keyboard.innerHTML = "";
  const keys = [
    "Q",
    "W",
    "E",
    "R",
    "T",
    "Y",
    "U",
    "I",
    "O",
    "P",
    "A",
    "S",
    "D",
    "F",
    "G",
    "H",
    "J",
    "K",
    "L",
    "",
    "",
    "Z",
    "X",
    "C",
    "V",
    "B",
    "N",
    "M",
    "",
    "❌",
  ];

  keys.forEach((key) => {
    const keyDiv = document.createElement("div");
    keyDiv.className = "key";
    keyDiv.textContent = key; // Set the key label
    if (key == "❌" || key == "") {
      keyDiv.addEventListener("click", backPressed);
    } else {
      keyDiv.addEventListener("click", letterPressed);
    }

    keyboard.appendChild(keyDiv);
  });
}

function makeGuessRows() {
  guessDiv.innerHTML = "";
  const rows = 6;

  for (let row = 0; row < rows; row++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "wordRow";
    for (let i = 0; i < 5; i++) {
      const letter = document.createElement("div");
      letter.className = "guessSquare";
      rowDiv.append(letter);
    }
    guessDiv.append(rowDiv);
  }
}
function letterPressed(event) {

  if (currentLetter < 5) {
    guessDiv.children[currentRow].children[currentLetter].innerHTML =
      this.textContent;
  }

  if (currentLetter < 4) {
    currentLetter++;
  } else {
    checkWord();
  }
}
function backPressed() {
  if (currentLetter > 0) {
    guessDiv.children[currentRow].children[currentLetter - 1].innerHTML = "";
    currentLetter--;
  }
}
function checkWord() {
  let word = "";
  const letterDivs = guessDiv.children[currentRow].children;
  for (let i = 0; i < 5; i++) {
    word += letterDivs[i].textContent;
  }
  if (word.toLowerCase() === currentWord) {
    guess_correct();
    endGame(true);
    currentLetter = 10;
  } else if (currentDict.includes(word.toLowerCase())) {
    guess_wrongWord();
    currentRow++;
    currentLetter = 0;
  } else {
    guess_notInWordList();
    currentLetter = 5;
  }

  if(currentRow === 6 && word.toLowerCase() != currentWord){
    endGame(false);
  }
}
function guess_notInWordList() {
  guessDiv.children[currentRow].style.backgroundColor = "red";
  setTimeout(function () {
    guessDiv.children[currentRow].style.backgroundColor = "white";
  }, 1000);
}

//Currently bugged, does not count instances of letter
function guess_wrongWord() {
  const currentWordArr = currentWord.split("");

  const letterDivs = guessDiv.children[currentRow].children;
  for (let i = 0; i < 5; i++) {
    const letter = letterDivs[i].textContent.toLowerCase();
    let letterKey = getLetterDiv(letter);
    let color;

    if (currentWordArr[i] === letter) {
      color = "green";
    } else if (currentWordArr.includes(letter)) {
      color = "#baab34"; //yellow
    }else{
      color = "#45433f";
      letterKey.style.color = "white";
    }
    letterDivs[i].style.backgroundColor = color;
    letterKey.style.backgroundColor = color;
  }
  
}

function guess_correct() {
  guessDiv.children[currentRow].style.backgroundColor = "green";
}

function getLetterDiv(letter){
  const keyDivs = document.getElementById('keyboard').children;

  for(let i = 0; i < keyDivs.length; i++){
    if(keyDivs[i].textContent.toLowerCase() == letter){
      return keyDivs[i];
    }
  }

}
function endGame(wonGame){
  const resultDiv = document.getElementById('result');
if(wonGame){
  resultDiv.innerHTML = "You won, the word was: " + currentWord + "<button id='playAgain' onclick='startGame()'>Play Again</button>";
}else{
  resultDiv.innerHTML = "You lost, the word was: " + currentWord + "<button id='playAgain' onclick='startGame()'>Play Again</button>";
}
}