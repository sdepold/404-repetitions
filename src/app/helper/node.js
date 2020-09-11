export function destroyNode(node) {
  node.parentNode && node.parentNode.removeChild(node);
}

export function createElement(thing) {
  return document.createElement(thing);
}