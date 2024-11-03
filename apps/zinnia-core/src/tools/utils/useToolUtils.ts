import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { TabType, tabTypeMessages } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';
import { ToolType } from '@/tools/types/ToolType';
import { NativeToolMetadata } from '@/tools/types/NativeTool';
import { ExtendedTool, ExtendedToolMetadata } from '@/tools/types/ExtendedTool';
import { WikiId } from '@/types/mw/WikiId';
import { Notice } from '@/utils/Notice';
import { defaultPageContext } from '@/tools/types/PageContext';

export function useToolUtils(
  toolType: ToolType,
  toolMetadata: NativeToolMetadata | ExtendedToolMetadata
) {
  const { formatMessage } = useIntl();
  const listFormat = useSelector(appState.instance.listFormat);
  const userConfigTools = useSelector(appState.userConfig.tools);
  const pageContext = useSelector(appState.ui.pageContext);
  const activeTab = useSelector(appState.ui.activeTab);

  const toolName =
    toolType === 'native' ? formatMessage({ id: toolMetadata.name }) : toolMetadata.name;

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

  const allowedSitesMessage = (allowedSites: WikiId[]) =>
    `${formatMessage({ id: 'tool.message.allowedSites' }, { toolName })} ${listFormat.format(allowedSites)}`;

  const allowedWikisMessage = (allowedWikis: WikiId[]) =>
    `${formatMessage({ id: 'tool.message.allowedWikis' }, { toolName })} ${listFormat.format(allowedWikis)}`;

  const allowedTabsMessage = (allowedTabs: TabType[]) =>
    `${formatMessage({ id: 'tool.message.allowedTabs' }, { toolName })} ${listFormat.format(
      allowedTabs.map((tabType) => formatMessage({ id: tabTypeMessages[tabType] }))
    )}`;

  const notAllowedPagesMessage = () =>
    formatMessage({ id: 'tool.message.notAllowedPages' }, { toolName });

  const isAllowedSites = (allowedSites: WikiId[]) => {
    if (allowedSites.length > 0 && !allowedSites.includes(defaultPageContext.wikiId)) {
      Notice.info(allowedSitesMessage(allowedSites));
      return false;
    }

    return true;
  };

  const isAllowedWikis = (allowedWikis: WikiId[]) => {
    if (allowedWikis.length > 0 && !allowedWikis.includes(pageContext.wikiId)) {
      Notice.info(allowedWikisMessage(allowedWikis));
      return false;
    }

    return true;
  };

  const isAllowedTabs = (allowedTabs: TabType[]) => {
    if (
      pageContext.environment === 'zinnia' &&
      allowedTabs.length > 0 &&
      (!activeTab || !allowedTabs.includes(activeTab.type))
    ) {
      Notice.info(allowedTabsMessage(allowedTabs));
      return false;
    }

    return true;
  };

  const isAllowedPages = (allowedPages: ExtendedTool['config']['restriction']['allowedPages']) => {
    if (allowedPages && !allowedPages(pageContext)) {
      Notice.info(notAllowedPagesMessage());
      return false;
    }

    return true;
  };

  return {
    getAdditionalSettings,
    allowedSitesMessage,
    allowedWikisMessage,
    allowedTabsMessage,
    notAllowedPagesMessage,
    isAllowedSites,
    isAllowedWikis,
    isAllowedTabs,
    isAllowedPages,
  };
}
