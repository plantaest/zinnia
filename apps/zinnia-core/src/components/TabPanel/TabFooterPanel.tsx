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
          emblaOptions={{ align: 'start', slidesToScroll: 5 }}
          my={-6}
          slideSize={34}
          slideGap="xs"
          controlsOffset={0}
          controlSize={14}
          classNames={{
            viewport: classes.carouselViewport,
            controls: classes.carouselControls,
            control: classes.carouselControl,
            slide: classes.carouselSlide,
          }}
        >
          {dockedNativeTools.map((tool) => {
            const nativeTool = nativeToolsDict[tool.toolId];
            return (
              <nativeTool.component
                key={nativeTool.metadata.id}
                metadata={nativeTool.metadata}
                config={nativeTool.config}
              >
                {({ trigger, loading, targetRef, actions = [] }) =>
                  actions.length > 0 ? (
                    actions.map((action) => (
                      <action.component
                        key={action.metadata.id}
                        metadata={action.metadata}
                        config={action.config}
                      >
                        {({
                          trigger: actionTrigger,
                          loading: actionLoading,
                          targetRef: actionTargetRef,
                        }) => (
                          <Carousel.Slide>
                            <Tooltip
                              label={
                                action.metadata.name in messages
                                  ? formatMessage({ id: action.metadata.name })
                                  : action.metadata.name
                              }
                            >
                              <ActionIcon
                                color={action.metadata.iconColor}
                                size="lg"
                                aria-label={action.metadata.name}
                                onClick={actionTrigger}
                                loading={actionLoading}
                                ref={actionTargetRef}
                              >
                                <action.metadata.iconShape size="1.5rem" />
                              </ActionIcon>
                            </Tooltip>
                          </Carousel.Slide>
                        )}
                      </action.component>
                    ))
                  ) : (
                    <Carousel.Slide>
                      <Tooltip
                        label={
                          nativeTool.metadata.name in messages
                            ? formatMessage({ id: nativeTool.metadata.name })
                            : nativeTool.metadata.name
                        }
                      >
                        <ActionIcon
                          color={nativeTool.metadata.iconColor}
                          size="lg"
                          aria-label={nativeTool.metadata.name}
                          onClick={trigger}
                          loading={loading}
                          ref={targetRef}
                        >
                          <nativeTool.metadata.iconShape size="1.5rem" />
                        </ActionIcon>
                      </Tooltip>
                    </Carousel.Slide>
                  )
                }
              </nativeTool.component>
            );
          })}
          {dockedExtendedTools.map((tool) => {
            const extendedTool = extendedToolsDict[tool.toolId];
            return (
              <extendedTool.component
                key={extendedTool.metadata.id}
                metadata={extendedTool.metadata}
                config={extendedTool.config}
              >
                {({ trigger, loading, targetRef, firstExecuted }) => (
                  <Carousel.Slide>
                    <Tooltip label={extendedTool.metadata.name}>
                      <ActionIcon
                        color={tool.settings.general.iconColor}
                        size="lg"
                        aria-label={extendedTool.metadata.name}
                        onClick={trigger}
                        loading={loading}
                        ref={targetRef}
                        disabled={firstExecuted === false}
                      >
                        <Text ff="var(--zinnia-font-monospace)">
                          {extendedTool.metadata.iconLabel}
                        </Text>
                      </ActionIcon>
                    </Tooltip>
                  </Carousel.Slide>
                )}
              </extendedTool.component>
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
