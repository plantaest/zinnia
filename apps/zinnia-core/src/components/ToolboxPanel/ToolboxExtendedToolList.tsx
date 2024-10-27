import { ActionIcon, Button, Group, Stack, Switch, Text, ThemeIcon } from '@mantine/core';
import { IconArrowLeft, IconChevronDown } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { useListState } from '@mantine/hooks';
import dayjs from 'dayjs';
import { ToolboxLayer } from '@/components/ToolboxPanel/ToolboxPanel';
import classes from './ToolboxNativeToolList.module.css';
import { extendedTools } from '@/tools/extendedTools';
import { appState } from '@/states/appState';
import { useUpdateExtendedTools } from '@/queries/useUpdateExtendedTools';
import { UserExtendedTool } from '@/types/persistence/Tool';
import { diffArrays } from '@/utils/diffArrays';
import { isEqual } from '@/utils/isEqual';

interface ToolboxExtendedToolListProps {
  onChangeLayer: (layer: ToolboxLayer) => void;
}

export function ToolboxExtendedToolList({ onChangeLayer }: ToolboxExtendedToolListProps) {
  const { formatMessage } = useIntl();
  const userTools = useSelector(appState.userConfig.tools);
  const userExtendedToolIds = userTools.extended.map((tool) => tool.toolId);
  const [toolIds, toolIdsHandlers] = useListState(userExtendedToolIds);
  const updateExtendedToolsApi = useUpdateExtendedTools();

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
    const newUserExtendedTools: UserExtendedTool[] = [];
    const diff = diffArrays(userExtendedToolIds, toolIds);

    for (const toolId of diff.kept) {
      const userExtendedTool = userTools.extended.find((tool) => tool.toolId === toolId);
      if (userExtendedTool) {
        newUserExtendedTools.push(userExtendedTool);
      }
    }

    for (const toolId of diff.added) {
      const now = dayjs().toISOString();
      const newUserExtendedTool: UserExtendedTool = {
        toolId: toolId,
        createdAt: now,
        updatedAt: now,
        settings: {
          general: {
            dock: false,
            iconColor: 'blue',
          },
        },
      };
      newUserExtendedTools.push(newUserExtendedTool);
    }

    updateExtendedToolsApi.mutate(newUserExtendedTools);
  };

  const isDisabledSaveButton = isEqual(userExtendedToolIds.toSorted(), toolIds.toSorted());

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.toolboxPanel.extendedTools' })}</Text>

        <Group gap="xs">
          <Button
            size="compact-xs"
            disabled={isDisabledSaveButton}
            onClick={handleClickSaveButton}
            loading={updateExtendedToolsApi.isPending}
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
        {extendedTools.map((extendedTool) => (
          <Group key={extendedTool.id} gap="xs" justify="space-between" className={classes.tool}>
            <Group gap="xs">
              <ThemeIcon size="md">
                <Text ff="var(--zinnia-font-monospace)" size="xs">
                  {extendedTool.iconLabel}
                </Text>
              </ThemeIcon>
              <Text size="sm">{extendedTool.name}</Text>
            </Group>

            <Group gap="xs">
              <Switch
                checked={toolIds.includes(extendedTool.id)}
                onClick={(event) =>
                  handleClickSwitchButton(extendedTool.id, event.currentTarget.checked)
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
