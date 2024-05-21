import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useFocusTrap } from '@mantine/hooks';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { WorkspaceLayer } from '@/components/WorkspacePanel/WorkspacePanel';
import { errorMessage } from '@/utils/errorMessage';
import { Workspace } from '@/types/persistence/Workspace';
import { useCreateWorkspace } from '@/queries/useCreateWorkspace';

const formSchema = (t: (key: string) => string) =>
  z.object({
    workspaceName: z.string().trim().min(1, t(errorMessage.notEmpty)),
  });

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  workspaceName: '',
};

interface WorkspaceCreateFormProps {
  onChangeLayer: (layer: WorkspaceLayer) => void;
}

export function WorkspaceCreateForm({ onChangeLayer }: WorkspaceCreateFormProps) {
  const { t } = useTranslation();
  const focusTrapRef = useFocusTrap();

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema(t)),
  });

  const createWorkspaceApi = useCreateWorkspace();

  const isDisabledSubmitButton = !form.isDirty();

  const handleFormSubmit = form.onSubmit((formValues) => {
    const now = dayjs().toISOString();

    const workspace: Workspace = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      name: formValues.workspaceName.trim(),
      filters: [],
      activeFilterId: null,
      tabs: [],
      activeTabId: null,
    };

    createWorkspaceApi.mutate(workspace, {
      onSuccess: () => onChangeLayer('list'),
    });
  });

  const handleClickBackButton = () => {
    onChangeLayer('list');
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{t('core:ui.workspacePanel.createTitle')}</Text>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={t('core:common.back')}
          aria-label={t('core:common.back')}
          onClick={handleClickBackButton}
        >
          <IconArrowLeft size="1.25rem" />
        </ActionIcon>
      </Group>

      <form onSubmit={handleFormSubmit} ref={focusTrapRef}>
        <TextInput
          placeholder={t('core:ui.workspacePanel.workspaceName')}
          {...form.getInputProps('workspaceName')}
        />

        <Button
          variant="light"
          type="submit"
          mt="xs"
          w="100%"
          disabled={isDisabledSubmitButton}
          loading={createWorkspaceApi.isPending}
        >
          {t('core:common.create')}
        </Button>
      </form>
    </Stack>
  );
}
