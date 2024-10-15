import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowsMinimize,
  IconHistory,
} from '@tabler/icons-react';
import { ActionIcon, Card, Flex, Group, Indicator, Text, useDirection } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import { Tab } from '@/types/persistence/Tab';
import classes from './TabHeaderPanel.module.css';
import { appState } from '@/states/appState';
import { NewTabPanel } from '@/components/NewTabPanel/NewTabPanel';
import { TabListPanel } from '@/components/TabListPanel/TabListPanel';
import { tabIcons } from '@/utils/tabIcons';
import { SyncTabsPanel } from '@/components/SyncTabsPanel/SyncTabsPanel';

export function TabHeaderPanel() {
  const { dir } = useDirection();
  const activeTab = useSelector(appState.local.activeTab);

  const activeTagFragment = (tab: Tab) => {
    const TabIcon = tabIcons[tab.type];
    const isMainTab = tab.type.startsWith('MAIN');

    return (
      <Group
        gap="xs"
        wrap="nowrap"
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Indicator
          color="green"
          size={5}
          disabled={!isMainTab}
          display="flex"
          position={dir === 'rtl' ? 'top-start' : 'top-end'}
        >
          <TabIcon size="1.125rem" />
        </Indicator>
        <Text
          fw={600}
          style={{
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {tab.name}
        </Text>
      </Group>
    );
  };

  const handleClickHideTabPanelDrawerButton = () => appState.ui.showTabPanelDrawer.set(false);

  return (
    <Card px="xs" py="xs" className={classes.wrapper}>
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Flex>
            <ActionIcon variant="subtle" size={30} visibleFrom="md">
              <IconArrowLeft size="1.125rem" />
            </ActionIcon>
            <ActionIcon variant="subtle" size={30} visibleFrom="md">
              <IconArrowRight size="1.125rem" />
            </ActionIcon>
            <ActionIcon variant="subtle" size={30} visibleFrom="md">
              <IconHistory size="1.125rem" />
            </ActionIcon>
            <Flex hiddenFrom="md">
              <TabListPanel />
            </Flex>
          </Flex>
        </Group>

        {activeTab && activeTagFragment(activeTab)}

        <Flex>
          <NewTabPanel />
          <SyncTabsPanel />
          <Flex visibleFrom="md">
            <TabListPanel />
          </Flex>
          <ActionIcon
            variant="subtle"
            color="teal"
            size={30}
            hiddenFrom="md"
            onClick={handleClickHideTabPanelDrawerButton}
          >
            <IconArrowsMinimize size="1.125rem" />
          </ActionIcon>
        </Flex>
      </Group>
    </Card>
  );
}
