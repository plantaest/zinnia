import {
  IconAlignJustified,
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconHistory,
  IconHourglassLow,
  IconLayoutColumns,
  IconPhoto,
  IconPlus,
  IconRefresh,
  IconSeeding,
  IconUserSearch,
  IconX,
} from '@tabler/icons-react';
import { ActionIcon, Card, Flex, Group, Indicator, rem, Tabs, useDirection } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import React, { useEffect, useRef, useState } from 'react';
import { TabType } from '@/types/persistence/Tab';
import { TablerIcon } from '@/types/lib/TablerIcon';
import classes from './TabHeaderPanel.module.css';
import { appState } from '@/states/appState';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';

const tabIcons: Record<TabType, TablerIcon> = {
  [TabType.WELCOME]: IconSeeding,
  [TabType.DIFF]: IconLayoutColumns,
  [TabType.MAIN_DIFF]: IconLayoutColumns,
  [TabType.READ]: IconAlignJustified,
  [TabType.MAIN_READ]: IconAlignJustified,
  [TabType.FILE]: IconPhoto,
  [TabType.MAIN_FILE]: IconPhoto,
  [TabType.PAGE_HISTORY]: IconHourglassLow,
  [TabType.USER_CONTRIBUTIONS]: IconUserSearch,
};

export function TabHeaderPanel() {
  const { dir } = useDirection();
  const tabs = appState.local.activeTabs.get();
  const activeTabId = appState.local.activeTabId.get();

  const handleClickTab = (tabId: string | null) => {
    appState.local.activeTabId.set(tabId);
    scrollToTopTabMainPanel();
  };

  const handleClickDeleteTabButton = (event: React.MouseEvent<HTMLDivElement>, tabId: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (tabId === activeTabId) {
      appState.local.activeTabId.set(null);
    }
    appState.local.activeTabs.set(
      appState.local.activeTabs.get().filter((tab) => tab.id !== tabId)
    );
  };

  const tabFragments = tabs.map((tab) => {
    const TabIcon = tabIcons[tab.type];

    const isMainTab = [TabType.MAIN_DIFF, TabType.MAIN_READ, TabType.MAIN_FILE].includes(tab.type);

    return (
      <Tabs.Tab
        key={tab.id}
        value={tab.id}
        leftSection={
          <Indicator
            color="green"
            size={5}
            disabled={!isMainTab}
            display="flex"
            position={dir === 'rtl' ? 'top-start' : 'top-end'}
          >
            <TabIcon size="1rem" />
          </Indicator>
        }
        rightSection={
          <ActionIcon
            component="div"
            size={16}
            color="red.5"
            variant="subtle"
            onClick={(event) => handleClickDeleteTabButton(event, tab.id)}
          >
            <IconX />
          </ActionIcon>
        }
      >
        {tab.name}
      </Tabs.Tab>
    );
  });

  const { ref: innerRef, width: innerWidth } = useElementSize();
  const tabsListWidth = innerWidth - 90 * 2 - 10;
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [headTail, setHeadTail] = useState<'head' | 'tail' | 'center' | 'none'>('none');

  useEffect(() => {
    const action = (event: Event) => {
      const target = event.target as HTMLElement;
      const sign = dir === 'rtl' ? -1 : 1;
      const isHead = target.scrollLeft * sign <= 0;
      const isTail = Math.ceil(target.offsetWidth + target.scrollLeft * sign) >= target.scrollWidth;
      setHeadTail(isHead ? 'head' : isTail ? 'tail' : 'center');
    };

    tabsListRef.current?.addEventListener('scroll', action);

    return () => tabsListRef.current?.removeEventListener('scroll', action);
  }, [dir, tabsListRef.current]);

  useEffect(() => {
    const target = tabsListRef.current;
    const sign = dir === 'rtl' ? -1 : 1;
    if (target) {
      const isHead = target.scrollLeft * sign <= 0;
      const isTail = Math.ceil(target.offsetWidth + target.scrollLeft * sign) >= target.scrollWidth;
      if (isHead) {
        if (target.scrollWidth <= tabsListWidth) {
          setHeadTail('none');
        } else {
          setHeadTail('head');
        }
      } else if (isTail) {
        setHeadTail('tail');
      } else {
        setHeadTail('center');
      }
    }
  }, [
    dir,
    tabsListRef.current?.scrollWidth,
    tabsListRef.current?.offsetWidth,
    tabsListRef.current?.scrollLeft,
    tabsListWidth,
    tabs.length,
  ]);

  return (
    <Card px="xs" py="xs" className={classes.wrapper}>
      <Group gap="xs" justify="space-between" wrap="nowrap" ref={innerRef}>
        <Group gap="xs" wrap="nowrap">
          <Flex>
            <ActionIcon variant="subtle" size={30}>
              <IconArrowLeft size="1.125rem" />
            </ActionIcon>
            <ActionIcon variant="subtle" size={30}>
              <IconArrowRight size="1.125rem" />
            </ActionIcon>
            <ActionIcon variant="subtle" size={30}>
              <IconHistory size="1.125rem" />
            </ActionIcon>
          </Flex>

          <Tabs
            variant="pills"
            classNames={{
              root: classes.tabsRoot,
              tab: classes.tabsTab,
              list: classes.tabsList,
            }}
            styles={{
              list: {
                maxWidth: rem(tabsListWidth),
              },
            }}
            value={activeTabId}
            onChange={handleClickTab}
          >
            <Tabs.List ref={tabsListRef} data-head-tail={headTail}>
              {tabFragments}
            </Tabs.List>
          </Tabs>
        </Group>

        <Flex>
          <ActionIcon variant="subtle" size={30}>
            <IconPlus size="1.125rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" size={30}>
            <IconRefresh size="1.125rem" />
          </ActionIcon>
          <ActionIcon variant="subtle" size={30}>
            <IconChevronDown size="1.125rem" />
          </ActionIcon>
        </Flex>
      </Group>
    </Card>
  );
}
