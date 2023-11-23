// Bulls and Cows
import { question, keyInYNStrict, keyInSelect } from "readline-sync";
import {
  italic,
  blue,
  green,
  red,
  redBright,
  yellow,
  yellowBright,
  cyan,
  bold,
} from "colorette";

export function welcome() {
  console.clear();
  const playerNameInput = question("What is your name? ").trim();
  let playerName = playerNameInput !== "" ? playerNameInput : "Stranger";

  const welcomeMsg = `\nWelcome to the Bulls 🐂 and Cows 🐄 Game, ${playerName}!`;
  const introMsg = `\nPrepare yourself for a challenging and exciting guessing experience. In this game, your objective is to crack a secret 4-digit number randomly chosen by the computer. After each guess you make, the game will provide you with a hint to improve your next attempt. The hint will consist of two numbers: the number of "bulls" and the number of "cows". "Bulls" represent the digits that match both in value and position with the secret number. On the other hand, "cows" indicate the digits that match in value but are in different positions.\n
  Are you ready to put your mind to the test and unravel the mystery? Let the Bulls and Cows game begin! 🧑‍🌾`;
  //const typingDelay = 20; // Delay between each character (in milliseconds)

  console.clear();
  centerText(welcomeMsg, "redBright");
  centerText(introMsg, "green");
  //typewriterEffect(introMsg, typingDelay);

  return playerName;
}

function typewriterEffect(text, delay) {
  let index = 0;
  const intervalId = setInterval(() => {
    process.stdout.write(text[index]);
    index++;
    if (index === text.length) {
      clearInterval(intervalId);
      process.stdout.write("\n"); // Move to the next line after typing
    }
  }, delay);
}

function centerText(message, color) {
  const terminalWidth = process.stdout.columns;
  const lines = message.split("\n"); // Split the message into lines
  let centeredMessage = "";

  for (let line of lines) {
    const paddingLength = Math.floor((terminalWidth - line.length) / 2);
    const padding = " ".repeat(Math.max(0, paddingLength));
    centeredMessage += `${padding}${line}\n`; // Append the centered line with padding
  }

  switch (color) {
    case "redBright":
      console.log(bold(redBright(centeredMessage)));
      break;
    case "blue":
      console.log(blue(centeredMessage));
      break;
    case "green":
      console.log(green(centeredMessage));
      break;
    default:
      console.log(centeredMessage);
      break;
  }
}

export function chooseLevel() {
  const levelOptions = [
    "Easy: no limit on the number of attempts",
    "Difficult: max 10 attempts",
  ];
  const selectedLevel = keyInSelect(levelOptions, "Choose your game level: ");

  let gameLevel;
  switch (selectedLevel) {
    case -1:
      console.log(blue("Goodbye 👋"));
      process.exit();
      break;
    case 0:
      gameLevel = "Easy";
      console.log(
        yellowBright(`You choose level ${gameLevel}. Let's start 🚀`)
      );
      break;
    case 1:
      gameLevel = "Difficult";
      console.log(
        yellowBright(`You choose level ${gameLevel}. Let's start 🚀`)
      );
      break;
    default:
      console.log("Invalid choice. Assuming Easy level.");
      gameLevel = "easy";
      break;
  }

  return gameLevel;
}

export function createSecretNumber() {
  const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let secretNumber = "";
  while (secretNumber.length < 4) {
    const randomIndex = Math.floor(Math.random() * digits.length);
    const randomDigit = digits[randomIndex];
    if (!secretNumber.includes(randomDigit)) {
      secretNumber += randomDigit;
    }
  }
  return secretNumber;
}

export function getPlayersGuess() {
  let playerGuess = question("\nType your guess ➡️ ");
  return playerGuess;
}

