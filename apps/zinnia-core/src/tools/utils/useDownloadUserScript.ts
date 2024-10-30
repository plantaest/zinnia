import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';
import { appState } from '@/states/appState';

const attachScript = (scriptContent: string) => {
  const blob = new Blob([scriptContent], { type: 'application/javascript' });
  const blobUrl = URL.createObjectURL(blob);

  const scriptElement = document.createElement('script');
  scriptElement.src = blobUrl;
  scriptElement.onload = () => {
    URL.revokeObjectURL(blobUrl);
    scriptElement.remove();
  };

  zinniaSandboxRoot.appendChild(scriptElement);

  return blobUrl;
};

export function useDownloadUserScript(toolId: string, server: string, page: string) {
  const downloadUserScripts = useSelector(appState.ui.downloadedUserScripts);

  useEffect(() => {
    if (!downloadUserScripts.has(toolId)) {
      fetch(`https://${server}/w/rest.php/v1/page/${encodeURIComponent(page)}`)
        .then((response) => response.json())
        .then((pageInfo) => {
          const scriptContent = `(({ ${Object.keys(zinniaSandbox).join(
            ', '
          )} }) => {\n\n${pageInfo.source}\n\n})(window.zinniaSandbox)`;
          const blobUrl = attachScript(scriptContent);
          downloadUserScripts.set(toolId, blobUrl);
        });
    }
  }, []);
}
