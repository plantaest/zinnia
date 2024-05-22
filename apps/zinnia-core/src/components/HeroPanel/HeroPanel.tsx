import { Box, Flex } from '@mantine/core';
import { AnimatePresence, LazyMotion, m, MotionProps } from 'framer-motion';
import { memo } from 'react';
import classes from './HeroPanel.module.css';
import { StartStateContent } from '@/components/HeroPanel/StartStateContent';
import { appState } from '@/states/appState';
import { ScrollDownButton } from '@/components/HeroPanel/ScrollDownButton';
import { EmptyStateContent } from '@/components/HeroPanel/EmptyStateContent';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';
import { loadDomAnimationFeatures } from '@/utils/lazy';

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
            <LazyMotion features={loadDomAnimationFeatures}>
              <m.div {...motionProps}>
                <EmptyStateContent />
              </m.div>
            </LazyMotion>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {initState.get() === 'start' && (
            <LazyMotion features={loadDomAnimationFeatures}>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.5, duration: 1.5 } }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              >
                <StartStateContent />
              </m.div>
            </LazyMotion>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {initState.get() === 'normal' && showMainPanel && (
            <LazyMotion features={loadDomAnimationFeatures}>
              <m.div {...motionProps}>
                <ScrollDownButton />
              </m.div>
            </LazyMotion>
          )}
        </AnimatePresence>
      </Flex>
    </Box>
  );
}

export const HeroPanel = memo(_HeroPanel);
