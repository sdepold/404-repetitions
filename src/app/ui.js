export default class UI {
  constructor(gameContainerSelector = "#game") {
    this.game = document.querySelector(gameContainerSelector);
    this.stats = this.createStatsContainer();
    this.time = this.createTimeContainer();
    this.work = this.createWorkContainer();
    this.workout = this.createWorkoutContainer();
  }

  createStatsContainer() {
    const statsContainer = document.createElement("div");

    const rankContainer = document.createElement("div");
    const staminaContainer = document.createElement("div");
    const powerContainer = document.createElement("div");
    const moneyContainer = document.createElement("div");
    const levelContainer = document.createElement("div");

    rankContainer.innerHTML = `
        <span class="icon">🏅</span>
        <span class="value"></span>
    `;
    staminaContainer.innerHTML = `
        <span class="icon">🏃‍♂️</span>
        <span class="value"></span>
    `;
    powerContainer.innerHTML = `
        <span class="icon">🏋️‍♀️</span>
        <span class="value"></span>
    `;
    moneyContainer.innerHTML = `
        <span class="icon">💰</span>
        <span class="value"></span>
    `;
    levelContainer.innerHTML = `
        <span class="icon">💡</span>
        <span class="value"></span>
    `;

    this.game.appendChild(statsContainer);
    statsContainer.classList.add("stats");
    statsContainer.appendChild(rankContainer);
    statsContainer.appendChild(staminaContainer);
    statsContainer.appendChild(powerContainer);
    statsContainer.appendChild(moneyContainer);
    statsContainer.appendChild(levelContainer);

    return {
      statsContainer,
      rankContainer,
      staminaContainer,
      powerContainer,
      moneyContainer,
      levelContainer,
    };
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

  createWorkContainer() {
    const workContainer = document.createElement("ul");

    workContainer.classList.add("work", 'activity');
    this.game.appendChild(workContainer);

    return {
      workContainer,
    };
  }

  createWorkoutContainer() {
    const workoutContainer = document.createElement("ul");

    workoutContainer.classList.add("workout", 'activity');
    this.game.appendChild(workoutContainer);

    return {
      workoutContainer,
    };
  }

  updateStats(player) {
    this.stats.rankContainer.querySelector(".value").innerHTML =
      player.currentStats.rank;
    this.stats.staminaContainer.querySelector(".value").innerHTML = ~~player
      .currentStats.stamina;
    this.stats.powerContainer.querySelector(".value").innerHTML =
      player.levelStats.strength;
    this.stats.moneyContainer.querySelector(
      ".value"
    ).innerHTML = player.currentStats.money.toFixed(2);
    this.stats.levelContainer.querySelector(".value").innerHTML = `
      Level: ${player.currentStats.level} | ${player.currentStats.experience} XP 
    `;
  }

  updateTime(time) {
    const pad = (num) => (num >= 10 ? num : `0${num}`);
    this.time.dayContainer.innerHTML = `Day ${time.day}`;
    this.time.hourContainer.innerHTML = `${pad(time.hours)}:${pad(
      time.minutes
    )}`;
  }

  clearWork(config, onClick) {
    if (!this.work.workContainer.classList.contains("disabled")) {
      this.work.workContainer.classList.add("disabled");
      this.work.workContainer.innerHTML = config.host;

      this.work.workContainer.addEventListener("click", onClick);
    }
  }

  updateWork(config, onClick) {
    if (this.work.workContainer.classList.contains("disabled")) {
      this.work.workContainer.innerHTML = "";
      this.work.workContainer.classList.remove("disabled");
      this.work = { workContainer: this.work.workContainer };
    }

    config.items.forEach((item) => {
      let itemContainer = this.work[item.title];

      if (!itemContainer) {
        this.work[item.title] = itemContainer = document.createElement("li");

        itemContainer.addEventListener("click", () => onClick(item));
        itemContainer.innerHTML = `
          <span class="title">${item.title}</span>
          <span class="earnings">$: ${item.effects.money}, XP: ${item.effects.experience}</span>
          <span class="requirements">
            Time: ${item.requirements.time}
            Stamina: ${item.requirements.stamina}
            Strength: ${item.requirements.strength}
          </span>
        `;
        this.work.workContainer.appendChild(itemContainer);
      }

      itemContainer.classList.remove("current");

      if (item.current) {
        itemContainer.classList.add("current");
      }
    });
  }

  clearWorkout(config, onClick) {
    if (!this.workout.workoutContainer.classList.contains("disabled")) {
      this.workout.workoutContainer.classList.add("disabled");
      this.workout.workoutContainer.innerHTML = config.host;

      this.workout.workoutContainer.addEventListener("click", onClick);
    }
  }

  updateWorkout(config, onClick) {
    if (this.workout.workoutContainer.classList.contains("disabled")) {
      this.workout.workoutContainer.innerHTML = "";
      this.workout.workoutContainer.classList.remove("disabled");
      this.workout = { workoutContainer: this.workout.workoutContainer };
    }

    config.items.forEach((item) => {
      let itemContainer = this.workout[item.title];

      if (!itemContainer) {
        this.workout[item.title] = itemContainer = document.createElement("li");

        itemContainer.addEventListener("click", () => onClick(item));
        itemContainer.innerHTML = `
          <span class="title">${item.title}</span>
          <span class="earnings">XP: ${item.effects.experience}</span>
          <span class="requirements">
            Time: ${item.requirements.time}
            Stamina: ${item.requirements.stamina}
            Strength: ${item.requirements.strength}
          </span>
        `;
        this.workout.workoutContainer.appendChild(itemContainer);
      }

      itemContainer.classList.remove("current");

      if (item.current) {
        itemContainer.classList.add("current");
      }
    });
  }
}
