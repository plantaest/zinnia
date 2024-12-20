import { Box, Drawer, Flex, rem } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import { FeedPanel } from '@/components/FeedPanel/FeedPanel';
import { TabPanel } from '@/components/TabPanel/TabPanel';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';
import { appState } from '@/states/appState';
import { useLargerThan } from '@/hooks/useLargerThan';

export function MainPanel() {
  const showMainPanel = useShowMainPanel();
  const showTabPanelDrawer = useSelector(appState.ui.showTabPanelDrawer);
  const largerThanMd = useLargerThan('md');

  const handleClickDrawerCloseButton = () => appState.ui.showTabPanelDrawer.set(false);

  return (
    showMainPanel && (
      <Flex wrap="nowrap" pe={{ md: 'xs' }} pb="xs" style={{ overflow: 'clip' }}>
        <Box w="100%" flex={{ base: 1, md: 0 }}>
          <FeedPanel />
        </Box>
        {largerThanMd && (
          <Box flex={1} miw={0} mt={{ md: 5 }} visibleFrom="md">
            <TabPanel />
          </Box>
        )}
        <Drawer
          opened={showTabPanelDrawer}
          onClose={handleClickDrawerCloseButton}
          size="100%"
          withCloseButton={false}
          withOverlay={false}
          styles={{
            body: {
              padding: rem(5),
              backgroundColor: 'var(--zinnia-root-background-color)',
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
