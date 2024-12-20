import { ActionIcon, Popover, Stack, useDirection } from '@mantine/core';
import { IconBoxMultiple } from '@tabler/icons-react';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { modals } from '@mantine/modals';
import { WorkspaceList } from '@/components/WorkspacePanel/WorkspaceList';
import { WorkspaceCreateForm } from '@/components/WorkspacePanel/WorkspaceCreateForm';
import { WorkspaceUpdateForm } from '@/components/WorkspacePanel/WorkspaceUpdateForm';
import { Workspace } from '@/types/persistence/Workspace';
import { useLargerThan } from '@/hooks/useLargerThan';
import { CloseModalButton } from '@/components/CloseModalButton/CloseModalButton';

export type WorkspaceLayer = 'list' | 'create' | 'update';

function WorkspacePanelContent() {
  const [layer, setLayer] = useState<WorkspaceLayer>('list');
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);

  const layers: Record<WorkspaceLayer, React.ReactNode> = {
    list: <WorkspaceList onChangeLayer={setLayer} onChangeCurrentWorkspace={setCurrentWorkspace} />,
    create: <WorkspaceCreateForm onChangeLayer={setLayer} />,
    update: <WorkspaceUpdateForm onChangeLayer={setLayer} workspace={currentWorkspace!} />,
  };

  return layers[layer];
}

export function WorkspacePanel() {
  const { formatMessage } = useIntl();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');

  const handleClickWorkspacesButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: (
        <Stack gap="xs">
          <CloseModalButton />
          <WorkspacePanelContent />
        </Stack>
      ),
    });

  return largerThanMd ? (
    <Popover
      width={300}
      position="top-start"
      shadow="lg"
      radius="md"
      trapFocus
      transitionProps={{ transition: dir === 'rtl' ? 'pop-bottom-right' : 'pop-bottom-left' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          title={formatMessage({ id: 'ui.workspacePanel.title' })}
          aria-label={formatMessage({ id: 'ui.workspacePanel.title' })}
        >
          <IconBoxMultiple size="1.5rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown py="xs" px="sm">
        <WorkspacePanelContent />
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      variant="subtle"
      size="lg"
      title={formatMessage({ id: 'ui.workspacePanel.title' })}
      aria-label={formatMessage({ id: 'ui.workspacePanel.title' })}
      onClick={handleClickWorkspacesButton}
    >
      <IconBoxMultiple size="1.5rem" />
    </ActionIcon>
  );
}
