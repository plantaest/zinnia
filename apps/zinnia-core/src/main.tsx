import ReactDOM from 'react-dom/client';
import { isMwEnv } from '@/utils/isMwEnv';
import { zinniaRoot } from '@/utils/zinniaRoot';
import App from './App';

if (process.env.NODE_ENV === 'development') {
  import('./document.css');
}

declare global {
  interface Window {
    zinniaShadowRoot: ShadowRoot;
  }
}

if (isMwEnv()) {
  let shadowRoot;

  if (process.env.NODE_ENV === 'development') {
    const root = document.querySelector('.mw-body')!;
    root.replaceChildren();
    shadowRoot = root.attachShadow({ mode: 'open' });

    const map = new Map<Node, Node>();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'childList' &&
          map.has(mutation.target) &&
          mutation.target.textContent !== ''
        ) {
          const styleClone = map.get(mutation.target);
          styleClone!.textContent = mutation.target.textContent;
          mutation.target.textContent = '';
        }
      }
    });

    const styleElements = document.querySelectorAll(
      'style[data-vite-dev-id]:not([data-vite-dev-id*="document.css"])'
    );

    for (const styleElement of styleElements) {
      const styleClone = styleElement.cloneNode(true);
      map.set(styleElement, styleClone);
      styleElement.textContent = '';
      observer.observe(styleElement, {
        childList: true,
        subtree: true,
      });
    }

    shadowRoot.prepend(...map.values());
  } else {
    shadowRoot = window.zinniaShadowRoot;
  }

  shadowRoot.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App shadowRoot={shadowRoot} />);
} else {
  const root = document.querySelector('.mw-body')!;
  root.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App />);
}
