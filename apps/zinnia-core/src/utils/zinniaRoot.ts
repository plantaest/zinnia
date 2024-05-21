export const zinniaRoot = document.createElement('div');
zinniaRoot.className = 'zinnia-root';
zinniaRoot.dir = 'ltr';

// Make useClickOutside works correctly
// Refs:
// * https://github.com/mantinedev/mantine/blob/master/packages/%40mantine/hooks/src/use-click-outside/use-click-outside.ts#L18
// * https://terodox.tech/how-to-tell-if-an-element-is-in-the-dom-including-the-shadow-dom/
document.body.contains = (element: Node | null): boolean => {
  let currentElement = element;
  while (currentElement && currentElement.parentNode) {
    if (currentElement.parentNode === document.body) {
      return true;
    }
    if (currentElement.parentNode instanceof ShadowRoot) {
      currentElement = currentElement.parentNode.host;
    } else {
      currentElement = currentElement.parentNode;
    }
  }
  return false;
};
