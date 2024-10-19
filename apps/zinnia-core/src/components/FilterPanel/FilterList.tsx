import { ActionIcon, Button, CloseButton, Group, Stack, Text } from '@mantine/core';
import { IconPinned, IconPlus } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { modals } from '@mantine/modals';
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
  const { formatMessage } = useIntl();

  const activeWorkspaceId = useSelector(appState.userConfig.activeWorkspaceId);
  const filters = useSelector(() => appState.ui.activeWorkspace.filters.get() ?? []);
  const activeFilterId = useSelector(appState.ui.activeWorkspace.activeFilterId);

  const handleClickCreateFilterButton = () => {
    onChangeLayer('create');
  };

  const handleClickFilterButton = (filter: Filter) => {
    onChangeCurrentFilter(filter);
  };

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Group gap="xs">
          <CloseButton
            onClick={modals.closeAll}
            variant="subtle"
            aria-label={formatMessage({ id: 'common.close' })}
            hiddenFrom="md"
          />
          <Text fw={500}>{formatMessage({ id: 'ui.filterPanel.title' })}</Text>
        </Group>
        <ActionIcon
          variant="transparent"
          color="gray"
          title={formatMessage({ id: 'ui.filterPanel.createTitle' })}
          aria-label={formatMessage({ id: 'ui.filterPanel.createTitle' })}
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
