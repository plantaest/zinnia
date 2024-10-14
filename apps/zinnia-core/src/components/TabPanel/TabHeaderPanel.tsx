import {
  IconAlignJustified,
  IconArrowLeft,
  IconArrowRight,
  IconArrowsMinimize,
  IconChevronDown,
  IconFile,
  IconHistory,
  IconLayoutColumns,
  IconPhoto,
  IconRefresh,
  IconSeeding,
  IconUser,
} from '@tabler/icons-react';
import { ActionIcon, Card, Flex, Group, Indicator, Text, useDirection } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import { Tab, TabType } from '@/types/persistence/Tab';
import { TablerIcon } from '@/types/lib/TablerIcon';
import classes from './TabHeaderPanel.module.css';
import { appState } from '@/states/appState';
import { NewTabPanel } from '@/components/NewTabPanel/NewTabPanel';

const tabIcons: Record<TabType, TablerIcon> = {
  [TabType.WELCOME]: IconSeeding,
  [TabType.DIFF]: IconLayoutColumns,
  [TabType.MAIN_DIFF]: IconLayoutColumns,
  [TabType.READ]: IconAlignJustified,
  [TabType.MAIN_READ]: IconAlignJustified,
  [TabType.FILE]: IconPhoto,
  [TabType.MAIN_FILE]: IconPhoto,
  [TabType.PAGE]: IconFile,
  [TabType.USER]: IconUser,
};

export function TabHeaderPanel() {
  const { dir } = useDirection();
  const activeTab = useSelector(appState.local.activeTab);

  const activeTagFragment = (tab: Tab) => {
    const TabIcon = tabIcons[tab.type];
    const isMainTab = [TabType.MAIN_DIFF, TabType.MAIN_READ, TabType.MAIN_FILE].includes(tab.type);

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
            <ActionIcon variant="subtle" size={30} hiddenFrom="md">
              <IconChevronDown size="1.125rem" />
            </ActionIcon>
          </Flex>
        </Group>

        {activeTab && activeTagFragment(activeTab)}

        <Flex>
          <NewTabPanel />
          <ActionIcon variant="subtle" size={30} visibleFrom="md">
            <IconRefresh size="1.125rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" size={30} visibleFrom="md">
            <IconChevronDown size="1.125rem" />
          </ActionIcon>
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
