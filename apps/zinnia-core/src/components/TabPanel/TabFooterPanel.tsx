import { ActionIcon, Card, Group, Stack } from '@mantine/core';
import {
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconCheck,
  IconGridDots,
  IconRestore,
  IconSquareRounded,
} from '@tabler/icons-react';
import classes from '@/components/TabPanel/TabFooterPanel.module.css';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';

const tools = (
  <>
    <ActionIcon color="violet" size="lg">
      <IconRestore size="1.5rem" />
    </ActionIcon>
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
  </>
);

export function TabFooterPanel() {
  return (
    <Card p="xs" className={classes.wrapper}>
      <Stack gap="xs">
        <Group gap="xs" hiddenFrom="md" justify="center">
          {tools}
        </Group>

        <Group gap="xs" justify="space-between" wrap="nowrap" align="start">
          <Group gap="xs" wrap="nowrap">
            <FilterPanel />
            <WorkspacePanel />
          </Group>

          <Group gap="xs" visibleFrom="md" justify="center">
            {tools}
          </Group>

          <ActionIcon variant="subtle" size="lg" hiddenFrom="md" color="teal">
            <IconSquareRounded size="1.5rem" />
          </ActionIcon>

          <Group gap="xs" wrap="nowrap">
            <ActionIcon variant="subtle" size="lg">
              <IconGridDots size="1.5rem" />
            </ActionIcon>
            <SettingPanel />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
