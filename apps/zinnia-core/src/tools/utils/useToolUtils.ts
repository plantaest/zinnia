import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { TabType, tabTypeMessages } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';
import { ToolType } from '@/tools/types/ToolType';
import { NativeToolMetadata } from '@/tools/types/NativeTool';
import { ExtendedToolMetadata } from '@/tools/types/ExtendedTool';

export function useToolUtils(
  toolType: ToolType,
  toolMetadata: NativeToolMetadata | ExtendedToolMetadata
) {
  const { formatMessage } = useIntl();
  const listFormat = useSelector(appState.instance.listFormat);
  const userConfigTools = useSelector(appState.userConfig.tools);

  const getAdditionalSettings = <T>(defaultValues: T): T => {
    const toolUserConfig = userConfigTools.native.find((tool) => tool.toolId === toolMetadata.id);
    const userAdditionalSettings: Partial<T> = toolUserConfig
      ? (toolUserConfig.settings.additional.data as Partial<T>)
      : {};
    return {
      ...defaultValues,
      ...userAdditionalSettings,
    };
  };

  const allowedTabsMessage = (allowedTabs: TabType[]) =>
    `${formatMessage(
      { id: 'tool.message.allowedTabs' },
      {
        toolName:
          toolType === 'native' ? formatMessage({ id: toolMetadata.name }) : toolMetadata.name,
      }
    )} ${listFormat.format(
      allowedTabs.map((tabType) => formatMessage({ id: tabTypeMessages[tabType] }))
    )}`;

  return {
    getAdditionalSettings,
    allowedTabsMessage,
  };
}
