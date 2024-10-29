import {
  ActionIcon,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useDirection,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconFile,
  IconLayoutColumns,
  IconPlus,
  IconSeeding,
  IconUser,
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useSelector } from '@legendapp/state/react';
import classes from './NewTabPanel.module.css';
import { Tab, TabType } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';
import { appConfig } from '@/config/appConfig';

function NewTabPanelContent() {
  const { formatMessage } = useIntl();

  const handleClickWelcomeTabButton = () => {
    const tabId = uuidv4();
    const now = dayjs().toISOString();
    const welcomeTab: Tab = {
      id: tabId,
      createdAt: now,
      updatedAt: now,
      name: formatMessage({ id: 'common.welcome' }),
      type: TabType.WELCOME,
      data: null,
    };
    appState.ui.activeTabs.set((activeTabs) => [...activeTabs, welcomeTab]);
    appState.ui.activeTabId.set(tabId);
  };

  const activeTabs = useSelector(appState.ui.activeTabs);
  const isDisabled = activeTabs.length >= appConfig.MAX_TAB_LIMIT;

  return (
    <Stack gap="xs">
      <Text fw={500}>{formatMessage({ id: 'ui.newTabPanel.title' })}</Text>

      <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
        <UnstyledButton
          className={classes.tab}
          onClick={handleClickWelcomeTabButton}
          data-disabled={isDisabled}
          disabled={isDisabled}
        >
          <Stack align="center" gap="xs">
            <IconSeeding size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'tab.welcome' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab} data-disabled disabled>
          <Stack align="center" gap="xs">
            <IconLayoutColumns size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'tab.diff' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab} data-disabled disabled>
          <Stack align="center" gap="xs">
            <IconAlignJustified size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'tab.read' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab} data-disabled disabled>
          <Stack align="center" gap="xs">
            <IconFile size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'tab.page' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab} data-disabled disabled>
          <Stack align="center" gap="xs">
            <IconUser size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'tab.user' })}</Text>
          </Stack>
        </UnstyledButton>
      </SimpleGrid>
    </Stack>
  );
}

export function NewTabPanel() {
  const { formatMessage } = useIntl();
  const { dir } = useDirection();
  const activeWorkspaceId = useSelector(appState.userConfig.activeWorkspaceId);

  return (
    <Popover
      width={350}
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
          visibleFrom="md"
          title={formatMessage({ id: 'ui.newTabPanel.title' })}
          aria-label={formatMessage({ id: 'ui.newTabPanel.title' })}
          disabled={!activeWorkspaceId}
          className={classes.button}
        >
          <IconPlus size="1.125rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown py="xs" px="sm">
        <NewTabPanelContent />
      </Popover.Dropdown>
    </Popover>
  );
}
