export default class Player {
  constructor() {
    this.levelStats = {
      stamina: 1,
      strength: 1,
      luck: 1,
      requiredExperience: 100,
    };
    this.statsLimits = {
      stamina: this.levelStats.stamina * 100,
    };
    this.currentStats = {
      stamina: this.statsLimits.stamina,
      rank: 10000 + ~~(Math.random() * 10000),
      money: 4.04,
      experience: 0,
      level: 1,
    };
  }

  updateStat(property, delta) {
    this.currentStats[property] += delta;

    if (
      property === "experience" &&
      this.currentStats.experience >= this.levelStats.requiredExperience
    ) {
      this.currentStats.level += 1;
      this.currentStats.experience -= this.levelStats.requiredExperience;
      this.levelStats.requiredExperience *= 2;
    }

    if (property === "stamina") {
      this.currentStats.stamina = Math.min(
        this.currentStats.stamina,
        this.statsLimits.stamina
      );
    }
  }

  hasStat(statName, value) {
    if (statName === "time") return true;

    if (Object.keys(this.currentStats).includes(statName)) {
      return this.currentStats[statName] >= value;
    }

    if (Object.keys(this.levelStats).includes(statName)) {
      return this.levelStats[statName] >= value;
    }

    return false;
  }
}
