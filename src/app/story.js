import { renderText } from "./helper/text";

function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay * 1000);
  });
}

function renderDelayText(msg, { ttl }) {
  renderText(msg, { ttl });
  return wait(ttl);
}

export async function initDialog() {
  await renderDelayText("Ooof!?! Location not found!?!", { ttl:3 });
  await renderDelayText("Ooof!?! Where am I?", { ttl: 3 });

  await wait(2);
  await renderDelayText("Hmm... Clothes not found!", { ttl: 3 });
  await renderDelayText("Hmm... Why am I naked?!", { ttl: 3 });
  await renderDelayText("I better head home!", { ttl: 5 });
}
