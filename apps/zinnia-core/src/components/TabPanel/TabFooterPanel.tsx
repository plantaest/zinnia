import { ActionIcon, Box, Card, Text, Tooltip, useDirection } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useSelector } from '@legendapp/state/react';
import { useIntl } from 'react-intl';
import classes from '@/components/TabPanel/TabFooterPanel.module.css';
import { FilterPanel } from '@/components/FilterPanel/FilterPanel';
import { WorkspacePanel } from '@/components/WorkspacePanel/WorkspacePanel';
import { SettingPanel } from '@/components/SettingPanel/SettingPanel';
import { NavigationPanel } from '@/components/NavigationPanel/NavigationPanel';
import { ToolboxPanel } from '@/components/ToolboxPanel/ToolboxPanel';
import { appState } from '@/states/appState';
import { nativeToolsDict } from '@/tools/nativeTools';
import { extendedToolsDict } from '@/tools/extendedTools';

function ToolButtonsCarousel() {
  const { formatMessage, messages } = useIntl();
  const tools = useSelector(appState.userConfig.tools);
  const dockedNativeTools = tools.native.filter((tool) => tool.settings.general.dock);
  const dockedExtendedTools = tools.extended.filter((tool) => tool.settings.general.dock);
  const isEmpty = dockedNativeTools.length === 0 && dockedExtendedTools.length === 0;

  return (
    !isEmpty && (
      <Tooltip.Group openDelay={200} closeDelay={200}>
        <Carousel
          align="start"
          my={-6}
          slideSize={34}
          slideGap="xs"
          slidesToScroll={5}
          controlsOffset={0}
          controlSize={14}
          classNames={{
            viewport: classes.carouselViewport,
            controls: classes.carouselControls,
            control: classes.carouselControl,
            slide: classes.carouselSlide,
          }}
        >
          {dockedNativeTools
            .flatMap((tool) => nativeToolsDict[tool.toolId].actions)
            .map((action, index) => (
              <Carousel.Slide key={index}>
                <action.component>
                  {({ trigger }) => (
                    <Tooltip
                      label={
                        action.name in messages ? formatMessage({ id: action.name }) : action.name
                      }
                    >
                      <ActionIcon
                        color={action.iconColor}
                        size="lg"
                        aria-label={action.name}
                        onClick={trigger}
                      >
                        <action.iconShape size="1.5rem" />
                      </ActionIcon>
                    </Tooltip>
                  )}
                </action.component>
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
      <Box className={classes.grid}>
        <Box className={classes.left}>
          <FilterPanel />
          <WorkspacePanel />
        </Box>

        <Box className={classes.tools}>{carousel}</Box>

        <Box className={classes.navigation}>
          <NavigationPanel />
        </Box>

        <Box className={classes.right}>
          <ToolboxPanel />
          <SettingPanel />
        </Box>
      </Box>
    </Card>
  );
}
