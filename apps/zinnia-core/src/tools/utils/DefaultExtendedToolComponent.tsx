import { useDownloadUserScript } from '@/tools/utils/useDownloadUserScript';
import { useToolUtils } from '@/tools/utils/useToolUtils';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';
import { useToolStyles } from '@/tools/utils/useToolStyles';
import { ExtendedToolComponentProps } from '@/tools/types/ExtendedTool';

export function DefaultExtendedToolComponent({
  metadata,
  config,
  children,
}: ExtendedToolComponentProps) {
  const { isAllowedSites, isAllowedWikis, isAllowedTabs, isAllowedPages } = useToolUtils(
    'extended',
    metadata
  );
  const { firstExecuted } = useDownloadUserScript({ toolMetadata: metadata, toolConfig: config });
  useToolStyles(config.sandbox.styles);

  const run = () => {
    if (config.sandbox.targetSelector) {
      const sandboxTargetNode: HTMLElement | null = zinniaSandboxRoot.querySelector(
        config.sandbox.targetSelector
      );

      if (sandboxTargetNode) {
        if (config.sandbox.openInNewTab) {
          const uri = sandboxTargetNode.getAttribute('href');
          uri && window.open(uri, '_blank');
        } else {
          sandboxTargetNode.click();
        }
      }
    }
  };

  const trigger = () => {
    if (
      isAllowedSites(config.restriction.allowedSites) &&
      isAllowedWikis(config.restriction.allowedWikis) &&
      isAllowedTabs(config.restriction.allowedTabs) &&
      isAllowedPages(config.restriction.allowedPages)
    ) {
      run();
    }
  };

  return children({ trigger, firstExecuted });
}
