import { Box, Flex, Paper } from '@mantine/core';
import classes from './Home.page.module.css';
import { HeroPanel } from '@/components/HeroPanel/HeroPanel';
import { MainPanel } from '@/components/MainPanel/MainPanel';
import { startRef } from '@/refs/startRef';
import { useManageVersion } from '@/hooks/useManageVersion';
import { useSyncDirection } from '@/hooks/useSyncDirection';
import { useSyncColorScheme } from '@/hooks/useSyncColorScheme';

export function HomePage() {
  useSyncDirection();
  useSyncColorScheme();
  useManageVersion();

  return (
    <Paper radius="lg" shadow="lg" className={classes.wrapper}>
      <Box className={classes.background} />
      <Flex className={classes.content}>
        <HeroPanel />
        <Box id="start" ref={startRef} />
        <MainPanel />
      </Flex>
    </Paper>
  );
}
