import { ActionIcon, Box, Flex, Group, Text } from '@mantine/core';
import { IconFocus, IconReload } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { memo, useEffect, useState } from 'react';
import { useNetwork } from '@mantine/hooks';
import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';
import { useGetRecentChanges } from '@/queries/useGetRecentChanges';
import classes from './FeedControlPanel.module.css';

function _FeedControlPanel() {
  const { t } = useTranslation();
  const { online } = useNetwork();
  const { data: recentChanges = [], refetch, isRefetching, isError } = useGetRecentChanges();
  const focus = useSelector(appState.ui.focus);
  const feed = useSelector(appState.ui.activeFilter.feed);

  // Live updates
  const isLiveUpdates = feed?.liveUpdates ?? false;
  const interval = feed?.interval ?? 0;

  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    if (!intervalId && isLiveUpdates) {
      const id = setInterval(() => refetch(), interval * 1000);
      setIntervalId(id as unknown as number);
    }

    if (intervalId && !isLiveUpdates) {
      clearInterval(intervalId);
      setIntervalId(null);
    }

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [isLiveUpdates]);

  useEffect(() => {
    if (intervalId && isLiveUpdates && interval !== 0) {
      clearInterval(intervalId);
      const id = setInterval(() => refetch(), interval * 1000);
      setIntervalId(id as unknown as number);
    }

    return () => {
      intervalId && clearInterval(intervalId);
    };
  }, [interval]);

  const handleClickReloadButton = () => refetch();

  const handleClickFocusButton = () => {
    appState.ui.focus.set((prev) => !prev);
  };

  return (
    <Group className={classes.control} data-sticky={recentChanges.length > 0} data-focus={focus}>
      <Group gap="sm">
        <Box className={classes.pulse} data-online={online} />
        <Text size="sm" fw={500}>
          {t(online ? 'core:ui.feedPanel.connected' : 'core:ui.feedPanel.disconnected')}
        </Text>
      </Group>

      <Flex>
        <ActionIcon
          variant="subtle"
          size={30}
          color={isError ? 'pink.5' : isLiveUpdates ? 'teal' : 'blue'}
          loading={isRefetching}
          loaderProps={{ size: 14 }}
          onClick={handleClickReloadButton}
          title={t('core:ui.feedPanel.reload')}
          aria-label={t('core:ui.feedPanel.reload')}
        >
          <IconReload size="1.125rem" />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size={30}
          color={focus ? 'teal' : 'blue'}
          onClick={handleClickFocusButton}
          title={t('core:ui.feedPanel.focus')}
          aria-label={t('core:ui.feedPanel.focus')}
          visibleFrom="md"
        >
          <IconFocus size="1.125rem" />
        </ActionIcon>
      </Flex>
    </Group>
  );
}

export const FeedControlPanel = memo(_FeedControlPanel);
