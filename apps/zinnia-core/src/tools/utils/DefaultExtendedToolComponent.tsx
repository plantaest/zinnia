import { useSelector } from '@legendapp/state/react';
import { useDownloadUserScript } from '@/tools/utils/useDownloadUserScript';
import { useToolUtils } from '@/tools/utils/useToolUtils';
import { appState } from '@/states/appState';
import { Notice } from '@/utils/Notice';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';
import { useToolStyles } from '@/tools/utils/useToolStyles';
import { ExtendedToolComponentProps } from '@/tools/types/ExtendedTool';

export function DefaultExtendedToolComponent({
  metadata,
  config,
  children,
}: ExtendedToolComponentProps) {
  const { allowedTabsMessage } = useToolUtils('extended', metadata);

  useDownloadUserScript({
    toolId: metadata.id,
    server: config.source.server,
    page: config.source.page,
    sandboxInitialServer: config.sandbox.initialServer,
  });
  useToolStyles(config.sandbox.styles);

  const pageContext = useSelector(appState.ui.pageContext);
  const activeTab = useSelector(appState.ui.activeTab);

  const run = () => {
    if (config.sandbox.targetSelector) {
      const sandboxTargetNode: HTMLElement | null = zinniaSandboxRoot.querySelector(
        config.sandbox.targetSelector
      );

      if (sandboxTargetNode) {
        sandboxTargetNode.click();
      }
    }
  };

  const trigger = () => {
    if (pageContext.environment === 'zinnia') {
      if (config.restriction.allowedTabs.length > 0) {
        if (activeTab && config.restriction.allowedTabs.includes(activeTab.type)) {
          run();
        } else {
          Notice.info(allowedTabsMessage(config.restriction.allowedTabs));
        }
      } else {
        run();
      }
    }
  };

  return children({ trigger });
}
