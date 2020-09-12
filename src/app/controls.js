export const LEFT = "left";
export const RIGHT = "right";
export const UP = "up";
export const DOWN = "down";
export const SPACE = "space";

let currentKeyPresses;
let keyboardIsObserved = false;

export function keyPressed(name) {
  return currentKeyPresses[name];
}

export function resetKeys() {
  currentKeyPresses = {
    [UP]: false,
    [LEFT]: false,
    [RIGHT]: false,
    [DOWN]: false,
    [SPACE]: false,
  }
}

resetKeys();

function observeKeyboard() {
  const setKeyPressed = (prop, value) => (currentKeyPresses[prop] = value);
  const evalKeyPress = (e, value) => {
    e.preventDefault();

    if ([38, 87].includes(e.which)) {
      setKeyPressed(UP, value);
    }

    if ([40, 83].includes(e.which)) {
      setKeyPressed(DOWN, value);
    }

    if ([37, 65].includes(e.which)) {
      setKeyPressed(LEFT, value);
    }

    if ([39, 68].includes(e.which)) {
      setKeyPressed(RIGHT, value);
    }

    if (e.which === 32) {
      setKeyPressed(SPACE, value);
    }
  };

  window.onkeydown = window.onkeypress = (e) => evalKeyPress(e, true);
  window.onkeyup = (e) => evalKeyPress(e, false);
}

if (!keyboardIsObserved) {
  observeKeyboard();
  keyboardIsObserved = true;
}
