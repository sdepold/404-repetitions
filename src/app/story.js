import { renderText } from "./helper/text";
import { pc } from "./audio";

window.blockMovement = false;

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay * 1000);
  });
}

function renderDelayText(msg, { ttl = 1.5 } = {}) {
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
  await withoutMovement(async () => {
    confusePlayer(player);
    await renderDelayText("Ooof!?! Location not found!?!");
    await renderDelayText("Ooof!?! Where am I?");
  });

  await wait(2);

  await withoutMovement(async () => {
    confusePlayer(player);
    await renderDelayText("Hmm... Clothes not found!");
    await renderDelayText("Hmm... Why am I naked?!");
    await renderDelayText("I better head home!");
  });
}

export async function gettingDressedDialog() {
  await withoutMovement(async () => {
    await renderDelayText("Aaah. Better.");
    await renderDelayText("I feel the urge to exercise!");
    await renderDelayText("Off to the gym!");
  });
}

export async function nakedComplaint() {
  await renderDelayText("I am naked! Need my clothes!");
}

export async function firstLevelUp() {
  await withoutMovement(async () => {
    await renderDelayText("Oooh! Level up!");
    await renderDelayText("I can up my stats at home!");
  });
}

export async function levelUp() {
  await renderDelayText("Another level up!");
}

export async function competitionsUnlocked() {
  await withoutMovement(async () => {
    await renderDelayText("Yay! I reached level 4.04!");
    await renderDelayText("Let us join a competition ...", {
      ttl: 1.5,
    });
    await renderDelayText("... and improve my rank!");
  });
}

export async function ultimateGoal() {
  await renderDelayText("No idea why but ...");
  await renderDelayText("... I totally want to ...");
  await renderDelayText("... reach rank 404! Woop!");
}
