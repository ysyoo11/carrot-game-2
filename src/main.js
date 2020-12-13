"use strict";

import PopUp from "./popup.js";
import Field from "./field.js";
import * as sound from "./sound.js";

const CARROT_COUNT = 10;
const BUG_COUNT = 7;
const GAME_DURATION_SEC = 15;

const gameBtn = document.querySelector(".game__button");
const gameScore = document.querySelector(".game__score");
const timerIndicator = document.querySelector(".game__timer");

let started = false;
let score = 0;
let timer = undefined;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(() => startGame());

const gameField = new Field(CARROT_COUNT, BUG_COUNT);
gameField.setClickListener(() => onFieldClick());

const onFieldClick = (item) => {
  if (!started) {
    return;
  }
  if (item === "carrot") {
    score++;
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (item === "bug") {
    finishGame(false);
  }
};

const startGame = () => {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  letBugsMove();
  sound.playBgSound();
};

const letBugsMove = () => {
  const bugs = document.querySelectorAll(".bug");
  const getRandomX = (width) => {
    return Math.random() * width;
  };
  const getRandomDuration = (duration) => {
    return Math.random() * duration + 2000;
  };
  for (let i = 0; i < bugs.length; i++) {
    let aBug = bugs[i];
    let randomX = getRandomX(300);
    let randomDuration = getRandomDuration(1000);
    aBug.style.overflow = "hidden";
    aBug.animate(
      [
        { transfrom: "translateX(0px)" },
        { transform: `translateX(${randomX}px)` },
        { transfrom: "translateX(0px)" },
      ],
      { duration: randomDuration, iterations: Infinity }
    );
  }
};

const stopGame = () => {
  started = false;
  stopGameTimer();
  hideGameButton();
  sound.playAlertSound();
  gameFinishBanner.showWithText("Restart❓");
};

const hideGameButton = () => {
  gameBtn.style.visibility = "hidden";
};

const showStopButton = () => {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
};

const showTimerAndScore = () => {
  timerIndicator.style.visibility = "visible";
  gameScore.style.visibility = "visible";
};

const startGameTimer = () => {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      showTimeoutText();
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
};

const showTimeoutText = () => {
  timerIndicator.innerHTML = "Timeout";
  timerIndicator.style.textAlign = "center";
};

const updateTimerText = (time) => {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  if (second < 10) {
    timerIndicator.innerHTML = `0${minute}:0${second}`;
  } else if (0 < second < 10) {
    timerIndicator.innerHTML = `0${minute}:${second}`;
  } else if (second <= 0) {
    timerIndicator.innerHTML = `Timeout`;
  }
};

const finishGame = (win) => {
  started = false;
  stopGameTimer();
  hideGameButton();
  if (win) {
    sound.playWinSound();
  } else {
    sound.playBugSound();
  }
  sound.stopBgSound();
  gameFinishBanner.showWithText(win ? "YOU WIN ✨" : "YOU LOST 🤡");
};

const updateScoreBoard = () => {
  gameScore.innerHTML = CARROT_COUNT - score;
};

const stopGameTimer = () => {
  clearInterval(timer);
};

const initGame = () => {
  score = 0;
  gameScore.innerHTML = CARROT_COUNT;
  gameField.init();
};

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
    sound.stopBgSound();
  } else {
    startGame();
  }
});
