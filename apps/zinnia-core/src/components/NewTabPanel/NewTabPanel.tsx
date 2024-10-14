import {
  ActionIcon,
  Popover,
  SimpleGrid,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconFile,
  IconLayoutColumns,
  IconPhoto,
  IconPlus,
  IconSeeding,
  IconUser,
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import classes from './NewTabPanel.module.css';
import { Tab, TabType } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';

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
    appState.local.activeTabs.set((activeTabs) => [...activeTabs, welcomeTab]);
    appState.local.activeTabId.set(tabId);
  };

  return (
    <Stack gap="xs">
      <Text fw={500}>{formatMessage({ id: 'ui.newTabPanel.title' })}</Text>

      <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
        <UnstyledButton className={classes.tab} onClick={handleClickWelcomeTabButton}>
          <Stack align="center" gap="xs">
            <IconSeeding size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.welcome' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab}>
          <Stack align="center" gap="xs">
            <IconLayoutColumns size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.diff' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab}>
          <Stack align="center" gap="xs">
            <IconAlignJustified size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.read' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab}>
          <Stack align="center" gap="xs">
            <IconPhoto size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.file' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab}>
          <Stack align="center" gap="xs">
            <IconFile size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.page' })}</Text>
          </Stack>
        </UnstyledButton>

        <UnstyledButton className={classes.tab}>
          <Stack align="center" gap="xs">
            <IconUser size="1.5rem" stroke={1.5} />
            <Text size="xs">{formatMessage({ id: 'ui.newTabPanel.user' })}</Text>
          </Stack>
        </UnstyledButton>
      </SimpleGrid>
    </Stack>
  );
}

export function NewTabPanel() {
  const { formatMessage } = useIntl();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();

  return (
    <Popover
      width={350}
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
          title={formatMessage({ id: 'ui.newTabPanel.title' })}
          aria-label={formatMessage({ id: 'ui.newTabPanel.title' })}
        >
          <IconPlus size="1.125rem" />
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
        <NewTabPanelContent />
      </Popover.Dropdown>
    </Popover>
  );
}
