import { Box, Flex } from '@mantine/core';
import { memo } from 'react';
import { useSelector } from '@legendapp/state/react';
import classes from './HeroPanel.module.css';
import { StartStateContent } from '@/components/HeroPanel/StartStateContent';
import { appState } from '@/states/appState';
import { EmptyStateContent } from '@/components/HeroPanel/EmptyStateContent';
import { useShowMainPanel } from '@/hooks/useShowMainPanel';

const initStates = new Set<string>();

function _HeroPanel() {
  const initState = useSelector(appState.ui.initState);

  const showMainPanel = useShowMainPanel();

  initStates.add(initState);

  return (
    <Box className={classes.wrapper}>
      <Flex
        className={classes.inner}
        data-init-state={initState}
        data-show-main-panel={showMainPanel}
      >
        {(initState === 'empty' || (!initStates.has('start') && !showMainPanel)) && (
          <EmptyStateContent />
        )}
        {(initState === 'start' || (initStates.has('start') && !showMainPanel)) && (
          <StartStateContent />
        )}
      </Flex>
    </Box>
  );
}

export const HeroPanel = memo(_HeroPanel);
