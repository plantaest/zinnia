import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { IntlShape, useIntl } from 'react-intl';
import { useFocusTrap } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { WorkspaceLayer } from '@/components/WorkspacePanel/WorkspacePanel';
import { errorMessage } from '@/utils/errorMessage';
import { Workspace } from '@/types/persistence/Workspace';
import { useDeleteWorkspace } from '@/queries/useDeleteWorkspace';
import { useUpdateWorkspace } from '@/queries/useUpdateWorkspace';

const formSchema = (formatMessage: IntlShape['formatMessage']) =>
  v.object({
    workspaceName: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, formatMessage({ id: errorMessage.notEmpty }))
    ),
  });

type FormValues = v.InferInput<ReturnType<typeof formSchema>>;

interface WorkspaceUpdateFormProps {
  onChangeLayer: (layer: WorkspaceLayer) => void;
  workspace: Workspace;
}

export function WorkspaceUpdateForm({ onChangeLayer, workspace }: WorkspaceUpdateFormProps) {
  const { formatMessage } = useIntl();
  const focusTrapRef = useFocusTrap();

  const initialFormValues: FormValues = {
    workspaceName: workspace.name,
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema(formatMessage)),
  });

  const updateWorkspaceApi = useUpdateWorkspace();
  const deleteWorkspaceApi = useDeleteWorkspace();

  const isDisabledSubmitButton = !form.isDirty();

  const handleFormSubmit = form.onSubmit((formValues) => {
    const now = dayjs().toISOString();

    const updatedWorkspace: Workspace = {
      id: workspace.id,
      createdAt: workspace.createdAt,
      updatedAt: now,
      name: formValues.workspaceName.trim(),
      filters: workspace.filters,
      activeFilterId: workspace.activeFilterId,
      tabs: workspace.tabs,
      activeTabId: workspace.activeTabId,
    };

    updateWorkspaceApi.mutate(updatedWorkspace, {
      onSuccess: () => onChangeLayer('list'),
    });
  });

  const handleClickDeleteButton = () => {
    deleteWorkspaceApi.mutate(workspace.id, {
      onSuccess: () => onChangeLayer('list'),
    });
  };

  return (
    <Stack gap="xs">
      <Group justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.workspacePanel.updateTitle' })}</Text>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={formatMessage({ id: 'common.back' })}
          aria-label={formatMessage({ id: 'common.back' })}
          onClick={() => onChangeLayer('list')}
        >
          <IconArrowLeft size="1.25rem" />
        </ActionIcon>
      </Group>

      <form onSubmit={handleFormSubmit} ref={focusTrapRef}>
        <TextInput
          placeholder={formatMessage({ id: 'ui.workspacePanel.workspaceName' })}
          {...form.getInputProps('workspaceName')}
        />

        <Group gap="xs" mt="xs">
          <Button
            color="red"
            variant="light"
            flex={1}
            onClick={handleClickDeleteButton}
            loading={deleteWorkspaceApi.isPending}
          >
            {formatMessage({ id: 'common.delete' })}
          </Button>
          <Button
            variant="light"
            type="submit"
            flex={1}
            disabled={isDisabledSubmitButton}
            loading={updateWorkspaceApi.isPending}
          >
            {formatMessage({ id: 'common.update' })}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
