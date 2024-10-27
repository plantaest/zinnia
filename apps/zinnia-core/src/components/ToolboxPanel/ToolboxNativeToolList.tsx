import { ActionIcon, Button, Group, Stack, Switch, Text, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { useListState } from '@mantine/hooks';
import dayjs from 'dayjs';
import { ToolboxLayer } from '@/components/ToolboxPanel/ToolboxPanel';
import { nativeTools, nativeToolsDict } from '@/tools/nativeTools';
import classes from './ToolboxNativeToolList.module.css';
import { appState } from '@/states/appState';
import { isEqual } from '@/utils/isEqual';
import { useUpdateNativeTools } from '@/queries/useUpdateNativeTools';
import { UserNativeTool } from '@/types/persistence/Tool';
import { diffArrays } from '@/utils/diffArrays';

interface ToolboxNativeToolListProps {
  onChangeLayer: (layer: ToolboxLayer) => void;
}

export function ToolboxNativeToolList({ onChangeLayer }: ToolboxNativeToolListProps) {
  const { formatMessage } = useIntl();
  const userTools = useSelector(appState.userConfig.tools);
  const userNativeToolIds = userTools.native.map((tool) => tool.toolId);
  const [toolIds, toolIdsHandlers] = useListState(userNativeToolIds);
  const updateNativeToolsApi = useUpdateNativeTools();

  const handleClickBackButton = () => {
    onChangeLayer('main');
  };

  const handleClickSwitchButton = (toolId: string, checked: boolean) => {
    if (checked) {
      if (!toolIds.includes(toolId)) {
        toolIdsHandlers.append(toolId);
      }
    } else if (toolIds.includes(toolId)) {
      toolIdsHandlers.filter((userToolId) => userToolId !== toolId);
    }
  };

  const handleClickSaveButton = () => {
    const newUserNativeTools: UserNativeTool[] = [];
    const diff = diffArrays(userNativeToolIds, toolIds);

    for (const toolId of diff.kept) {
      const userNativeTool = userTools.native.find((tool) => tool.toolId === toolId);
      if (userNativeTool) {
        newUserNativeTools.push(userNativeTool);
      }
    }

    for (const toolId of diff.added) {
      const now = dayjs().toISOString();
      const newUserNativeTool: UserNativeTool = {
        toolId: toolId,
        createdAt: now,
        updatedAt: now,
        settings: {
          general: {
            dock: false,
          },
          additional: {
            version: nativeToolsDict[toolId].settingsVersion,
            data: {},
          },
        },
      };
      newUserNativeTools.push(newUserNativeTool);
    }

    updateNativeToolsApi.mutate(newUserNativeTools);
  };

  const isDisabledSaveButton = isEqual(userNativeToolIds.toSorted(), toolIds.toSorted());

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.toolboxPanel.nativeTools' })}</Text>

        <Group gap="xs">
          <Button
            size="compact-xs"
            disabled={isDisabledSaveButton}
            onClick={handleClickSaveButton}
            loading={updateNativeToolsApi.isPending}
          >
            {formatMessage({ id: 'common.save' })}
          </Button>
          <ActionIcon
            variant="transparent"
            color="gray"
            title={formatMessage({ id: 'common.back' })}
            aria-label={formatMessage({ id: 'common.back' })}
            onClick={handleClickBackButton}
          >
            <IconArrowLeft size="1.25rem" />
          </ActionIcon>
        </Group>
      </Group>

      <Stack gap={6}>
        {nativeTools.map((nativeTool) => (
          <Group key={nativeTool.id} gap="xs" justify="space-between" className={classes.tool}>
            <Group gap="xs">
              <ThemeIcon color={nativeTool.iconColor} size="md">
                <nativeTool.iconShape size="1.25rem" />
              </ThemeIcon>
              <Text size="sm">{formatMessage({ id: nativeTool.name })}</Text>
            </Group>

            <Group gap="xs">
              <Switch
                checked={toolIds.includes(nativeTool.id)}
                onClick={(event) =>
                  handleClickSwitchButton(nativeTool.id, event.currentTarget.checked)
                }
              />
              <ActionIcon size={16} variant="transparent" color="gray">
                <IconChevronDown />
              </ActionIcon>
            </Group>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}
