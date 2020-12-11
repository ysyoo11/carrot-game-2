"use strict";

export default class PopUp {
  constructor() {
    this.popUp = document.querySelector(".pop-up");
    this.popUpText = this.popUp.querySelector(".pop-up__message");
    this.retryBtn = document.querySelector(".pop-up__retry");
    this.retryBtn.addEventListener("click", () => {
      this.onClick && this.onClick();
      this.hide();
    });
  }

  setClickListener(onClick) {
    this.onClick = onClick;
  }

  showWithText(text) {
    this.popUpText.innerHTML = text;
    this.popUp.classList.remove("pop-up--hide");
  }

  hide() {
    this.popUp.classList.add("pop-up--hide");
  }
}
