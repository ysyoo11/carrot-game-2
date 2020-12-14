"use strict";

import PopUp from "./popup.js";
import Game from "./game.js";

const gameFinishBanner = new PopUp();
const game = new Game(3, 2, 2);

game.setGameStop((reason) => {
  let message;
  switch (reason) {
    case "pause":
      message = "Replay❓";
      break;
    case "win":
      message = "You WIN ✨";
      break;
    case "lost":
      message = "You LOST 🤡";
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => game.start());
