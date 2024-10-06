import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import { IntlShape, useIntl } from 'react-intl';
import { useFocusTrap } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { WorkspaceLayer } from '@/components/WorkspacePanel/WorkspacePanel';
import { errorMessage } from '@/utils/errorMessage';
import { Workspace } from '@/types/persistence/Workspace';
import { useCreateWorkspace } from '@/queries/useCreateWorkspace';

const formSchema = (formatMessage: IntlShape['formatMessage']) =>
  v.object({
    workspaceName: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, formatMessage({ id: errorMessage.notEmpty }))
    ),
  });

type FormValues = v.InferInput<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  workspaceName: '',
};

interface WorkspaceCreateFormProps {
  onChangeLayer: (layer: WorkspaceLayer) => void;
}

export function WorkspaceCreateForm({ onChangeLayer }: WorkspaceCreateFormProps) {
  const { formatMessage } = useIntl();
  const focusTrapRef = useFocusTrap();

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema(formatMessage)),
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
        <Text fw={500}>{formatMessage({ id: 'ui.workspacePanel.createTitle' })}</Text>
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

      <form onSubmit={handleFormSubmit} ref={focusTrapRef}>
        <TextInput
          placeholder={formatMessage({ id: 'ui.workspacePanel.workspaceName' })}
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
          {formatMessage({ id: 'common.create' })}
        </Button>
      </form>
    </Stack>
  );
}
