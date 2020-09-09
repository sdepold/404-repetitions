import { initFont, font } from "tinyfont";
import { destroyNode } from "./node";

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
  clearAndRenderTextToCanvas(canvas, content.toUpperCase());

  return textContainer;
}

export function renderTextToCanvas(
  canvas,
  content,
  { x = 0, y = 0, color = "black", textSize = 14, textAlign = "left" } = {}
) {
  const ctx = canvas.getContext("2d");
  const render = initFont(font, ctx);

  if (textAlign === "center") {
    const textWidth = content.split("").length * textSize * 0.85;
    x = (canvas.width / 2) - (textWidth / 2);
  }

  render(content, x, y, textSize, color);
}

export function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function clearAndRenderTextToCanvas(canvas, ...args) {
  clearCanvas(canvas);
  renderTextToCanvas(canvas, ...args);
}

export function destroyText(textContainer, { container, ttl = 0 } = {}) {
  container = container || document.querySelector("#game");

  setTimeout(() => {
    destroyNode(textContainer);
  }, ttl * 1000);
}

export function renderLines(canvas, lines) {
  const ctx = canvas.getContext("2d");
  const render = initFont(font, ctx);

  lines.forEach((line, i) => {
    renderTextToCanvas(canvas, line.text.toUpperCase(), {
      x: line.x,
      y: line.y || i * 40,
      color: line.color || "white",
      textSize: line.textSize,
      textAlign: line.textAlign,
    });
  });
}
