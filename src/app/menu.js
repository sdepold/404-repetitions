export default class Menu {
    constructor(items) {
        this.items = items;
        this.state = {
            selectedItem = items[0]
        }

        this.container = document.createElement("div");
    }

    appendTo(container) {
        container.appendChild(this.container);
        this.container.classList.add(this.config.name, "activity");
    
        return this;
      }

      update
}