import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { defaultSandboxGlobals, zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { appState } from '@/states/appState';
import { CURRENT_WIKI, ExtendedToolConfig } from '@/tools/types/ExtendedTool';
import { getCachedMwInstance } from '@/tools/utils/getCachedMwInstance';

interface Options {
  toolId: string;
  server: string;
  page: string;
  sandboxInitialServer: ExtendedToolConfig['sandbox']['initialServer'];
}

export function useDownloadUserScript({ toolId, server, page, sandboxInitialServer }: Options) {
  const executeFunctions = useSelector(appState.ui.extendedToolExecuteFunctions);

  useEffect(() => {
    if (!executeFunctions.has(toolId)) {
      // TODO: Refactor to React Query
      fetch(`https://${server}/w/rest.php/v1/page/${encodeURIComponent(page)}`)
        .then((response) => response.json())
        .then((pageInfo) => {
          // Create script content
          const scriptContent = `(({ ${Object.keys(defaultSandboxGlobals).join(
            ', '
          )} }) => {\n\n${pageInfo.source}\n\n})(window.zinniaSandbox.globals.get('${toolId}'))`;

          // Create execute function
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const executeFunction = new Function(scriptContent);
          executeFunctions.set(toolId, executeFunction);

          // Create sandbox global objects for tool
          const sandboxGlobals =
            sandboxInitialServer === CURRENT_WIKI
              ? { ...defaultSandboxGlobals }
              : {
                  ...defaultSandboxGlobals,
                  mw: getCachedMwInstance(sandboxInitialServer),
                };
          zinniaSandbox.globals.set(toolId, sandboxGlobals);

          // Execute
          executeFunction();
        });
    }
  }, []);
}
