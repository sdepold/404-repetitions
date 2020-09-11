import { renderText } from "./helper/text";
import { pc } from "./audio";

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
      pc();
    }, i * 1000);
  }
}

async function withoutMovement(fun) {
  window.blockMovement = true;
  await fun();
  window.blockMovement = false;
}

export async function initDialog(player) {
  if (location.href.includes("skipStory")) {
    return;
  }

  await withoutMovement(async () => {
    confusePlayer(player);
    await renderDelayText("Ooof!?! Location not found!?!", { ttl: 2 });
    await renderDelayText("Ooof!?! Where am I?", { ttl: 2 });
  });

  await wait(1500);

  await withoutMovement(async () => {
    confusePlayer(player);
    await renderDelayText("Hmm... Clothes not found!", { ttl: 2 });
    await renderDelayText("Hmm... Why am I naked?!", { ttl: 2 });
    await renderDelayText("I better head home!", { ttl: 3 });
  });
}

export async function gettingDressedDialog() {
  if (location.href.includes("skipStory")) {
    return;
  }

  await withoutMovement(async () => {
    await renderDelayText("Aaah. Better.", { ttl: 2 });
    await renderDelayText("I feel the urge to exercise!", { ttl: 2 });
    await renderDelayText("Off to the gym!", { ttl: 2 });
  });
}

export async function nakedComplaint() {
  await renderDelayText("I am naked! Need my clothes!", { ttl: 2 });
}

export async function firstLevelUp() {
  await withoutMovement(async () => {
    await renderDelayText("Oooh! Level up!", { ttl: 2 });
    await renderDelayText("I can up my stats at home!", { ttl: 2 });
  });
}

export async function levelUp() {
  await renderDelayText("Another level up!", { ttl: 2 });
}

export async function competitionsUnlocked() {
  await withoutMovement(async () => {
    await renderDelayText("Yay! I reached level 4.04!", { ttl: 2 });
    await renderDelayText("I can now join competitions...", {
      ttl: 2,
    });
    await renderDelayText("... and improve my rank!", { ttl: 2 });
  });
}
