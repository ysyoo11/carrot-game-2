"use strict";

import PopUp from "./popup.js";
import { GameBuilder, Reason } from "./game.js";
import * as sound from "./sound.js";

const gameFinishBanner = new PopUp();
const game = new GameBuilder()
  .withGameDuration(10)
  .withCarrotCount(10)
  .withBugCount(7)
  .build();

game.setGameStop((reason) => {
  let message;
  switch (reason) {
    case Reason.pause:
      message = "Replay❓";
      sound.playAlertSound();
      break;
    case Reason.win:
      message = "You WIN ✨";
      sound.playWinSound();
      break;
    case Reason.lose:
      message = "You LOST 🤡";
      sound.playBugSound();
      break;
    default:
      throw new Error("not valid reason");
  }
  gameFinishBanner.showWithText(message);
});

gameFinishBanner.setClickListener(() => game.start());
