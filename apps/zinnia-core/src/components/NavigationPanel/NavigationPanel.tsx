import { ActionIcon, Flex, Group, Popover, Stack } from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconHistory, IconSquareRounded } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import React, { useEffect, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useGetRecentChanges } from '@/queries/useGetRecentChanges';
import { ChangeCard } from '@/components/ChangeCard/ChangeCard';
import classes from './NavigationPanel.module.css';
import { selectedChangeRef } from '@/refs/selectedChangeRef';
import { TabListPanel } from '@/components/TabListPanel/TabListPanel';

interface NavigationPanelContentProps {
  onOpened: React.Dispatch<React.SetStateAction<boolean>>;
}

function NavigationPanelContent({ onOpened }: NavigationPanelContentProps) {
  const { data: recentChanges = [] } = useGetRecentChanges();
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedChangeRef.current) {
      scrollIntoView(selectedChangeRef.current, {
        behavior: 'instant',
        boundary: feedRef.current,
      });
    }
  }, []);

  const handleClickClosePopoverButton = () => {
    onOpened(false);
  };

  return (
    <Stack gap="xs">
      <Stack className={classes.feed} ref={feedRef}>
        {recentChanges.map((change, index) => (
          <ChangeCard key={index} change={change} index={index} />
        ))}
      </Stack>
      <Group gap="xs" justify="center" ps="xs">
        <Flex onClick={handleClickClosePopoverButton}>
          <TabListPanel />
        </Flex>
        <ActionIcon variant="subtle" size={30}>
          <IconArrowLeft size="1.125rem" />
        </ActionIcon>
        <ActionIcon variant="subtle" size={30}>
          <IconArrowRight size="1.125rem" />
        </ActionIcon>
        <ActionIcon variant="subtle" size={30}>
          <IconHistory size="1.125rem" />
        </ActionIcon>
      </Group>
    </Stack>
  );
}

export function NavigationPanel() {
  const { formatMessage } = useIntl();
  const [opened, setOpened] = useState(false);

  return (
    <Popover
      width="85vw"
      position="bottom"
      shadow="lg"
      radius="lg"
      trapFocus
      transitionProps={{ transition: 'pop', duration: 250 }}
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          color="teal"
          title={formatMessage({ id: 'ui.navigationPanel.title' })}
          aria-label={formatMessage({ id: 'ui.navigationPanel.title' })}
          onClick={() => setOpened(!opened)}
        >
          <IconSquareRounded size="1.5rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown className={classes.wrapper}>
        <NavigationPanelContent onOpened={setOpened} />
      </Popover.Dropdown>
    </Popover>
  );
}
