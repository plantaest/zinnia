import { AnimatePresence, LazyMotion, m } from 'framer-motion';
import { Box, Flex } from '@mantine/core';
import { loadDomAnimationFeatures } from '@/utils/lazy';
import { FeedPanel } from '@/components/FeedPanel/FeedPanel';
import { TabPanel } from '@/components/TabPanel/TabPanel';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';

export function MainPanel() {
  const showMainPanel = useShowMainPanel();

  return (
    <AnimatePresence>
      {showMainPanel && (
        <LazyMotion features={loadDomAnimationFeatures}>
          <m.div
            // Ref: https://stackoverflow.com/a/74462258
            style={{ overflow: 'clip' }}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 2,
            }}
          >
            <Flex wrap="nowrap" pe={{ md: 'xs' }} pb="xs">
              <Box w="100%" flex={{ base: 1, md: 0 }}>
                <FeedPanel />
              </Box>
              <Box flex={1} visibleFrom="md" miw={0}>
                <TabPanel />
              </Box>
            </Flex>
          </m.div>
        </LazyMotion>
      )}
    </AnimatePresence>
  );
}
