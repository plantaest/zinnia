import { useEffect, useState } from 'react';
import { useSelector } from '@legendapp/state/react';
import { defaultSandboxGlobals, zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { appState } from '@/states/appState';
import { CURRENT_WIKI, ExtendedToolConfig, ExtendedToolMetadata } from '@/tools/types/ExtendedTool';
import { getCachedMwInstance } from '@/tools/utils/getCachedMwInstance';

interface Options {
  toolMetadata: ExtendedToolMetadata;
  toolConfig: ExtendedToolConfig;
}

export function useDownloadUserScript({ toolMetadata, toolConfig }: Options) {
  const executeFunctions = useSelector(appState.ui.extendedToolExecuteFunctions);
  const firstPageContextChange = useSelector(appState.ui.firstPageContextChange);
  const [firstExecuted, setFirstExecuted] = useState(executeFunctions.has(toolMetadata.id));

  useEffect(() => {
    if (firstPageContextChange && !executeFunctions.has(toolMetadata.id)) {
      // TODO: Refactor to React Query
      fetch(
        `https://${toolConfig.source.server}/w/rest.php/v1/page/${encodeURIComponent(toolConfig.source.page)}`
      )
        .then((response) => response.json())
        .then((pageInfo) => {
          // Create script content
          const modifiedSource = (pageInfo.source as string)
            .replaceAll('document.location.reload', 'location.reload')
            .replaceAll('window.location.reload', 'location.reload');
          const scriptContent = `(({ ${Object.keys(defaultSandboxGlobals).join(
            ', '
          )} }) => {\n\n${modifiedSource}\n\n})(window.zinniaSandbox.globals.get('${toolMetadata.id}'))`;

          // Create execute function
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const executeFunction = new Function(scriptContent);
          executeFunctions.set(toolMetadata.id, executeFunction);

          // Create sandbox global objects for tool
          const sandboxGlobals =
            toolConfig.sandbox.initialWiki === CURRENT_WIKI
              ? { ...defaultSandboxGlobals }
              : {
                  ...defaultSandboxGlobals,
                  mw: getCachedMwInstance(toolConfig.sandbox.initialWiki),
                };
          zinniaSandbox.globals.set(toolMetadata.id, sandboxGlobals);

          // Execute
          executeFunction();

          // Callback
          setFirstExecuted(true);
        });
    }
  }, [firstPageContextChange]);

  return { firstExecuted };
}
