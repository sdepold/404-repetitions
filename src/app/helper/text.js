import { initFont, font } from "tinyfont";

export function renderText(content, { container, ttl } = {}) {
  container = container || document.querySelector("#game");

  const textContainer = createText(content, container);

  if (ttl) {
    destroyText(textContainer, { container, ttl });
  }

  return textContainer;
}

function createText(content, container) {
  const textContainer = document.createElement("div");
  const canvas = document.createElement("canvas");

  container.appendChild(textContainer);
  textContainer.classList.add("text-overlay");
  textContainer.appendChild(canvas);
  renderTextToCanvas(canvas, content.toUpperCase());

  return textContainer;
}

export function renderTextToCanvas(canvas, content) {
  const ctx = canvas.getContext('2d');
  const render = initFont(font, ctx);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  render(content, 0, 0, 14);
}

export function destroyText(textContainer, { container, ttl = 0 } = {}) {
  container = container || document.querySelector("#game");

  setTimeout(() => {
    container.removeChild(textContainer);
  }, ttl * 1000);
}
