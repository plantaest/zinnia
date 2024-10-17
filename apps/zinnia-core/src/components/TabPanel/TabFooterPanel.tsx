import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Group,
  MantineColor,
  Stack,
  useDirection,
} from '@mantine/core';
import {
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconCheck,
  IconGridDots,
  IconRestore,
  TablerIcon,
} from '@tabler/icons-react';
import { Carousel } from '@mantine/carousel';
import classes from '@/components/TabPanel/TabFooterPanel.module.css';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';
import { NavigationPanel } from '@/components/NavigationPanel/NavigationPanel';

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

function ToolButtonsCarousel() {
  return (
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
}

export function TabFooterPanel() {
  const { dir } = useDirection();

  const carousel = (
    <>
      {dir === 'ltr' && <ToolButtonsCarousel />}
      {dir === 'rtl' && <ToolButtonsCarousel />}
    </>
  );

  return (
    <Card p="xs" className={classes.wrapper}>
      <Stack gap="xs">
        <Flex justify="center" hiddenFrom="md">
          {carousel}
        </Flex>

        <Group gap="xs" justify="space-between" wrap="nowrap" align="start">
          <Group gap="xs" wrap="nowrap">
            <FilterPanel />
            <WorkspacePanel />
          </Group>

          <Box visibleFrom="md">{carousel}</Box>

          <Flex hiddenFrom="md">
            <NavigationPanel />
          </Flex>

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
