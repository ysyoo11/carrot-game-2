"use strict";

const CARROT_SIZE = 90;
const CARROT_COUNT = 10;
const BUG_COUNT = 7;
const GAME_DURATION_SEC = 15;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
console.log(fieldRect.width);
const gameBtn = document.querySelector(".game__button");
const gameScore = document.querySelector(".game__score");
const timerIndicator = document.querySelector(".game__timer");

const popUp = document.querySelector(".pop-up");
const popUpText = popUp.querySelector(".pop-up__message");
const retryBtn = document.querySelector(".pop-up__retry");

const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const carrotSound = new Audio("./sound/carrot_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const alertSound = new Audio("./sound/alert.wav");

let started = false;
let score = 0;
let timer = undefined;

const startGame = () => {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  hidePopUp();
  letBugsMove();
  playSound(bgSound);
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
  playSound(alertSound);
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
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WIN ✨" : "YOU LOST 🤡");
};

const onFieldClick = (e) => {
  if (!started) {
    return;
  }
  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    updateScoreBoard();
    playSound(carrotSound);
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
};

const updateScoreBoard = () => {
  gameScore.innerHTML = CARROT_COUNT - score;
};

const stopGameTimer = () => {
  clearInterval(timer);
};

const initGame = () => {
  score = 0;
  field.innerHTML = "";
  gameScore.innerHTML = CARROT_COUNT;
  // Add carrots and bugs on the field
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

const playSound = (sound) => {
  sound.currentTime = 0;
  sound.play();
};

const stopSound = (sound) => sound.pause();

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
    stopSound(bgSound);
  } else {
    startGame();
  }
});

retryBtn.addEventListener("click", startGame);

// 이벤트 위임 Event delegation
field.addEventListener("click", onFieldClick);
