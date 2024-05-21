import { Box, Flex, Paper, Stack } from '@mantine/core';
import { AnimatePresence, motion } from 'framer-motion';
import classes from './Home.page.module.css';
import { HeaderPanel } from '@/components/HeaderPanel/HeaderPanel';
import { FeedPanel } from '@/components/FeedPanel/FeedPanel';
import { TabPanel } from '@/components/TabPanel/TabPanel';
import { HeroPanel } from '@/components/HeroPanel/HeroPanel';
import { startRef } from '@/refs/startRef';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';
import { useManageVersion } from '@/pages/HomePage/useManageVersion';
import { useSyncDirection } from '@/pages/HomePage/useSyncDirection';
import { useSyncColorScheme } from '@/pages/HomePage/useSyncColorScheme';
import { useSyncLanguage } from '@/pages/HomePage/useSyncLanguage';

export function HomePage() {
  useSyncDirection();
  useSyncColorScheme();
  useSyncLanguage();
  useManageVersion();

  const showMainPanel = useShowMainPanel();

  return (
    <Paper radius="lg" shadow="lg" className={classes.wrapper}>
      <Box className={classes.background} />
      <Stack className={classes.content}>
        <HeaderPanel />
        <HeroPanel />
        <Box id="start" ref={startRef} />
        <AnimatePresence>
          {showMainPanel && (
            <motion.div
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
            </motion.div>
          )}
        </AnimatePresence>
      </Stack>
    </Paper>
  );
}
