import { Box, Flex } from '@mantine/core';
import { FeedPanel } from '@/components/FeedPanel/FeedPanel';
import { TabPanel } from '@/components/TabPanel/TabPanel';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';

export function MainPanel() {
  const showMainPanel = useShowMainPanel();

  return (
    showMainPanel && (
      <Flex wrap="nowrap" pe={{ md: 'xs' }} pb="xs" style={{ overflow: 'clip' }}>
        <Box w="100%" flex={{ base: 1, md: 0 }}>
          <FeedPanel />
        </Box>
        <Box flex={1} visibleFrom="md" miw={0}>
          <TabPanel />
        </Box>
      </Flex>
    )
  );
}
