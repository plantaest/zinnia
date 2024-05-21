import { ActionIcon, Box, Card, Grid, Group } from '@mantine/core';
import {
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconAsterisk,
  IconBookmark,
  IconCheck,
  IconGridDots,
  IconRestore,
} from '@tabler/icons-react';
import classes from './TabPanel.module.css';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { TabHeaderPanel } from '@/components/TabPanel/TabHeaderPanel';
import { TabMainPanel } from '@/components/TabPanel/TabMainPanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';

export function TabPanel() {
  return (
    <Box className={classes.wrapper}>
      <TabHeaderPanel />

      <TabMainPanel />

      <Card p="xs" className={classes.footer}>
        <Grid>
          <Grid.Col span="auto">
            <Group gap="xs">
              <Group gap="xs">
                <FilterPanel />
                <WorkspacePanel />
              </Group>
              <Group gap="xs" justify="center" flex={1}>
                <ActionIcon color="violet" size="lg">
                  <IconRestore size="1.5rem" />
                </ActionIcon>
              </Group>
            </Group>
          </Grid.Col>
          <Grid.Col span="content">
            <Group gap="xs">
              <ActionIcon variant="subtle" size="lg">
                <IconGridDots size="1.5rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size="lg">
                <IconAsterisk size="1.5rem" />
              </ActionIcon>
            </Group>
          </Grid.Col>
          <Grid.Col span="auto">
            <Group gap="xs" justify="flex-end">
              <Group gap="xs" justify="center" flex={1}>
                <ActionIcon color="lime" size="lg">
                  <IconCheck size="1.5rem" />
                </ActionIcon>
                <ActionIcon color="teal" size="lg">
                  <IconArrowBackUp size="1.5rem" />
                </ActionIcon>
                <ActionIcon color="cyan" size="lg">
                  <IconArrowBackUp size="1.5rem" />
                </ActionIcon>
                <ActionIcon color="pink" size="lg">
                  <IconArrowBackUpDouble size="1.5rem" />
                </ActionIcon>
              </Group>
              <Group gap="xs">
                <ActionIcon variant="subtle" size="lg">
                  <IconBookmark size="1.5rem" />
                </ActionIcon>
                <SettingPanel />
              </Group>
            </Group>
          </Grid.Col>
        </Grid>
      </Card>
    </Box>
  );
}
