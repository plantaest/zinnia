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
  useDownloadUserScript(metadata.id, config.source.server, config.source.page);
  useToolStyles(config.styles);
  const activeTab = useSelector(appState.ui.activeTab);
  const { allowedTabsMessage } = useToolUtils();

  const run = () => {
    if (config.sandboxTargetSelector) {
      const sandboxTargetNode: HTMLElement | null = zinniaSandboxRoot.querySelector(
        config.sandboxTargetSelector
      );

      if (sandboxTargetNode) {
        sandboxTargetNode.click();
      }
    }
  };

  const trigger = () => {
    if (config.restriction.allowedTabs.length > 0) {
      if (activeTab && config.restriction.allowedTabs.includes(activeTab.type)) {
        run();
      } else {
        Notice.info(allowedTabsMessage(metadata.name, config.restriction.allowedTabs));
      }
    } else {
      run();
    }
  };

  return children({ trigger });
}
