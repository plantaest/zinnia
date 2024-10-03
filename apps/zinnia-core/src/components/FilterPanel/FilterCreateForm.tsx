import { useTranslation } from 'react-i18next';
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

const formSchema = (t: (key: string) => string) =>
  v.object({
    filterName: v.pipe(v.string(), v.trim(), v.minLength(1, t(errorMessage.notEmpty))),
  });

type FormValues = v.InferInput<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  filterName: '',
};

interface FilterCreateFormProps {
  onChangeLayer: (layer: FilterLayer) => void;
}

export function FilterCreateForm({ onChangeLayer }: FilterCreateFormProps) {
  const { t } = useTranslation();
  const focusTrapRef = useFocusTrap();

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema(t)),
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
        <Text fw={500}>{t('core:ui.filterPanel.createTitle')}</Text>
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
          placeholder={t('core:ui.filterPanel.filterName')}
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
          {t('core:common.create')}
        </Button>
      </form>
    </Stack>
  );
}
