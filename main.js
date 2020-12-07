"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 7;
const GAME_DURATION_SEC = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button");
const gameScore = document.querySelector(".game__score");
const timerIndicator = document.querySelector(".game__timer");
const popUp = document.querySelector(".pop-up");
const popUpText = popUp.querySelector(".pop-up__message");
const retryBtn = document.querySelector(".pop-up__retry");

let started = false;
let score = 0;
let timer = undefined;

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

const startGame = () => {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  hidePopUp();
};

retryBtn.addEventListener("click", startGame);

const stopGame = () => {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText("Restart❓");
};

const showPopUpWithText = (text) => {
  popUpText.innerHTML = text;
  popUp.classList.remove("pop-up--hide");
};

const hidePopUp = () => {
  popUp.classList.add("pop-up--hide");
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
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
};

const updateTimerText = (time) => {
  const minute = Math.floor(time / 60);
  const second = time % 60;
  if (second < 10) {
    timerIndicator.innerHTML = `0${minute}:0${second}`;
  } else {
    timerIndicator.innerHTML = `0${minute}:${second}`;
  }
};

const finishGame = (win) => {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText(win ? "YOU WIN ✨" : "YOU LOST 🤡");
};

const stopGameTimer = () => {
  clearInterval(timer);
};

const initGame = () => {
  field.innerHTML = "";
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
};

const addItem = (className, count, imgPath) => {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
};

const randomNumber = (min, max) => {
  return Math.random() * (max - min) + min;
};

initGame();
