import { ActionIcon, Button, CloseButton, Group, Stack, Text } from '@mantine/core';
import { IconEdit, IconPlus } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { modals } from '@mantine/modals';
import { appState } from '@/states/appState';
import { WorkspaceLayer } from '@/components/WorkspacePanel/WorkspacePanel';
import { Workspace } from '@/types/persistence/Workspace';
import { useSelectWorkspace } from '@/queries/useSelectWorkspace';
import { appConfig } from '@/config/appConfig';
import { useLargerThan } from '@/hooks/useLargerThan';

interface WorkspaceListProps {
  onChangeLayer: (layer: WorkspaceLayer) => void;
  onChangeCurrentWorkspace: (workspace: Workspace | null) => void;
}

export function WorkspaceList({ onChangeLayer, onChangeCurrentWorkspace }: WorkspaceListProps) {
  const { formatMessage } = useIntl();
  const largerThanMd = useLargerThan('md');

  const workspaces = useSelector(() => appState.userConfig.workspaces.get() ?? []);
  const activeWorkspaceId = useSelector(appState.userConfig.activeWorkspaceId);

  const selectWorkspaceApi = useSelectWorkspace();

  const handleClickCreateWorkspaceButton = () => {
    onChangeLayer('create');
  };

  const handleClickWorkspaceButton = (workspaceId: string) => {
    if (workspaceId !== activeWorkspaceId) {
      selectWorkspaceApi.mutate(workspaceId);
    }
  };

  const handleClickUpdateWorkspaceButton = (workspace: Workspace) => {
    onChangeLayer('update');
    onChangeCurrentWorkspace(workspace);
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Group gap="xs">
          {/* TODO: aria-label */}
          {!largerThanMd && <CloseButton onClick={modals.closeAll} variant="subtle" />}
          <Text fw={500}>{formatMessage({ id: 'ui.workspacePanel.title' })}</Text>
        </Group>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={formatMessage({ id: 'ui.workspacePanel.createTitle' })}
          aria-label={formatMessage({ id: 'ui.workspacePanel.createTitle' })}
          onClick={handleClickCreateWorkspaceButton}
          disabled={workspaces.length >= appConfig.MAX_WORKSPACE_LIMIT}
        >
          <IconPlus size="1.25rem" />
        </ActionIcon>
      </Group>

      {workspaces.length > 0 && (
        <Stack gap={5}>
          {workspaces.map((workspace) => (
            <Group key={workspace.id} gap="xs" wrap="nowrap">
              <Button
                variant={workspace.id === activeWorkspaceId ? 'filled' : 'light'}
                justify="space-between"
                flex={1}
                onClick={() => handleClickWorkspaceButton(workspace.id)}
                loading={
                  workspace.id === selectWorkspaceApi.variables && selectWorkspaceApi.isPending
                }
              >
                {workspace.name}
              </Button>
              <ActionIcon
                variant="transparent"
                color="gray"
                title={formatMessage({ id: 'ui.workspacePanel.updateTitle' })}
                aria-label={formatMessage({ id: 'ui.workspacePanel.updateTitle' })}
                onClick={() => handleClickUpdateWorkspaceButton(workspace)}
              >
                <IconEdit size="1.25rem" />
              </ActionIcon>
            </Group>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
