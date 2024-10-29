import { useIntl } from 'react-intl';
import { ActionIcon, Button, Group, Popover, Stack, Text, useDirection } from '@mantine/core';
import { IconCloudDownload, IconCloudUpload, IconRefresh } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useSelector } from '@legendapp/state/react';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { useGetOption } from '@/queries/useGetOption';
import { useLargerThan } from '@/hooks/useLargerThan';
import classes from './SyncTabsPanel.module.css';
import { CloseModalButton } from '@/components/CloseModalButton/CloseModalButton';

function SyncTabsPanelContent() {
  const { formatMessage } = useIntl();
  const [showLoading, setShowLoading] = useState(false);

  const saveOptionApi = useSaveOption();
  const {
    isFetching: isFetchingTabsOption,
    isError: isErrorTabsOption,
    refetch: refetchTabsOption,
  } = useGetOption(appConfig.TABS_OPTION_KEY);

  const handleClickPushButton = () => {
    saveOptionApi.mutate({
      name: appConfig.TABS_OPTION_KEY,
      value: JSON.stringify(appState.local.tabs.peek()),
    });
  };

  const handleClickPullButton = async () => {
    setShowLoading(true);
    const result = await refetchTabsOption();
    appState.local.tabs.set(JSON.parse(result.data as string));
  };

  return (
    <Stack gap="xs">
      <Text fw={500}>{formatMessage({ id: 'ui.syncTabsPanel.title' })}</Text>

      <Group gap="xs">
        <Button
          variant="light"
          flex={1}
          leftSection={<IconCloudUpload size="1rem" />}
          onClick={handleClickPushButton}
          loading={saveOptionApi.isPending}
        >
          {formatMessage({ id: 'ui.syncTabsPanel.push' })}
        </Button>
        <Button
          variant="light"
          flex={1}
          leftSection={<IconCloudDownload size="1rem" />}
          onClick={handleClickPullButton}
          loading={showLoading && isFetchingTabsOption}
          disabled={isErrorTabsOption}
        >
          {formatMessage({ id: 'ui.syncTabsPanel.pull' })}
        </Button>
      </Group>
    </Stack>
  );
}

export function SyncTabsPanel() {
  const { formatMessage } = useIntl();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');
  const activeWorkspaceId = useSelector(appState.userConfig.activeWorkspaceId);

  const handleClickSyncTabsButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: (
        <Stack gap="xs">
          <CloseModalButton />
          <SyncTabsPanelContent />
        </Stack>
      ),
    });

  return largerThanMd ? (
    <Popover
      width={300}
      position="bottom-end"
      shadow="lg"
      radius="md"
      trapFocus
      transitionProps={{ transition: dir === 'rtl' ? 'pop-top-left' : 'pop-top-right' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size={30}
          title={formatMessage({ id: 'ui.syncTabsPanel.title' })}
          aria-label={formatMessage({ id: 'ui.syncTabsPanel.title' })}
          disabled={!activeWorkspaceId}
          className={classes.button}
        >
          <IconRefresh size="1.125rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown py="xs" px="sm">
        <SyncTabsPanelContent />
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      data-autofocus // Focus on TabPanelDrawer
      variant="subtle"
      size={30}
      title={formatMessage({ id: 'ui.syncTabsPanel.title' })}
      aria-label={formatMessage({ id: 'ui.syncTabsPanel.title' })}
      onClick={handleClickSyncTabsButton}
      disabled={!activeWorkspaceId}
      className={classes.button}
    >
      <IconRefresh size="1.125rem" />
    </ActionIcon>
  );
}
