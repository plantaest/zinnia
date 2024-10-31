import { Box, Flex, Paper } from '@mantine/core';
import { useDocumentTitle } from '@mantine/hooks';
import classes from './Core.module.css';
import { HeroPanel } from '@/components/HeroPanel/HeroPanel';
import { MainPanel } from '@/components/MainPanel/MainPanel';
import { startRef } from '@/refs/startRef';
import { useManageVersion } from '@/hooks/useManageVersion';
import { useSyncDirection } from '@/hooks/useSyncDirection';
import { useSyncColorScheme } from '@/hooks/useSyncColorScheme';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export function Core() {
  useDocumentTitle('Zinnia');
  useSyncDirection();
  useSyncColorScheme();
  useManageVersion();

  return (
    <ErrorBoundary>
      <Paper radius="lg" shadow="lg" className={classes.wrapper}>
        <Box className={classes.background} />
        <Flex className={classes.content}>
          <HeroPanel />
          <Box id="start" ref={startRef} />
          <MainPanel />
        </Flex>
      </Paper>
    </ErrorBoundary>
  );
}
