import ReactDOM from 'react-dom/client';
import { isMwEnv } from '@/utils/isMwEnv';
import { zinniaRoot } from '@/utils/zinniaRoot';
import App from './App';
import { serverUri } from '@/utils/serverUri';

const root = document.querySelector('.mw-body')!;

if (isMwEnv()) {
  root.replaceChildren();
  const shadowRoot = root.attachShadow({ mode: 'open' });

  if (process.env.NODE_ENV === 'development') {
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
  }

  if (process.env.NODE_ENV === 'production') {
    const createStyleLinkNode = (name: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = serverUri(name);
      return link;
    };

    shadowRoot.prepend(...['assets/mantine.css', 'assets/index.css'].map(createStyleLinkNode));
  }

  shadowRoot.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App shadowRoot={shadowRoot} />);
} else {
  root.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App />);
}
