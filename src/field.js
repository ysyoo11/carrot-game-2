"use strict";

import * as sound from "./sound.js";

const CARROT_SIZE = 90;

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.field = document.querySelector(".game__field");
    this.fieldRect = this.field.getBoundingClientRect();
    this.field.addEventListener("click", (e) => {
      this.onClick(e);
    });
  }

  init() {
    this.field.innerHTML = "";
    this._addItem("carrot", this.carrotCount, "img/carrot.png");
    this._addItem("bug", this.bugCount, "img/bug.png");
  }

  setClickListener(onItemClick) {
    this.onItemClick = onItemClick;
  }

  _addItem = (className, count, imgPath) => {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.fieldRect.width - CARROT_SIZE;
    const y2 = this.fieldRect.height - CARROT_SIZE;
    for (let i = 0; i < count; i++) {
      const item = document.createElement("img");
      item.setAttribute("class", className);
      item.setAttribute("src", imgPath);
      item.style.position = "absolute";
      const x = randomNumber(x1, x2);
      const y = randomNumber(y1, y2);
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.field.appendChild(item);
    }
  };

  letBugsMove() {
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
  }

  onClick(e) {
    const target = e.target;
    if (target.matches(".carrot")) {
      target.remove();
      sound.playCarrotSound();
      this.onItemClick && this.onItemClick("carrot");
    } else if (target.matches(".bug")) {
      this.onItemClick && this.onItemClick("bug");
    }
  }
}

const randomNumber = (min, max) => Math.random() * (max - min) + min;
