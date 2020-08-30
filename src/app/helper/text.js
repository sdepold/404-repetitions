import { initFont, font } from "tinyfont";

export function renderText(content, { container, ttl } = {}) {
  container = container || document.querySelector("#game");

  const textContainer = createText(content, container);

  if (ttl) {
    destroyText(textContainer, { container });
  }

  return textContainer;
}

function createText(content, container) {
  const textContainer = document.createElement("div");
  const canvas = document.createElement("canvas");

  container.appendChild(textContainer);
  textContainer.classList.add("text-overlay");
  textContainer.appendChild(canvas);

  const render = initFont(font, canvas.getContext("2d"));

  render(content.toUpperCase(), 0, 0, 14);

  return textContainer;
}

export function destroyText(textContainer, { container, ttl = 0 } = {}) {
  container = container || document.querySelector("#game");

  setTimeout(() => {
    container.removeChild(textContainer);
  }, ttl * 1000);
}
