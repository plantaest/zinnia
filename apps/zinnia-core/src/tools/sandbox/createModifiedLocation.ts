import { Notice } from '@/utils/Notice';
import { i18n } from '@/i18n';

export function createModifiedLocation() {
  return {
    ...window.location,
    reload: () => Notice.info(i18n.getIntl().formatMessage({ id: 'tool.message.reloadDisabled' })),
  };
}
