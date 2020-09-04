import { renderText } from "./helper/text";

window.blockMovement = false;

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay * 1000);
  });
}

function renderDelayText(msg, { ttl }) {
  renderText(msg, { ttl });
  return wait(ttl);
}

function confusePlayer(player) {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      player.container.classList.toggle("inverse");
      zzfx(...[, 0.1, 75, 0.03, 0.08, 0.17, 1, 1.88, 7.83, , , , , 0.4]);
    }, i * 1000);
  }
}

export async function initDialog(player) {
  if (location.href.includes("skipStory")) {
    return;
  }

  window.blockMovement = true;
  confusePlayer(player);
  await renderDelayText("Ooof!?! Location not found!?!", { ttl: 2 });
  await renderDelayText("Ooof!?! Where am I?", { ttl: 2 });
  window.blockMovement = false;

  setTimeout(async () => {
    window.blockMovement = true;
    confusePlayer(player);
    await renderDelayText("Hmm... Clothes not found!", { ttl: 2 });
    await renderDelayText("Hmm... Why am I naked?!", { ttl: 2 });
    await renderDelayText("I better head home!", { ttl: 3 });
    window.blockMovement = false;
  }, 1500);
}

export async function gettingDressedDialog() {
  if (location.href.includes("skipStory")) {
    return;
  }

  window.blockMovement = true;
  await renderDelayText("Aaah. Better.", { ttl: 2 });
  await renderDelayText("I feel the urge to exercise!", { ttl: 2 });
  await renderDelayText("Off to the gym!", { ttl: 2 });
  window.blockMovement = false;
}

export async function nakedComplaint() {
  await renderDelayText("I am naked! Need my clothes!", { ttl: 2 });
}
