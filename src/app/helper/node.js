export function destroyNode(node) {
  node.parentNode && node.parentNode.removeChild(node);
}
