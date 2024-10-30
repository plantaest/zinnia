import { useEffect } from 'react';

export function useToolStyles(styles?: string) {
  useEffect(() => {
    let styleNode: HTMLStyleElement;

    if (styles) {
      styleNode = document.createElement('style');
      styleNode.innerHTML = styles;
      document.head.appendChild(styleNode);
    }

    return () => {
      document.head.removeChild(styleNode);
    };
  }, []);
}
