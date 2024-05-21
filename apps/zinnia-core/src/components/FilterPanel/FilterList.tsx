import { ActionIcon, Button, Group, Stack, Text } from '@mantine/core';
import { IconPinned, IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { FilterLayer } from '@/components/FilterPanel/FilterLayer';
import { appState } from '@/states/appState';
import { appConfig } from '@/config/appConfig';
import { Filter } from '@/types/persistence/Filter';

interface FilterListProps {
  onChangeLayer: (layer: FilterLayer) => void;
  currentFilter: Filter | null;
  onChangeCurrentFilter: (filter: Filter | null) => void;
}

export function FilterList({
  onChangeLayer,
  currentFilter,
  onChangeCurrentFilter,
}: FilterListProps) {
  const { t } = useTranslation();

  const activeWorkspaceId = appState.userConfig.activeWorkspaceId.get();
  const filters = appState.ui.activeWorkspace.filters.get() ?? [];
  const activeFilterId = appState.ui.activeWorkspace.activeFilterId.get();

  const handleClickCreateFilterButton = () => {
    onChangeLayer('create');
  };

  const handleClickFilterButton = (filter: Filter) => {
    onChangeCurrentFilter(filter);
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{t('core:ui.filterPanel.title')}</Text>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={t('core:ui.filterPanel.createTitle')}
          aria-label={t('core:ui.filterPanel.createTitle')}
          onClick={handleClickCreateFilterButton}
          disabled={!activeWorkspaceId || filters.length >= appConfig.MAX_FILTER_LIMIT}
        >
          <IconPlus size="1.25rem" />
        </ActionIcon>
      </Group>

      {filters.length > 0 && (
        <Stack gap={5}>
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant={filter.id === currentFilter?.id ? 'filled' : 'light'}
              justify="space-between"
              rightSection={filter.id === activeFilterId && <IconPinned size="1rem" />}
              onClick={() => handleClickFilterButton(filter)}
            >
              {filter.name}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  );
}
