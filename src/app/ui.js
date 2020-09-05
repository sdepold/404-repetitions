export default class UI {
  constructor(gameContainerSelector = "#game") {
    this.game = document.querySelector(gameContainerSelector);
  }
}
