import { Button, Flex, Text, useDirection } from '@mantine/core';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { useState } from 'react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { onMediaWiki } from '@/utils/onMediaWiki';
import { Tab, TabType } from '@/types/persistence/Tab';
import { useSaveOption } from '@/queries/useSaveOption';
import { appState } from '@/states/appState';
import { appConfig } from '@/config/appConfig';
import { versionMap } from '@/utils/migration/versionMap';
import { defaultFilterFeedConfig, defaultFilterGlobalWikiConfig } from '@/types/persistence/Filter';
import { defaultUserNativeTools } from '@/types/persistence/Tool';

export function StartStateContent() {
  const { formatMessage, locale } = useIntl();
  const { dir } = useDirection();
  const saveOptionApi = useSaveOption();
  const [loading, setLoading] = useState(false);

  const handleClickStartButton = () => {
    const userConfigId = uuidv4();
    const workspaceId = uuidv4();
    const filterId = uuidv4();
    const tabId = uuidv4();
    const now = dayjs().toISOString();

    const welcomeTab: Tab = {
      id: tabId,
      createdAt: now,
      updatedAt: now,
      name: formatMessage({ id: 'common.welcome' }),
      type: TabType.WELCOME,
      data: null,
    };

    const defaultUserConfig: UserConfig = {
      id: userConfigId,
      createdAt: now,
      updatedAt: now,
      appVersion: appConfig.VERSION,
      schemaVersion: versionMap[appConfig.VERSION],
      colorScheme: 'auto',
      language: locale,
      locale: locale, // TODO: Should use `navigator`?
      dir,
      workspaces: [
        {
          id: workspaceId,
          createdAt: now,
          updatedAt: now,
          name: formatMessage({ id: 'common.default' }),
          filters: [
            {
              id: filterId,
              createdAt: now,
              updatedAt: now,
              name: formatMessage({ id: 'common.default' }),
              feed: defaultFilterFeedConfig,
              wikis: [
                defaultFilterGlobalWikiConfig,
                {
                  wikiId: onMediaWiki() ? mw.config.get('wgWikiID') : 'metawiki',
                  inherited: true,
                  config: null,
                },
              ],
            },
          ],
          activeFilterId: filterId,
          tabs: [welcomeTab],
          activeTabId: tabId,
        },
      ],
      activeWorkspaceId: workspaceId,
      advancedMode: false,
      tools: {
        native: defaultUserNativeTools(now),
        extended: [],
      },
    };

    setLoading(true);
    saveOptionApi.mutate(
      {
        name: appConfig.USER_CONFIG_OPTION_KEY,
        value: JSON.stringify(defaultUserConfig),
      },
      {
        onSuccess: () => {
          appState.userConfig.set(defaultUserConfig);
          appState.ui.initState.set('normal');
          appState.local.tabs.set({
            [workspaceId]: {
              tabs: [welcomeTab],
              activeTabId: welcomeTab.id,
            },
          });
        },
        onError: () => setLoading(false),
      }
    );
  };

  return (
    <Flex
      direction="column"
      gap="lg"
      justify="center"
      align="center"
      h="95%"
      px={{ base: 0, sm: '1rem', md: '2rem' }}
    >
      <Text fz={{ base: 25, sm: 30, md: 35 }} fw={600} ta="center">
        {formatMessage({ id: 'ui.heroPanel.startStateContent.firstLine' })}
      </Text>
      <Text fz={{ base: 18, sm: 22, md: 25 }} ta="center">
        {formatMessage({ id: 'ui.heroPanel.startStateContent.secondLine' })}
      </Text>
      <Button size="lg" mt="md" loading={loading} onClick={handleClickStartButton}>
        {formatMessage({ id: 'ui.heroPanel.startStateContent.start' })}
      </Button>
    </Flex>
  );
}
