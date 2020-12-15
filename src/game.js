"use strict";

import Field from "./field.js";
import * as sound from "./sound.js";

// Builder Pattern
export default class GameBuilder {
  withGameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }
  withCarrotCount(num) {
    this.carrotCount = num;
    return this;
  }
  withBugCount(num) {
    this.bugCount = num;
    return this;
  }
  build() {
    console.log(this);
    return new Game(
      this.gameDuration, //
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector(".game__timer");
    this.gameScore = document.querySelector(".game__score");
    this.gameBtn = document.querySelector(".game__button");
    this.gameBtn.addEventListener("click", () => {
      if (this.started) {
        this.stop();
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.score = 0;
    this.started = false;
    this.timer = undefined;
  }

  // Handle pop-up message
  setGameStop(onGameStop) {
    this.onGameStop = onGameStop;
  }

  // Click Event
  onItemClick = (item) => {
    if (!this.started) {
      return;
    }
    if (item === "carrot") {
      this.score++;
      console.log(this.score);
      this.updateScoreBoard(this.score);
      if (this.score === this.carrotCount) {
        this.finish(true);
      }
    } else if (item === "bug") {
      this.finish(false);
    }
  };
  setClickListener(onClick) {
    this.onClick = onClick;
  }

  // Start & Stop
  start() {
    this.started = true;
    this.init();
    this.showStopButton();
    this.showTimerAndScore();
    this.startTimer();
    this.gameField.init();
    this.gameField.letBugsMove();
    sound.playBgSound();
  }
  stop() {
    this.started = false;
    this.stopTimer(this.timer);
    this.hideButton();
    sound.playAlertSound();
    sound.stopBgSound();
    this.onGameStop && this.onGameStop("pause");
  }
  init() {
    this.score = 0;
    this.gameScore.innerHTML = this.carrotCount;
  }

  // Win & Lose
  finish(win) {
    this.started = false;
    this.hideButton();
    if (win) {
      sound.playWinSound();
    } else {
      sound.playBugSound();
    }
    this.stopTimer(this.timer);
    sound.stopBgSound();
    this.onGameStop && this.onGameStop(win ? "win" : "lost");
  }

  // Score
  showTimerAndScore() {
    this.gameTimer.style.visibility = "visible";
    this.gameScore.style.visibility = "visible";
  }
  updateScoreBoard(score) {
    this.gameScore.innerHTML = this.carrotCount - score;
  }

  // Game Button
  hideButton() {
    this.gameBtn.style.visibility = "hidden";
  }
  showStopButton() {
    const icon = this.gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    this.gameBtn.style.visibility = "visible";
  }

  // Timer
  showTimeoutText() {
    this.gameTimer.innerHTML = "Timeout";
    this.gameTimer.style.textAlign = "center";
  }
  stopTimer(timer) {
    clearInterval(timer);
  }
  updateTimerText(time) {
    const minute = Math.floor(time / 60);
    const second = time % 60;
    if (second < 10) {
      this.gameTimer.innerHTML = `0${minute}:0${second}`;
    } else if (0 < second < 10) {
      this.gameTimer.innerHTML = `0${minute}:${second}`;
    } else if (second <= 0) {
      this.gameTimer.innerHTML = `Timeout`;
    }
  }
  startTimer() {
    let remainingTimeSec = this.gameDuration;
    this.updateTimerText(remainingTimeSec);
    this.timer = setInterval(() => {
      if (remainingTimeSec <= 0) {
        this.showTimeoutText();
        clearInterval(this.timer);
        this.finish(this.score === this.carrotCount);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }
}
