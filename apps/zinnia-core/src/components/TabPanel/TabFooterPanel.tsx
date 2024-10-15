import { ActionIcon, Box, Card, Flex, Group, MantineColor, Stack } from '@mantine/core';
import {
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconCheck,
  IconGridDots,
  IconRestore,
  IconSquareRounded,
  TablerIcon,
} from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import classes from '@/components/TabPanel/TabFooterPanel.module.css';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';

interface NativeToolButton {
  color: MantineColor;
  icon: TablerIcon;
}

const toolButtons: NativeToolButton[] = [
  {
    color: 'violet',
    icon: IconRestore,
  },
  {
    color: 'lime',
    icon: IconCheck,
  },
  {
    color: 'teal',
    icon: IconArrowBackUp,
  },
  {
    color: 'cyan',
    icon: IconArrowBackUp,
  },
  {
    color: 'pink',
    icon: IconArrowBackUpDouble,
  },
];

export function TabFooterPanel() {
  const toolButtonsCarouselFragment = (
    <Carousel
      align="start"
      height={42}
      my={-4}
      slideSize={34}
      slideGap="xs"
      slidesToScroll={5}
      controlsOffset={0}
      controlSize={14}
      classNames={{
        viewport: classes.carouselViewport,
        controls: classes.carouselControls,
        control: classes.carouselControl,
      }}
    >
      {toolButtons.map((button, index) => (
        <Carousel.Slide key={index}>
          <ActionIcon color={button.color} size="lg">
            <button.icon size="1.5rem" />
          </ActionIcon>
        </Carousel.Slide>
      ))}
    </Carousel>
  );

  return (
    <Card p="xs" className={classes.wrapper}>
      <Stack gap="xs">
        <Flex justify="center" hiddenFrom="md">
          {toolButtonsCarouselFragment}
        </Flex>

        <Group gap="xs" justify="space-between" wrap="nowrap" align="start">
          <Group gap="xs" wrap="nowrap">
            <FilterPanel />
            <WorkspacePanel />
          </Group>

          <Box visibleFrom="md">{toolButtonsCarouselFragment}</Box>

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
