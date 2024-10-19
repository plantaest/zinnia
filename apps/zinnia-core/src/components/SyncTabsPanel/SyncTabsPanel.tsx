import { useIntl } from 'react-intl';
import {
  ActionIcon,
  Button,
  CloseButton,
  Group,
  Popover,
  Stack,
  Text,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import { IconCloudDownload, IconCloudUpload, IconRefresh } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useState } from 'react';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { useGetOption } from '@/queries/useGetOption';
import { useLargerThan } from '@/hooks/useLargerThan';

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
      <Group gap="xs">
        <CloseButton
          onClick={modals.closeAll}
          variant="subtle"
          aria-label={formatMessage({ id: 'common.close' })}
          hiddenFrom="md"
        />
        <Text fw={500}>{formatMessage({ id: 'ui.syncTabsPanel.title' })}</Text>
      </Group>

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
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');

  const handleClickSyncTabsButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: <SyncTabsPanelContent />,
    });

  return largerThanMd ? (
    <Popover
      width={300}
      position="bottom-end"
      shadow="lg"
      radius="md"
      transitionProps={{ transition: dir === 'rtl' ? 'pop-top-left' : 'pop-top-right' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size={30}
          title={formatMessage({ id: 'ui.syncTabsPanel.title' })}
          aria-label={formatMessage({ id: 'ui.syncTabsPanel.title' })}
        >
          <IconRefresh size="1.125rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        py="xs"
        px="sm"
        style={{
          backgroundColor:
            computedColorScheme === 'dark'
              ? 'var(--mantine-color-dark-7)'
              : 'var(--mantine-color-white)',
        }}
      >
        <SyncTabsPanelContent />
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      variant="subtle"
      size={30}
      title={formatMessage({ id: 'ui.syncTabsPanel.title' })}
      aria-label={formatMessage({ id: 'ui.syncTabsPanel.title' })}
      onClick={handleClickSyncTabsButton}
    >
      <IconRefresh size="1.125rem" />
    </ActionIcon>
  );
}
