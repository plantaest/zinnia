import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { TabType, tabTypeMessages } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';

export function useToolUtils() {
  const { formatMessage } = useIntl();
  const listFormat = useSelector(appState.instance.listFormat);

  const allowedTabsMessage = (allowedTabs: TabType[]) =>
    `${formatMessage(
      { id: 'tool.message.allowedTabs' },
      { toolName: formatMessage({ id: 'tool.native.mark.name' }) }
    )} ${listFormat.format(
      allowedTabs.map((tabType) => formatMessage({ id: tabTypeMessages[tabType] }))
    )}`;

  return {
    allowedTabsMessage,
  };
}
