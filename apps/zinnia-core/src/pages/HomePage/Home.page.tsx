import { Box, Paper, Stack } from '@mantine/core';
import classes from './Home.page.module.css';
import { HeaderPanel } from '@/components/HeaderPanel/HeaderPanel';
import { HeroPanel } from '@/components/HeroPanel/HeroPanel';
import { MainPanel } from '@/components/MainPanel/MainPanel';
import { startRef } from '@/refs/startRef';
import { useManageVersion } from '@/pages/HomePage/useManageVersion';
import { useSyncDirection } from '@/pages/HomePage/useSyncDirection';
import { useSyncColorScheme } from '@/pages/HomePage/useSyncColorScheme';
import { useSyncLanguage } from '@/pages/HomePage/useSyncLanguage';

export function HomePage() {
  useSyncDirection();
  useSyncColorScheme();
  useSyncLanguage();
  useManageVersion();

  return (
    <Paper radius="lg" shadow="lg" className={classes.wrapper}>
      <Box className={classes.background} />
      <Stack className={classes.content}>
        <HeaderPanel />
        <HeroPanel />
        <Box id="start" ref={startRef} />
        <MainPanel />
      </Stack>
    </Paper>
  );
}
