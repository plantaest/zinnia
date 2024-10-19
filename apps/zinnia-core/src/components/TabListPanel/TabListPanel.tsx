import { useIntl } from 'react-intl';
import {
  ActionIcon,
  Box,
  CloseButton,
  Group,
  Indicator,
  Popover,
  Stack,
  Text,
  UnstyledButton,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import { IconChevronDown, IconX } from '@tabler/icons-react';
import { useSelector } from '@legendapp/state/react';
import { modals } from '@mantine/modals';
import { appState } from '@/states/appState';
import classes from './TabListPanel.module.css';
import { tabIcons } from '@/utils/tabIcons';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';
import { useLargerThan } from '@/hooks/useLargerThan';

function TabListPanelContent() {
  const { formatMessage } = useIntl();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');
  const activeTabs = useSelector(appState.local.activeTabs);
  const activeTabId = useSelector(appState.local.activeTabId);

  const handleClickTab = (tabId: string) => {
    appState.local.activeTabId.set(tabId);
    scrollToTopTabMainPanel();
    modals.closeAll();
  };

  const handleClickDeleteTabButton = (tabId: string) => {
    if (tabId === activeTabId) {
      appState.local.activeTabId.set(null);
    }
    appState.local.activeTabs.set((tabs) => tabs.filter((tab) => tab.id !== tabId));
  };

  return (
    <Stack gap="xs">
      <Group gap="xs">
        {!largerThanMd && (
          <CloseButton
            onClick={modals.closeAll}
            variant="subtle"
            aria-label={formatMessage({ id: 'common.close' })}
          />
        )}
        <Text fw={500}>
          {formatMessage({ id: 'ui.tabListPanel.title' })} ({activeTabs.length})
        </Text>
      </Group>

      {activeTabs.length > 0 && (
        <Stack gap={5}>
          {activeTabs.map((tab) => {
            const TabIcon = tabIcons[tab.type];
            const isMainTab = tab.type.startsWith('MAIN');

            return (
              <Group key={tab.id} gap="xs" wrap="nowrap">
                <UnstyledButton
                  className={classes.tab}
                  data-active={activeTabId === tab.id}
                  onClick={() => handleClickTab(tab.id)}
                >
                  <Indicator
                    color="green"
                    size={5}
                    disabled={!isMainTab}
                    display="flex"
                    position={dir === 'rtl' ? 'top-start' : 'top-end'}
                  >
                    <TabIcon size="1rem" />
                  </Indicator>
                  <Text size="xs">{tab.name}</Text>
                </UnstyledButton>
                <ActionIcon
                  size={16}
                  color="red.5"
                  variant="subtle"
                  onClick={() => handleClickDeleteTabButton(tab.id)}
                >
                  <IconX />
                </ActionIcon>
              </Group>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}

export function TabListPanel() {
  const { formatMessage } = useIntl();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');

  const handleClickTabListButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: <TabListPanelContent />,
    });

  return largerThanMd ? (
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
          title={formatMessage({ id: 'ui.tabListPanel.title' })}
          aria-label={formatMessage({ id: 'ui.tabListPanel.title' })}
        >
          <IconChevronDown size="1.125rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        py={0}
        px={0}
        style={{
          backgroundColor:
            computedColorScheme === 'dark'
              ? 'var(--mantine-color-dark-7)'
              : 'var(--mantine-color-white)',
          overflow: 'hidden',
        }}
      >
        <Box
          mah="80vh"
          px="sm"
          py="xs"
          style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
        >
          <TabListPanelContent />
        </Box>
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      variant="subtle"
      size={30}
      title={formatMessage({ id: 'ui.tabListPanel.title' })}
      aria-label={formatMessage({ id: 'ui.tabListPanel.title' })}
      onClick={handleClickTabListButton}
    >
      <IconChevronDown size="1.125rem" />
    </ActionIcon>
  );
}
