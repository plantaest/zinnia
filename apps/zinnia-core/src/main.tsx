import ReactDOM from 'react-dom/client';
import { onMediaWiki } from '@/utils/onMediaWiki';
import { zinniaRoot } from '@/utils/zinniaRoot';
import App from '@/App';
import { createShadowRootWithSyncedStyles } from '@/utils/dev/createShadowRootWithSyncedStyles';
import { Sandbox } from '@/tools/sandbox/Sandbox';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';

if (process.env.NODE_ENV === 'development') {
  import('./document.css');
}

if (onMediaWiki()) {
  // Zinnia Core
  const shadowRoot =
    process.env.NODE_ENV === 'development'
      ? createShadowRootWithSyncedStyles()
      : window.zinniaShadowRoot;
  shadowRoot.appendChild(zinniaRoot);
  ReactDOM.createRoot(zinniaRoot).render(<App shadowRoot={shadowRoot} />);

  // Zinnia Sandbox
  ReactDOM.createRoot(zinniaSandboxRoot).render(<Sandbox />);
}
