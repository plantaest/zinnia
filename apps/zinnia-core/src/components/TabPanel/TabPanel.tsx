import { Box } from '@mantine/core';
import classes from './TabPanel.module.css';
import { TabHeaderPanel } from '@/components/TabPanel/TabHeaderPanel';
import { TabMainPanel } from '@/components/TabPanel/TabMainPanel';
import { TabFooterPanel } from '@/components/TabPanel/TabFooterPanel';

export function TabPanel() {
  return (
    <Box className={classes.wrapper}>
      <TabHeaderPanel />
      <TabMainPanel />
      <TabFooterPanel />
    </Box>
  );
}
