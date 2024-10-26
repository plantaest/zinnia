import {
  ActionIcon,
  Box,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Tooltip,
  useDirection,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useSelector } from '@legendapp/state/react';
import classes from '@/components/TabPanel/TabFooterPanel.module.css';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';
import { NavigationPanel } from '@/components/NavigationPanel/NavigationPanel';
import { ToolboxPanel } from '@/components/ToolboxPanel/ToolboxPanel';
import { appState } from '@/states/appState';
import { nativeToolsDict } from '@/utils/tools/nativeTools';
import { extendedToolsDict } from '@/utils/tools/extendedTools';

function ToolButtonsCarousel() {
  const tools = useSelector(appState.userConfig.tools);
  const dockedNativeTools = tools.native.filter((tool) => tool.settings.general.dock);
  const dockedExtendedTools = tools.extended.filter((tool) => tool.settings.general.dock);
  const isEmpty = dockedNativeTools.length === 0 && dockedExtendedTools.length === 0;

  return (
    !isEmpty && (
      <Tooltip.Group openDelay={200} closeDelay={200}>
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
          {dockedNativeTools
            .flatMap((tool) => nativeToolsDict[tool.toolId].actions)
            .map((action, index) => (
              <Carousel.Slide key={index}>
                <Tooltip label={action.name}>
                  <ActionIcon color={action.iconColor} size="lg" aria-label={action.name}>
                    <action.iconShape size="1.5rem" />
                  </ActionIcon>
                </Tooltip>
              </Carousel.Slide>
            ))}
          {dockedExtendedTools.map((tool) => {
            const extendedTool = extendedToolsDict[tool.toolId];
            return (
              <Carousel.Slide key={extendedTool.id}>
                <Tooltip label={extendedTool.name}>
                  <ActionIcon
                    color={tool.settings.general.iconColor}
                    size="lg"
                    aria-label={extendedTool.name}
                  >
                    <Text ff="var(--zinnia-font-monospace)">{extendedTool.iconLabel}</Text>
                  </ActionIcon>
                </Tooltip>
              </Carousel.Slide>
            );
          })}
        </Carousel>
      </Tooltip.Group>
    )
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
            <ToolboxPanel />
            <SettingPanel />
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
