import { Box, Drawer, Flex, useComputedColorScheme } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import { FeedPanel } from '@/components/FeedPanel/FeedPanel';
import { TabPanel } from '@/components/TabPanel/TabPanel';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';
import { appState } from '@/states/appState';

export function MainPanel() {
  const showMainPanel = useShowMainPanel();
  const showTabPanelDrawer = useSelector(appState.ui.showTabPanelDrawer);
  const computedColorScheme = useComputedColorScheme();

  const handleClickDrawerCloseButton = () => appState.ui.showTabPanelDrawer.set(false);

  return (
    showMainPanel && (
      <Flex wrap="nowrap" pe={{ md: 'xs' }} pb="xs" style={{ overflow: 'clip' }}>
        <Box w="100%" flex={{ base: 1, md: 0 }}>
          <FeedPanel />
        </Box>
        <Box flex={1} visibleFrom="md" miw={0} mt={{ md: 5 }}>
          <TabPanel />
        </Box>
        <Drawer
          opened={showTabPanelDrawer}
          onClose={handleClickDrawerCloseButton}
          size="100%"
          withCloseButton={false}
          styles={{
            inner: {
              right: 0,
            },
            body: {
              padding: 5,
              backgroundColor: computedColorScheme === 'dark' ? '#061e35' : '#c8e3f9',
            },
          }}
          transitionProps={{ transition: 'fade-down' }}
        >
          <TabPanel />
        </Drawer>
      </Flex>
    )
  );
}
