import Player from "./player";
import UI from "./ui";
import Activity from "./activity";

import competitionConfig from "../config/competition.json";
import foodConfig from "../config/food.json";
import gameConfig from "../config/game.json";
import homeConfig from "../config/home";
import workConfig from "../config/work.json";
import workoutConfig from "../config/workout.json";
import Stats from "./stats";
import World from "./world";
import { renderText } from "./helper/text";
import { initDialog } from "./story";
import WelcomeScreen from "./screens/welcome";
import Menu, { MenuItem } from "./menu";
import MiniGame from "./mini-games/mini-game";
import JumpingJacks from "./mini-games/jumping-jacks";
import EndScreen from "./screens/end";

export default class Game {
  constructor() {
    this.player = new Player();
    this.ui = new UI();
    this.time = { day: 0, hours: 0, minutes: 0 };
    this.state = {
      busy: false,
      renderWorkMenu: false,
      renderWorkoutMenu: false,
      started: false,
      finished: false,
    };
    this.renderables = [
      new World().appendTo(this.ui.game),
      new Stats(this).appendTo(this.ui.game),
      new Activity(this, competitionConfig).appendTo(this.ui.game),
      new Activity(this, foodConfig).appendTo(this.ui.game),
      new Activity(this, homeConfig).appendTo(this.ui.game),
      new Activity(this, workConfig).appendTo(this.ui.game),
      new Activity(this, workoutConfig).appendTo(this.ui.game),
      this.player.appendTo(this.ui.game),
      new WelcomeScreen(this).appendTo(this.ui.game),
    ];
  }

  removeRenderable(renderable) {
    this.renderables = this.renderables.filter((r) => r !== renderable);
  }

  increaseTime() {
    this.time.minutes += gameConfig.minutesPerTick;

    if (this.time.minutes >= 60) {
      this.time.hours += 1;
      this.time.minutes = 0;
    }

    if (this.time.hours >= 24) {
      this.time.day += 1;
      this.time.minutes = this.time.hours = 0;
    }
  }

  run() {
    setInterval(() => {
      if (this.state.started) {
        this.increaseTime();

        if (
          !this.renderables.find(
            (activity) => activity.hasCurrent && activity.hasCurrent()
          )
        ) {
          this.player.updateStat("stamina", -gameConfig.staminaPerTick);
        }
      }

      if (!this.state.finished && this.player.currentStats.rank <= 404) {
        window.blockMovement = this.state.finished = true;
        this.player.currentStats.rank = 404;
        this.renderables.push(new EndScreen(this).appendTo(this.ui.game));
      }

      this.renderables.forEach((a) => a.update && a.update());
      this.renderables.forEach((a) => a.render && a.render());
    }, gameConfig.tickDelay);
  }

  start() {
    this.state.started = true;
    initDialog(this.player);
  }
}
