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
      level: 1
    };
  }

  updateStat(property, delta) {
    this.currentStats[property] += delta;
  }
}
