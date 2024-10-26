import { ComboboxData, MultiSelect } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useIntl } from 'react-intl';
import { Filter } from '@/types/persistence/Filter';
import { FilterPanelFormValues } from '@/components/FilterPanel/FilterPanel';
import { useGetNamespaces } from '@/queries/useGetNamespaces';

interface FilterNamespaceSelectProps {
  currentFilter: Filter | null;
  selectedWikiIndex: number;
  form: UseFormReturnType<FilterPanelFormValues>;
}

export function FilterNamespaceSelect({
  currentFilter,
  selectedWikiIndex,
  form,
}: FilterNamespaceSelectProps) {
  const { formatMessage } = useIntl();
  const { data: namespaces } = useGetNamespaces(form.values.wikis[selectedWikiIndex].wikiId);

  const namespaceSelects: ComboboxData = namespaces
    ? namespaces.map((namespace) => ({
        value: String(namespace.id),
        label:
          namespace.name === '' ? formatMessage({ id: 'wiki.namespace.main' }) : namespace.name,
      }))
    : [];

  return (
    <MultiSelect
      size="xs"
      label={formatMessage({ id: 'ui.filterPanel.namespaces' })}
      data={namespaceSelects}
      comboboxProps={{ withinPortal: false }}
      style={{
        pointerEvents:
          !currentFilter || form.values.wikis[selectedWikiIndex].inherited ? 'none' : 'auto',
      }}
      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.selectedNamespaces`)}
    />
  );
}
