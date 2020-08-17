import Player from "./player";
import UI from "./ui";

let workItems = [
  {
    title: "Chop wood",
    salary: 50,
    experience: 25,
    stamina: 30,
    strength: 2,
    time: 120,
  },
  {
    title: "Cashier",
    salary: 30,
    experience: 20,
    stamina: 10,
    strength: 0,
    time: 480,
  },
  {
    title: "Dog walk",
    salary: 10,
    experience: 10,
    stamina: 15,
    strength: 0,
    time: 45,
  },
];
const minutesPerTick = 1;
const staminaPerTick = 0.01;
const tickDelay=33;

export default class Game {
  constructor() {
    this.player = new Player();
    this.ui = new UI();
    this.time = { day: 0, hours: 0, minutes: 0 };
  }

  increaseTime() {
    this.time.minutes += minutesPerTick;

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
      this.increaseTime();

      this.player.updateStat("stamina", -staminaPerTick);

      this.ui.updateStats(this.player);
      this.ui.updateTime(this.time);

      this.checkCurrentWork();
      this.ui.updateWork(workItems, (item) => this.onWork(item));
    }, tickDelay);

    this.ui.updateStats(this.player);
    this.ui.updateTime(this.time);
  }

  onWork(chosenWorkItem) {
    console.log(chosenWorkItem);
    workItems.forEach((workItem) => {
      workItem.current = false;

      if (workItem.title === chosenWorkItem.title) {
        workItem.current = true;
        workItem.investedTime = 0;
      }
    });
  }

  checkCurrentWork() {
    const currentWork = workItems.find((i) => i.current);

    if (currentWork) {
      currentWork.investedTime += minutesPerTick;

      if (currentWork.investedTime >= currentWork.time) {
        delete currentWork.investedTime;
        currentWork.current = false;

        this.player.updateStat("money", currentWork.salary);
        this.player.updateStat('experience', currentWork.experience)
      }
    }
  }
}
