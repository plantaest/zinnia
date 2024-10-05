import { UseFormReturnType } from '@mantine/form';
import { ComboboxData } from '@mantine/core/lib/components/Combobox/Combobox.types';
import { MultiSelect } from '@mantine/core';
import { useIntl } from 'react-intl';
import { FilterPanelFormValues } from '@/components/FilterPanel/FilterPanel';
import { Filter } from '@/types/persistence/Filter';
import { useGetTags } from '@/queries/useGetTags';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

interface FilterTagSelectProps {
  currentFilter: Filter | null;
  selectedWikiIndex: number;
  form: UseFormReturnType<FilterPanelFormValues>;
}

export function FilterTagSelect({ currentFilter, selectedWikiIndex, form }: FilterTagSelectProps) {
  const { formatMessage } = useIntl();
  const { data: tags } = useGetTags(form.values.wikis[selectedWikiIndex].wikiId);

  const tagSelects: ComboboxData = tags
    ? tags.map((tag) => ({
        value: tag.name,
        label: tag.displayName ? sanitizeHtml(tag.displayName) : tag.name,
      }))
    : [];

  return (
    <MultiSelect
      searchable={tagSelects.length > 20}
      size="xs"
      label={formatMessage({ id: 'ui.filterPanel.tags' })}
      data={tagSelects}
      maxValues={1}
      comboboxProps={{ withinPortal: false }}
      style={{
        pointerEvents:
          !currentFilter || form.values.wikis[selectedWikiIndex].inherited ? 'none' : 'auto',
      }}
      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.selectedTags`)}
    />
  );
}
