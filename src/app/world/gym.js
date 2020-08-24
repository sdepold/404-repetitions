import "./gym.less";

export default class Gym {
  constructor() {
    this.container = document.createElement("div");
  }

  appendTo(container) {
    container.appendChild(this.container);
    this.container.classList.add("world");

    this.container.innerHTML = `
      <div class="house" id="house" data-rooms="3">
        <div class="house-wings" data-flip-key="wings">
          <div class="house-left-wing">
            <div class="house-window"></div>
            <div class="house-window"></div>
            <div class="house-sparkle">
              <div class="house-sparkle-dots"></div>
            </div>
          </div>
          <div class="house-right-wing">      
            <div class="house-window"></div>
            <div class="house-window"></div>
            <div class="house-sparkle">
              <div class="house-sparkle-dots"></div>
            </div>
          </div>
          <div class="house-roof">
            <div class="house-ledge"></div>
          </div>
      </div>
      <div class="house-front" data-flip-key="front">
        <div class="house-chimney"></div>
        <div class="house-facade"></div>
        <div class="house-window">
          <div class="house-sparkle">
            <div class="house-sparkle-dots"></div>
          </div>
        </div>
        <div class="house-doorway">
          <div class="house-stairs"></div>
          <div class="house-door"></div>
        </div>
        <div class="house-gable">      
          <div class="house-roof">
            <div class="house-ledge"></div>
          </div>
        </div>
        </div>
      </div>
    `;

    return this;
  }

  update() {}

  render() {}
}
