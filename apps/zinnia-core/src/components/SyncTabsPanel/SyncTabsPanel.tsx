import { useIntl } from 'react-intl';
import {
  ActionIcon,
  Button,
  Group,
  Popover,
  Stack,
  Text,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import { IconCloudDownload, IconCloudUpload, IconRefresh } from '@tabler/icons-react';
import { useIsFirstRender } from '@mantine/hooks';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { useGetOption } from '@/queries/useGetOption';

function SyncTabsPanelContent() {
  const { formatMessage } = useIntl();
  const firstRender = useIsFirstRender();

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
    const result = await refetchTabsOption();
    appState.local.tabs.set(JSON.parse(result.data as string));
  };

  return (
    <Stack gap="xs">
      <Text fw={500}>{formatMessage({ id: 'ui.syncTabsPanel.title' })}</Text>

      <Group gap="xs">
        <Button
          variant="default"
          flex={1}
          leftSection={<IconCloudUpload size="1rem" />}
          onClick={handleClickPushButton}
          loading={saveOptionApi.isPending}
        >
          {formatMessage({ id: 'ui.syncTabsPanel.push' })}
        </Button>
        <Button
          variant="default"
          flex={1}
          leftSection={<IconCloudDownload size="1rem" />}
          onClick={handleClickPullButton}
          loading={!firstRender && isFetchingTabsOption}
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

  return (
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
          visibleFrom="md"
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
  );
}
