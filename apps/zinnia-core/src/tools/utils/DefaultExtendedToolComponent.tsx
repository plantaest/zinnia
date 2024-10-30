import { ExtendedToolComponentProps } from '@/tools/types/ZinniaTool';
import { useDownloadUserScript } from '@/tools/utils/useDownloadUserScript';

export function DefaultExtendedToolComponent({
  metadata,
  config,
  children,
}: ExtendedToolComponentProps) {
  useDownloadUserScript(metadata.id, config.source.server, config.source.page);

  const trigger = () => {
    if (config.sandboxTargetSelector) {
      const sandboxTargetNode: HTMLElement | null = document.querySelector(
        config.sandboxTargetSelector
      );

      if (sandboxTargetNode) {
        sandboxTargetNode.click();
      }
    }
  };

  return children({ trigger });
}
