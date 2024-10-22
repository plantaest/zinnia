import {
  IconArrowLeft,
  IconArrowRight,
  IconArrowsMinimize,
  IconHistory,
  IconX,
} from '@tabler/icons-react';
import { ActionIcon, Card, Flex, Group, Indicator, Text, useDirection } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import dayjs from 'dayjs';
import { TabType } from '@/types/persistence/Tab';
import classes from './TabHeaderPanel.module.css';
import { appState } from '@/states/appState';
import { NewTabPanel } from '@/components/NewTabPanel/NewTabPanel';
import { TabListPanel } from '@/components/TabListPanel/TabListPanel';
import { tabIcons } from '@/utils/tabIcons';
import { SyncTabsPanel } from '@/components/SyncTabsPanel/SyncTabsPanel';

export function TabHeaderPanel() {
  const { dir } = useDirection();
  const activeTabId = useSelector(appState.local.activeTab.id);
  const activeTabType = useSelector(appState.local.activeTab.type);
  const activeTabName = useSelector(appState.local.activeTab.name);

  const handleClickDeleteTabButton = () => {
    appState.local.activeTabs.set((tabs) => tabs.filter((tab) => tab.id !== activeTabId));

    const activeTabs = appState.local.activeTabs.peek();

    if (activeTabs.length > 0) {
      const closestUpdatedAtTab = activeTabs.reduce((prev, current) =>
        dayjs(current.updatedAt).isAfter(dayjs(prev.updatedAt)) ? current : prev
      );
      appState.local.activeTabId.set(closestUpdatedAtTab.id);
    } else {
      appState.local.activeTabId.set(null);
    }
  };

  const activeTagFragment = (tabType: TabType, tabName: string) => {
    const TabIcon = tabIcons[tabType];
    const isMainTab = tabType.startsWith('MAIN');

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
          {tabName}
        </Text>
        <ActionIcon size={16} color="red.5" variant="subtle" onClick={handleClickDeleteTabButton}>
          <IconX />
        </ActionIcon>
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
              <SyncTabsPanel />
            </Flex>
          </Flex>
        </Group>

        {activeTabType && activeTabName && activeTagFragment(activeTabType, activeTabName)}

        <Flex>
          <NewTabPanel />
          <Flex visibleFrom="md">
            <SyncTabsPanel />
          </Flex>
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
