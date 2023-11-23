import {
  welcome,
  chooseLevel,
  createSecretNumber,
  getPlayersGuess,
  gameOn,
} from "./functions.js";

const playerName = welcome();
const gameLevel = chooseLevel();
const secretNumber = createSecretNumber();
const playerGuess = getPlayersGuess();
gameOn(secretNumber, playerGuess, playerName, gameLevel);
