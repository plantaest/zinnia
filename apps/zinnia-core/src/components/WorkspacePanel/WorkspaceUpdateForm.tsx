import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '@mantine/hooks';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import dayjs from 'dayjs';
import { WorkspaceLayer } from '@/components/WorkspacePanel/WorkspacePanel';
import { errorMessage } from '@/utils/errorMessage';
import { Workspace } from '@/types/persistence/Workspace';
import { useDeleteWorkspace } from '@/queries/useDeleteWorkspace';
import { useUpdateWorkspace } from '@/queries/useUpdateWorkspace';

const formSchema = (t: (key: string) => string) =>
  z.object({
    workspaceName: z.string().trim().min(1, t(errorMessage.notEmpty)),
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

interface WorkspaceUpdateFormProps {
  onChangeLayer: (layer: WorkspaceLayer) => void;
  workspace: Workspace;
}

export function WorkspaceUpdateForm({ onChangeLayer, workspace }: WorkspaceUpdateFormProps) {
  const { t } = useTranslation();
  const focusTrapRef = useFocusTrap();

  const initialFormValues: FormValues = {
    workspaceName: workspace.name,
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema(t)),
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
        <Text fw={500}>{t('core:ui.workspacePanel.updateTitle')}</Text>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={t('core:common.back')}
          aria-label={t('core:common.back')}
          onClick={() => onChangeLayer('list')}
        >
          <IconArrowLeft size="1.25rem" />
        </ActionIcon>
      </Group>

      <form onSubmit={handleFormSubmit} ref={focusTrapRef}>
        <TextInput
          placeholder={t('core:ui.workspacePanel.workspaceName')}
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
            {t('core:common.delete')}
          </Button>
          <Button
            variant="light"
            type="submit"
            flex={1}
            disabled={isDisabledSubmitButton}
            loading={updateWorkspaceApi.isPending}
          >
            {t('core:common.update')}
          </Button>
        </Group>
      </form>
    </Stack>
  );
}
