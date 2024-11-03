import { useSelector } from '@legendapp/state/react';
import { useDownloadUserScript } from '@/tools/utils/useDownloadUserScript';
import { useToolUtils } from '@/tools/utils/useToolUtils';
import { appState } from '@/states/appState';
import { Notice } from '@/utils/Notice';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';
import { useToolStyles } from '@/tools/utils/useToolStyles';
import { ExtendedToolComponentProps } from '@/tools/types/ExtendedTool';
import { defaultPageContext } from '@/tools/types/PageContext';

export function DefaultExtendedToolComponent({
  metadata,
  config,
  children,
}: ExtendedToolComponentProps) {
  const { allowedSitesMessage, allowedWikisMessage, allowedTabsMessage, notAllowedPagesMessage } =
    useToolUtils('extended', metadata);

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
    if (
      config.restriction.allowedSites.length > 0 &&
      !config.restriction.allowedSites.includes(defaultPageContext.wikiId)
    ) {
      Notice.info(allowedSitesMessage(config.restriction.allowedSites));
      return;
    }

    if (
      config.restriction.allowedWikis.length > 0 &&
      !config.restriction.allowedWikis.includes(pageContext.wikiId)
    ) {
      Notice.info(allowedWikisMessage(config.restriction.allowedWikis));
      return;
    }

    if (
      pageContext.environment === 'zinnia' &&
      config.restriction.allowedTabs.length > 0 &&
      (!activeTab || !config.restriction.allowedTabs.includes(activeTab.type))
    ) {
      Notice.info(allowedTabsMessage(config.restriction.allowedTabs));
      return;
    }

    if (config.restriction.allowedPages && !config.restriction.allowedPages(pageContext)) {
      Notice.info(notAllowedPagesMessage());
      return;
    }

    run();
  };

  return children({ trigger });
}
