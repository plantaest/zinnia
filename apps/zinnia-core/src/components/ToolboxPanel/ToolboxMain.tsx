import {
  ActionIcon,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { IconAdjustments, IconWind } from '@tabler/icons-react';
import { appState } from '@/states/appState';
import { ToolboxLayer } from '@/components/ToolboxPanel/ToolboxPanel';
import classes from './ToolboxMain.module.css';
import { nativeToolsDict } from '@/utils/tools/nativeTools';
import { extendedToolsDict } from '@/utils/tools/extendedTools';

interface ToolboxMainProps {
  onChangeLayer: (layer: ToolboxLayer) => void;
}

export function ToolboxMain({ onChangeLayer }: ToolboxMainProps) {
  const { formatMessage } = useIntl();
  const tools = useSelector(appState.userConfig.tools);

  const handleClickSettingsButton = () => {
    onChangeLayer('settings');
  };

  const handleClickSeeAllNativeToolsButton = () => {
    onChangeLayer('nativeToolList');
  };

  const handleClickSeeAllExtendedToolsButton = () => {
    onChangeLayer('extendedToolList');
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.toolboxPanel.title' })}</Text>
        <ActionIcon
          variant="transparent"
          color="gray"
          onClick={handleClickSettingsButton}
          title={formatMessage({ id: 'ui.toolboxPanel.settings.title' })}
          aria-label={formatMessage({ id: 'ui.toolboxPanel.settings.title' })}
        >
          <IconAdjustments size="1.25rem" />
        </ActionIcon>
      </Group>

      <Group gap="xs" justify="space-between">
        <Text size="sm" c="dimmed">
          {formatMessage({ id: 'ui.toolboxPanel.nativeTools' })}
        </Text>
        <Button variant="light" size="compact-xs" onClick={handleClickSeeAllNativeToolsButton}>
          {formatMessage({ id: 'ui.toolboxPanel.seeAll' })}
        </Button>
      </Group>

      {tools.native.length === 0 ? (
        <Stack align="center" py="lg">
          <IconWind size="2rem" stroke={1.5} color="var(--mantine-color-gray-5)" />
          <Text size="xs" c="dimmed">
            {formatMessage({ id: 'ui.toolboxPanel.noTools' })}
          </Text>
        </Stack>
      ) : (
        <SimpleGrid spacing={6} verticalSpacing={6} cols={2}>
          {tools.native.map((tool) => {
            const nativeTool = nativeToolsDict[tool.toolId];
            return (
              <UnstyledButton key={nativeTool.id} className={classes.tool}>
                <Group gap="xs">
                  <ThemeIcon color={nativeTool.iconColor} size="md">
                    <nativeTool.iconShape size="1.25rem" />
                  </ThemeIcon>
                  <Text size="sm">{formatMessage({ id: nativeTool.name })}</Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      )}

      <Group gap="xs" justify="space-between">
        <Text size="sm" c="dimmed">
          {formatMessage({ id: 'ui.toolboxPanel.extendedTools' })}
        </Text>
        <Button variant="light" size="compact-xs" onClick={handleClickSeeAllExtendedToolsButton}>
          {formatMessage({ id: 'ui.toolboxPanel.seeAll' })}
        </Button>
      </Group>

      {tools.extended.length === 0 ? (
        <Stack align="center" py="lg">
          <IconWind size="2rem" stroke={1.5} color="var(--mantine-color-gray-5)" />
          <Text size="xs" c="dimmed">
            {formatMessage({ id: 'ui.toolboxPanel.noTools' })}
          </Text>
        </Stack>
      ) : (
        <SimpleGrid spacing={6} verticalSpacing={6} cols={2}>
          {tools.extended.map((tool) => {
            const extendedTool = extendedToolsDict[tool.toolId];
            return (
              <UnstyledButton key={extendedTool.id} className={classes.tool}>
                <Group gap="xs">
                  <ThemeIcon color={tool.settings.general.iconColor} size="md">
                    <Text ff="var(--zinnia-font-monospace)" size="xs">
                      {extendedTool.iconLabel}
                    </Text>
                  </ThemeIcon>
                  <Text size="sm">{extendedTool.name}</Text>
                </Group>
              </UnstyledButton>
            );
          })}
        </SimpleGrid>
      )}
    </Stack>
  );
}
