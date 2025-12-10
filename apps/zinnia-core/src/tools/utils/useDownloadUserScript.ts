import { useEffect, useState } from 'react';
import { useSelector } from '@legendapp/state/react';
import { defaultSandboxGlobals, zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { appState } from '@/states/appState';
import { CURRENT_WIKI, ExtendedToolConfig, ExtendedToolMetadata } from '@/tools/types/ExtendedTool';
import { getCachedMwInstance } from '@/tools/utils/getCachedMwInstance';
import { useGetUserScriptSource } from '@/tools/utils/useGetUserScriptSource';

interface Options {
  toolMetadata: ExtendedToolMetadata;
  toolConfig: ExtendedToolConfig;
}

export function useDownloadUserScript({ toolMetadata, toolConfig }: Options) {
  const firstPageContextChange = useSelector(appState.ui.firstPageContextChange);
  const executeFunctions = useSelector(appState.ui.extendedToolExecuteFunctions);
  const [firstExecuted, setFirstExecuted] = useState(executeFunctions.has(toolMetadata.id));

  const { data: source, isSuccess } = useGetUserScriptSource(
    toolConfig.source.server,
    toolConfig.source.page
  );

  useEffect(() => {
    if (firstPageContextChange && !firstExecuted && isSuccess) {
      // Create script content
      const modifiedSource = source
        .replaceAll('document.location.reload', 'location.reload')
        .replaceAll('window.location.reload', 'location.reload');
      const scriptContent = `(({ ${Object.keys(defaultSandboxGlobals).join(', ')} }) => {

${modifiedSource}

})(window.zinniaSandbox.globals.get('${toolMetadata.id}'))`;

      // Create execute function
      const executeFunction = new Function(scriptContent);
      executeFunctions.set(toolMetadata.id, executeFunction);

      // Create sandbox global objects for tool
      const sandboxGlobals = toolConfig.sandbox.syncedWikiContext
        ? {
            ...defaultSandboxGlobals,
            mw: getCachedMwInstance(appState.ui.pageContext.peek().wikiId),
          }
        : toolConfig.sandbox.initialWiki === CURRENT_WIKI
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
    }
  }, [firstPageContextChange, firstExecuted, isSuccess]);

  return { firstExecuted };
}
