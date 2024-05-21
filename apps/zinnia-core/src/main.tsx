import ReactDOM from 'react-dom/client';
import { isMwEnv } from '@/utils/isMwEnv';
import { zinniaRoot } from '@/utils/zinniaRoot';
import App from './App';
import { serverUri } from '@/utils/serverUri';

const root = document.querySelector('.mw-body')!;

if (isMwEnv()) {
  const shadowRoot = root.attachShadow({ mode: 'open' });

  if (process.env.NODE_ENV === 'development') {
    const styleElements = document.querySelectorAll('style[data-vite-dev-id]');
    const styleClones: Node[] = [];

    for (const styleElement of styleElements) {
      styleElement.remove();
      styleClones.push(styleElement.cloneNode(true));
    }

    shadowRoot.prepend(...styleClones);
  }

  if (process.env.NODE_ENV === 'production') {
    const createStyleLinkNode = (name: string) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = serverUri(name);
      shadowRoot.prepend(link);
    };

    ['assets/index.css'].forEach(createStyleLinkNode);
  }

  shadowRoot.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App shadowRoot={shadowRoot} />);
} else {
  root.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App />);
}
