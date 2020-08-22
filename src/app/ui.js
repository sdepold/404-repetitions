export default class UI {
  constructor(gameContainerSelector = "#game") {
    this.game = document.querySelector(gameContainerSelector);
    this.time = this.createTimeContainer();
  }

  createTimeContainer() {
    const timeContainer = document.createElement("div");

    timeContainer.classList.add("time");
    timeContainer.innerHTML = '<div class="day"></div><div class="hour"></div>';
    this.game.appendChild(timeContainer);

    return {
      timeContainer,
      dayContainer: timeContainer.querySelector(".day"),
      hourContainer: timeContainer.querySelector(".hour"),
    };
  }

  updateTime(time) {
    const pad = (num) => (num >= 10 ? num : `0${num}`);
    this.time.dayContainer.innerHTML = `Day ${time.day}`;
    this.time.hourContainer.innerHTML = `${pad(time.hours)}:${pad(
      time.minutes
    )}`;
  }
}
