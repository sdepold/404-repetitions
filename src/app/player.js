export default class Player {
    constructor() {
        this.stamina = this.maxStamina = 100;
        this.power = this.maxPower = 100;
        this.rank = 10000 + ~~(Math.random() * 10000);
        this.money = 4.04;
    }

    updateStat(property, delta) {
        this[property]+=delta;
    }
}