"use strict";

import { Field, ItemType } from "./field.js";
import * as sound from "./sound.js";

export const Reason = Object.freeze({
  win: "win",
  lose: "lose",
  pause: "pause",
});

// Builder Pattern
export class GameBuilder {
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
        this.stop(Reason.pause);
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
    if (item === ItemType.carrot) {
      this.score++;
      console.log(this.score);
      this.updateScoreBoard(this.score);
      if (this.score === this.carrotCount) {
        this.stop(Reason.win);
      }
    } else if (item === ItemType.bug) {
      this.stop(Reason.lose);
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
  init() {
    this.score = 0;
    this.gameScore.innerHTML = this.carrotCount;
  }
  stop(reason) {
    this.started = false;
    this.stopTimer(this.timer);
    this.hideButton();
    sound.stopBgSound();
    this.onGameStop && this.onGameStop(reason);
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
        this.stop(Reason.lose);
        return;
      }
      this.updateTimerText(--remainingTimeSec);
    }, 1000);
  }
}
