import { Box, Flex } from '@mantine/core';
import { AnimatePresence, motion, MotionProps } from 'framer-motion';
import { memo } from 'react';
import classes from './HeroPanel.module.css';
import { StartStateContent } from '@/components/HeroPanel/StartStateContent';
import { appState } from '@/states/appState';
import { ScrollDownButton } from '@/components/HeroPanel/ScrollDownButton';
import { EmptyStateContent } from '@/components/HeroPanel/EmptyStateContent';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';

const motionProps: MotionProps = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 1.5 },
};

const initStates = new Set<string>();

function _HeroPanel() {
  const initState = appState.ui.initState;

  const showMainPanel = useShowMainPanel();

  initStates.add(initState.get());

  return (
    <Box className={classes.wrapper}>
      <Flex className={classes.inner}>
        <AnimatePresence>
          {(initState.get() === 'empty' || (!initStates.has('start') && !showMainPanel)) && (
            <motion.div {...motionProps}>
              <EmptyStateContent />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {initState.get() === 'start' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 1.5, duration: 1.5 } }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
            >
              <StartStateContent />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {initState.get() === 'normal' && showMainPanel && (
            <motion.div {...motionProps}>
              <ScrollDownButton />
            </motion.div>
          )}
        </AnimatePresence>
      </Flex>
    </Box>
  );
}

export const HeroPanel = memo(_HeroPanel);
