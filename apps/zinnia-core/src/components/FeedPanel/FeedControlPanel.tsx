import { ActionIcon, Box, Flex, Group, Text } from '@mantine/core';
import { IconArrowsMaximize, IconFocus, IconPaperclip, IconReload } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useEffect, useState } from 'react';
import { useNetwork } from '@mantine/hooks';
import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';
import { useGetRecentChanges } from '@/queries/useGetRecentChanges';
import classes from './FeedControlPanel.module.css';

export function FeedControlPanel() {
  const { formatMessage } = useIntl();
  const { online } = useNetwork();
  const { data: recentChanges = [], refetch, isRefetching, isError } = useGetRecentChanges();
  const focus = useSelector(appState.ui.focus);
  const preview = useSelector(appState.ui.preview);
  const feed = useSelector(appState.ui.activeFilter.feed);
  const advancedMode = useSelector(appState.userConfig.advancedMode);

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

  const handleClickPreviewButton = () => appState.ui.preview.set((prev) => !prev);

  const handleClickFocusButton = () => appState.ui.focus.set((prev) => !prev);

  const handleClickShowTabPanelDrawerButton = () => appState.ui.showTabPanelDrawer.set(true);

  return (
    <Group className={classes.control} data-sticky={recentChanges.length > 0} data-focus={focus}>
      <Group gap="sm">
        <Box className={classes.pulse} data-online={online} />
        <Text size="sm" fw={500}>
          {formatMessage({
            id: online ? 'ui.feedPanel.connected' : 'ui.feedPanel.disconnected',
          })}
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
          title={formatMessage({ id: 'common.reload' })}
          aria-label={formatMessage({ id: 'common.reload' })}
        >
          <IconReload size="1.125rem" />
        </ActionIcon>
        {advancedMode && (
          <ActionIcon
            variant="subtle"
            size={30}
            color={preview ? 'teal' : 'blue'}
            onClick={handleClickPreviewButton}
            title={formatMessage({ id: 'ui.feedPanel.preview' })}
            aria-label={formatMessage({ id: 'ui.feedPanel.preview' })}
            visibleFrom="md"
          >
            <IconPaperclip size="1.125rem" />
          </ActionIcon>
        )}
        <ActionIcon
          variant="subtle"
          size={30}
          color={focus ? 'teal' : 'blue'}
          onClick={handleClickFocusButton}
          title={formatMessage({ id: 'ui.feedPanel.focus' })}
          aria-label={formatMessage({ id: 'ui.feedPanel.focus' })}
          visibleFrom="md"
        >
          <IconFocus size="1.125rem" />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size={30}
          onClick={handleClickShowTabPanelDrawerButton}
          title={formatMessage({ id: 'common.extend' })}
          aria-label={formatMessage({ id: 'common.extend' })}
          hiddenFrom="md"
        >
          <IconArrowsMaximize size="1.125rem" />
        </ActionIcon>
      </Flex>
    </Group>
  );
}
