import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { appState } from '@/states/appState';

export function useDownloadUserScript(toolId: string, server: string, page: string) {
  const executeFunctions = useSelector(appState.ui.extendedToolExecuteFunctions);

  useEffect(() => {
    if (!executeFunctions.has(toolId)) {
      fetch(`https://${server}/w/rest.php/v1/page/${encodeURIComponent(page)}`)
        .then((response) => response.json())
        .then((pageInfo) => {
          const scriptContent = `(({ ${Object.keys(zinniaSandbox).join(
            ', '
          )} }) => {\n\n${pageInfo.source}\n\n})(window.zinniaSandbox)`;

          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const executeFunction = new Function(scriptContent);
          executeFunctions.set(toolId, executeFunction);

          // Execute
          executeFunction();
        });
    }
  }, []);
}
