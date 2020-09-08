export function collides(node1, node2) {
  const rect1 = node1.getBoundingClientRect();
  const rect2 = node2.getBoundingClientRect();

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

export function containsHorizontally(node1, node2) {
  const rect1 = node1.getBoundingClientRect();
  const rect2 = node2.getBoundingClientRect();

  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x < rect2.x &&
    rect1.x + rect1.width > rect2.x &&
    rect1.x + rect1.width > rect2.x + rect2.width
  );
}

export function rightOf(node1, node2) {
  const rect1 = node1.getBoundingClientRect();
  const rect2 = node2.getBoundingClientRect();

  return rect1.x + rect1.width < rect2.x;
}
