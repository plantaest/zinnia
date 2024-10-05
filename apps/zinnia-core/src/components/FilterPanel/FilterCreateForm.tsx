import { useIntl } from 'react-intl';
import { useFocusTrap } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { ActionIcon, Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import {
  defaultFilterFeedConfig,
  defaultFilterGlobalWikiConfig,
  Filter,
} from '@/types/persistence/Filter';
import { useCreateFilter } from '@/queries/useCreateFilter';
import { FilterLayer } from '@/components/FilterPanel/FilterLayer';
import { errorMessage } from '@/utils/errorMessage';

const formSchema = (formatMessage: ({ id }: { id: string }) => string) =>
  v.object({
    filterName: v.pipe(
      v.string(),
      v.trim(),
      v.minLength(1, formatMessage({ id: errorMessage.notEmpty }))
    ),
  });

type FormValues = v.InferInput<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  filterName: '',
};

interface FilterCreateFormProps {
  onChangeLayer: (layer: FilterLayer) => void;
}

export function FilterCreateForm({ onChangeLayer }: FilterCreateFormProps) {
  const { formatMessage } = useIntl();
  const focusTrapRef = useFocusTrap();

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema(formatMessage)),
  });

  const createFilterApi = useCreateFilter();

  const isDisabledSubmitButton = !form.isDirty();

  const handleFormSubmit = form.onSubmit((formValues) => {
    const now = dayjs().toISOString();

    const filter: Filter = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      name: formValues.filterName.trim(),
      feed: defaultFilterFeedConfig,
      wikis: [defaultFilterGlobalWikiConfig],
    };

    createFilterApi.mutate(filter, {
      onSuccess: () => onChangeLayer('list'),
    });
  });

  const handleClickBackButton = () => {
    onChangeLayer('list');
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.filterPanel.createTitle' })}</Text>
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
          placeholder={formatMessage({ id: 'ui.filterPanel.filterName' })}
          {...form.getInputProps('filterName')}
        />

        <Button
          variant="light"
          type="submit"
          mt="xs"
          w="100%"
          disabled={isDisabledSubmitButton}
          loading={createFilterApi.isPending}
        >
          {formatMessage({ id: 'common.create' })}
        </Button>
      </form>
    </Stack>
  );
}