function guessValidation(playerGuess) {
  for (let i = 0; i < 4; i++) {
    //case invalid: not a string consisting of only digits
    if (!/^\d+$/.test(playerGuess)) {
      console.log("\nPlease enter a number, without any letters.");
      return false;
    }

    //case invalid: not exactly 4 digit:
    if (playerGuess.length !== 4) {
      console.log("\nPlease enter a four-digit number for your guess.");
      return false;
    }

    //case invalid: duplicated digit:
    const uniqueSet = new Set(playerGuess);
    if (uniqueSet.size !== 4) {
      console.log(
        "\nEach digit in number must be unique. Please enter your guess again."
      );
      return false;
    }
  }
  //all validations passed:
  return true;
}

export function gameOn(secretNumber, playerGuess, playerName, gameLevel) {
  let numAttempts = 0;

  //keep asking for a valid guess
  while (!guessValidation(playerGuess)) {
    playerGuess = question("\nType your guess ➡️ ");
  }

  //game played until player guesses correctly
  while (playerGuess !== secretNumber) {
    numAttempts++;
    getHint(secretNumber, playerGuess, playerName);
    playerGuess = getPlayersGuess(); // Prompt for a new guess

    while (!guessValidation(playerGuess)) {
      playerGuess = getPlayersGuess(); // Keep asking for a valid guess
    }

    //if the level is difficulty
    if (gameLevel === "Difficult" && numAttempts > 10) {
      console.log(
        red(
          `Sorry, ${playerName}! Your attempts have been wrangled up. But remember, the secret number is just grazing in the field, waiting for your next try!`
        )
      );
      playAgain(playerName);
      break;
    }
  }

  //user guessed successfully
  if (playerGuess === secretNumber) {
    let emotionAbtAttempts = "";
    if (numAttempts <= 10) {
      emotionAbtAttempts += "🤩 🎉";
    } else {
      emotionAbtAttempts += "👏";
    }
    console.log(
      yellow(
        `Congrats ${playerName} 🎊! You guessed the secret number ${secretNumber} 🥳 \nYour number of attempts is ${numAttempts} ${emotionAbtAttempts}`
      )
    );
    playAgain(playerName);
  }
}

function getHint(secretNumber, playerGuess, playerName) {
  let bulls = 0;
  let cows = 0;

  for (let i = 0; i < secretNumber.length; i++) {
    //if bulls detected
    if (playerGuess[i] === secretNumber[i]) {
      bulls++;
    }
    for (let j = 0; j < playerGuess.length; j++) {
      //if cows detected
      if (playerGuess[j] === secretNumber[i] && i !== j) {
        cows++;
      }
    }
  }

  if (bulls === 0 && cows === 0) {
    //if no bulls and cows
    const randomMessage = [
      "Keep on moooving! No bulls or cows this time.",
      "Bulls and cows are on vacation! Try again for a pasture-perfect guess.",
      "No bulls, no cows, no worries! Keep milking your brain for the right answer.",
      "Mooo-ve along! No bulls or cows spotted yet.",
      "No bulls or cows in sight. It's pasture bedtime for them!",
    ];
    const messageIndex = Math.floor(Math.random() * randomMessage.length);
    console.log(red(randomMessage[messageIndex]));
  } else {
    //display the bulls and cows
    const bullsSingularOrPlural = bulls === 1 ? "bull" : "bulls";
    const cowsSingularOrPlural = cows === 1 ? "cow" : "cows";
    console.log(
      cyan(
        `Hint for you, ${playerName}: ${bulls} ${bullsSingularOrPlural} and ${cows} ${cowsSingularOrPlural}`
      )
    );
  }
}

function playAgain(playerName) {
  let playAgain = keyInYNStrict("\nAnother round?");
  if (playAgain) {
    console.log(yellow("\nGood luck!\nLet's start 🚀"));
    setTimeout(() => {
      console.clear();
      const gameLevel = chooseLevel();
      const secretNumber = createSecretNumber();
      const playerGuess = getPlayersGuess();
      gameOn(secretNumber, playerGuess, playerName, gameLevel);
    }, 2000);
  } else {
    console.log(italic(blue(`\nNice to meet you ${playerName}. Goodbye!\n`)));
    process.exit();
  }
}
