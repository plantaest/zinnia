import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  Group,
  NumberInput,
  Popover,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import { IconFilter, IconTrash } from '@tabler/icons-react';
import { DateTimePicker } from '@mantine/dates';
import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import dayjs from 'dayjs';
import { createFormActions, useForm, zodResolver } from '@mantine/form';
import { FilterLayer } from '@/components/FilterPanel/FilterLayer';
import { FilterList } from '@/components/FilterPanel/FilterList';
import { FilterCreateForm } from '@/components/FilterPanel/FilterCreateForm';
import { appState } from '@/states/appState';
import { errorMessage } from '@/utils/errorMessage';
import { Filter } from '@/types/persistence/Filter';
import { useUpdateFilter } from '@/queries/useUpdateFilter';
import { useSelectFilter } from '@/queries/useSelectFilter';
import { useDeleteFilter } from '@/queries/useDeleteFilter';
import { FilterAddWikiForm } from '@/components/FilterPanel/FilterAddWikiForm';
import { appConfig } from '@/config/appConfig';
import { FilterNamespaceSelect } from '@/components/FilterPanel/FilterNamespaceSelect';
import { FilterTagSelect } from '@/components/FilterPanel/FilterTagSelect';
import { useGetRightsOnWikis } from '@/queries/useGetRightsOnWikis';
import { MwHelper } from '@/utils/MwHelper';

const formSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().trim().min(1, t(errorMessage.notEmpty)),
      feed: z.object({
        liveUpdates: z.boolean(),
        paginated: z.boolean(),
        groupedByPage: z.boolean(),
        invertedDirection: z.boolean(),
        smallWikis: z.boolean(),
        additionalWikis: z.boolean(),
        limit: z.string(),
        interval: z.number({ invalid_type_error: t(errorMessage.notEmpty) }),
        timeframe: z.object({
          start: z.enum(['now', 'timestamp']),
          startTimestamp: z.date().nullable(),
          end: z.enum(['period', 'timestamp']),
          endPeriod: z.string().nullable(),
          endTimestamp: z.date().nullable(),
        }),
      }),
      wikis: z
        .array(
          z.object({
            wikiId: z.union([z.literal('global'), z.string()]),
            inherited: z.boolean(),
            config: z.object({
              selectedNamespaces: z.array(z.string()),
              selectedTags: z.array(z.string()),
              pageTitle: z.string(),
              username: z.string(),
              unregistered: z.boolean(),
              registered: z.boolean(),
              bot: z.boolean(),
              human: z.boolean(),
              unpatrolled: z.boolean(),
              patrolled: z.boolean(),
              autopatrolled: z.boolean(),
              minorEdits: z.boolean(),
              nonMinorEdits: z.boolean(),
              redirect: z.boolean(),
              nonRedirect: z.boolean(),
              latestRevision: z.boolean(),
              pageEdits: z.boolean(),
              pageCreations: z.boolean(),
              categoryChanges: z.boolean(),
              loggedActions: z.boolean(),
              wikidataEdits: z.boolean(),
            }),
          })
        )
        .min(1),
    })
    .refine(
      (schema) => schema.feed.timeframe.start === 'now' || schema.feed.timeframe.startTimestamp,
      {
        message: t(errorMessage.notEmpty),
        path: ['feed.timeframe.startTimestamp'],
      }
    )
    .refine(
      (schema) => schema.feed.timeframe.end === 'timestamp' || schema.feed.timeframe.endPeriod,
      {
        message: t(errorMessage.notEmpty),
        path: ['feed.timeframe.endPeriod'],
      }
    )
    .refine(
      (schema) => schema.feed.timeframe.end === 'period' || schema.feed.timeframe.endTimestamp,
      {
        message: t(errorMessage.notEmpty),
        path: ['feed.timeframe.endTimestamp'],
      }
    )
    .refine(
      (schema) =>
        !(
          schema.feed.timeframe.startTimestamp &&
          schema.feed.timeframe.endTimestamp &&
          dayjs(schema.feed.timeframe.startTimestamp).isBefore(schema.feed.timeframe.endTimestamp)
        ),
      {
        message: t(errorMessage.startAfterEnd),
        path: ['feed.timeframe.startTimestamp'],
      }
    );

export type FilterPanelFormValues = z.infer<ReturnType<typeof formSchema>>;

const defaultInitialFormValues: FilterPanelFormValues = {
  name: '',
  feed: {
    liveUpdates: false,
    paginated: false,
    groupedByPage: false,
    invertedDirection: false,
    smallWikis: false,
    additionalWikis: false,
    limit: '25',
    interval: 5,
    timeframe: {
      start: 'now',
      startTimestamp: null,
      end: 'period',
      endPeriod: 'P7D',
      endTimestamp: null,
    },
  },
  wikis: [
    {
      wikiId: 'global',
      inherited: false,
      config: {
        selectedNamespaces: [],
        selectedTags: [],
        pageTitle: '',
        username: '',
        unregistered: true,
        registered: true,
        bot: false,
        human: true,
        unpatrolled: true,
        patrolled: true,
        autopatrolled: true,
        minorEdits: true,
        nonMinorEdits: true,
        redirect: true,
        nonRedirect: true,
        latestRevision: false,
        pageEdits: true,
        pageCreations: true,
        categoryChanges: false,
        loggedActions: false,
        wikidataEdits: false,
      },
    },
  ],
};

const getInitialFormValues = (filter: Filter): FilterPanelFormValues => ({
  name: filter.name,
  feed: {
    liveUpdates: filter.feed.liveUpdates,
    paginated: filter.feed.paginated,
    groupedByPage: filter.feed.groupedByPage,
    invertedDirection: filter.feed.invertedDirection,
    smallWikis: filter.feed.smallWikis,
    additionalWikis: filter.feed.additionalWikis,
    limit: String(filter.feed.limit),
    interval: filter.feed.interval,
    timeframe: {
      start: filter.feed.timeframe.start === 'now' ? 'now' : 'timestamp',
      startTimestamp: dayjs(filter.feed.timeframe.start).isValid()
        ? dayjs(filter.feed.timeframe.start).toDate()
        : null,
      end: dayjs(filter.feed.timeframe.end).isValid() ? 'timestamp' : 'period',
      endPeriod: dayjs(filter.feed.timeframe.end).isValid() ? null : filter.feed.timeframe.end,
      endTimestamp: dayjs(filter.feed.timeframe.end).isValid()
        ? dayjs(filter.feed.timeframe.end).toDate()
        : null,
    },
  },
  wikis: filter.wikis.map((wiki) => ({
    wikiId: wiki.wikiId,
    inherited: wiki.inherited,
    config: {
      selectedNamespaces: wiki.config?.selectedNamespaces ?? [],
      selectedTags: wiki.config?.selectedTags ?? [],
      pageTitle: wiki.config?.pageTitle ?? '',
      username: wiki.config?.username ?? '',
      unregistered: wiki.config?.unregistered ?? true,
      registered: wiki.config?.registered ?? true,
      bot: wiki.config?.bot ?? false,
      human: wiki.config?.human ?? true,
      unpatrolled: wiki.config?.unpatrolled ?? true,
      patrolled: wiki.config?.patrolled ?? true,
      autopatrolled: wiki.config?.autopatrolled ?? true,
      minorEdits: wiki.config?.minorEdits ?? true,
      nonMinorEdits: wiki.config?.nonMinorEdits ?? true,
      redirect: wiki.config?.redirect ?? true,
      nonRedirect: wiki.config?.nonRedirect ?? true,
      latestRevision: wiki.config?.latestRevision ?? false,
      pageEdits: wiki.config?.pageEdits ?? true,
      pageCreations: wiki.config?.pageCreations ?? true,
      categoryChanges: wiki.config?.categoryChanges ?? false,
      loggedActions: wiki.config?.loggedActions ?? false,
      wikidataEdits: wiki.config?.wikidataEdits ?? false,
    },
  })),
});

const formName = 'filter-panel-form';

export const filterPanelFormAction = createFormActions<FilterPanelFormValues>(formName);

function FilterPanelContent() {
  const { t } = useTranslation();
  const computedColorScheme = useComputedColorScheme();
  const activeFilter = appState.ui.activeFilter.get();

  const [layer, setLayer] = useState<FilterLayer>('list');
  const [currentFilter, setCurrentFilter] = useState(activeFilter);

  const layers: Record<FilterLayer, React.ReactNode> = {
    list: (
      <FilterList
        onChangeLayer={setLayer}
        currentFilter={currentFilter}
        onChangeCurrentFilter={setCurrentFilter}
      />
    ),
    create: <FilterCreateForm onChangeLayer={setLayer} />,
  };

  const form = useForm({
    name: formName,
    initialValues: currentFilter ? getInitialFormValues(currentFilter) : defaultInitialFormValues,
    validate: zodResolver(formSchema(t)),
  });

  const [selectedWikiIndex, setSelectedWikiIndex] = useState(0);

  useEffect(() => {
    const initialFormValues = currentFilter
      ? getInitialFormValues(currentFilter)
      : defaultInitialFormValues;
    form.setInitialValues(initialFormValues);
    form.setValues(initialFormValues);
    setSelectedWikiIndex(0);
  }, [currentFilter]);

  const updateFilterApi = useUpdateFilter();
  const selectFilterApi = useSelectFilter();
  const deleteFilterApi = useDeleteFilter();

  const isDisabledSubmitButton = !form.isDirty();

  const handleFormSubmit = form.onSubmit((formValues) => {
    if (currentFilter) {
      const now = dayjs().toISOString();

      const filter: Filter = {
        id: currentFilter.id,
        createdAt: currentFilter.createdAt,
        updatedAt: now,
        name: formValues.name.trim(),
        feed: {
          liveUpdates: formValues.feed.liveUpdates,
          paginated: formValues.feed.paginated,
          groupedByPage: formValues.feed.groupedByPage,
          invertedDirection: formValues.feed.invertedDirection,
          smallWikis: formValues.feed.smallWikis,
          additionalWikis: formValues.feed.additionalWikis,
          limit: Number(formValues.feed.limit),
          interval: formValues.feed.interval,
          timeframe: {
            start:
              formValues.feed.timeframe.start === 'now'
                ? 'now'
                : dayjs(formValues.feed.timeframe.startTimestamp).toISOString(),
            end:
              formValues.feed.timeframe.end === 'period'
                ? formValues.feed.timeframe.endPeriod!
                : dayjs(formValues.feed.timeframe.endTimestamp).toISOString(),
          },
        },
        wikis: formValues.wikis.map((wiki) => ({
          wikiId: wiki.wikiId,
          ...(wiki.inherited
            ? {
                inherited: wiki.inherited,
                config: null,
              }
            : {
                inherited: wiki.inherited,
                config: {
                  selectedNamespaces: wiki.config.selectedNamespaces,
                  selectedTags: wiki.config.selectedTags,
                  pageTitle: wiki.config.pageTitle.trim() || null,
                  username: wiki.config.username.trim() || null,
                  unregistered: wiki.config.unregistered,
                  registered: wiki.config.registered,
                  bot: wiki.config.bot,
                  human: wiki.config.human,
                  unpatrolled: wiki.config.unpatrolled,
                  patrolled: wiki.config.patrolled,
                  autopatrolled: wiki.config.autopatrolled,
                  minorEdits: wiki.config.minorEdits,
                  nonMinorEdits: wiki.config.nonMinorEdits,
                  redirect: wiki.config.redirect,
                  nonRedirect: wiki.config.nonRedirect,
                  latestRevision: wiki.config.latestRevision,
                  pageEdits: wiki.config.pageEdits,
                  pageCreations: wiki.config.pageCreations,
                  categoryChanges: wiki.config.categoryChanges,
                  loggedActions: wiki.config.loggedActions,
                  wikidataEdits: wiki.config.wikidataEdits,
                },
              }),
        })),
      };

      updateFilterApi.mutate(filter, {
        onSuccess: () => form.resetDirty(),
      });
    }
  });

  const handleClickSelectButton = () => {
    if (currentFilter) {
      selectFilterApi.mutate(currentFilter.id);
    }
  };

  const handleClickDeleteButton = () => {
    if (currentFilter) {
      deleteFilterApi.mutate(currentFilter.id, {
        onSuccess: () => setCurrentFilter(null),
      });
    }
  };

  const handleClickDeleteWikiButton = () => {
    form.removeListItem('wikis', selectedWikiIndex);
    setSelectedWikiIndex(0);
  };

  // Disable patrol-related checkboxes when the user does not have patrol right on that wiki.
  const wikiIds = form.values.wikis
    .filter((wiki) => wiki.wikiId !== 'global')
    .map((wiki) => wiki.wikiId);

  const currentWikiId = form.values.wikis[selectedWikiIndex].wikiId;

  const { data: rightsOnWikis = {} } = useGetRightsOnWikis(wikiIds);

  const isDisabledPatrolRelatedCheckboxes =
    currentWikiId !== 'global' && !MwHelper.hasPatrolRight(rightsOnWikis[currentWikiId] ?? []);

  return (
    <Stack gap="xs">
      <Grid gutter="sm">
        <Grid.Col span={3}>
          <Stack justify="space-between" h="100%">
            {layers[layer]}
            <Stack gap="xs">
              <Group gap="xs">
                <Button
                  variant="light"
                  disabled={!currentFilter || currentFilter?.id === activeFilter?.id}
                  onClick={handleClickSelectButton}
                  loading={selectFilterApi.isPending}
                  flex={1}
                >
                  {t('core:common.select')}
                </Button>
                <Button
                  variant="light"
                  type="submit"
                  form={formName}
                  disabled={!currentFilter || isDisabledSubmitButton}
                  loading={updateFilterApi.isPending}
                  flex={1}
                >
                  {t('core:common.save')}
                </Button>
              </Group>
              <Group gap="xs">
                <Button
                  color="red"
                  variant="light"
                  disabled={!currentFilter}
                  onClick={handleClickDeleteButton}
                  loading={deleteFilterApi.isPending}
                  flex={1}
                >
                  {t('core:common.delete')}
                </Button>
                <Button
                  variant="light"
                  disabled={
                    !currentFilter || (Object.keys(form.errors).length === 0 && !form.isDirty())
                  }
                  onClick={form.reset}
                  flex={1}
                >
                  {t('core:common.reset')}
                </Button>
              </Group>
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col span={9}>
          <form id={formName} onSubmit={handleFormSubmit}>
            <Stack gap="xs">
              <Card
                p="xs"
                style={{
                  overflow: 'initial',
                  backgroundColor:
                    computedColorScheme === 'dark'
                      ? 'var(--mantine-color-dark-5)'
                      : 'var(--mantine-color-gray-1)',
                }}
              >
                <Stack gap="xs">
                  <Grid gutter="xs">
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Divider label={t('core:ui.filterPanel.filterName')} labelPosition="left" />
                        <TextInput
                          size="xs"
                          disabled={!currentFilter}
                          {...form.getInputProps('name')}
                        />
                        <Divider label={t('core:ui.filterPanel.feed')} labelPosition="left" />
                        <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.liveUpdates')}
                            disabled={!currentFilter}
                            {...form.getInputProps('feed.liveUpdates', { type: 'checkbox' })}
                          />
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.paginated')}
                            // TODO: Paginated
                            disabled={!currentFilter || true}
                            {...form.getInputProps('feed.paginated', { type: 'checkbox' })}
                          />
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.groupedByPage')}
                            // TODO: Grouped by page
                            disabled={!currentFilter || true}
                            {...form.getInputProps('feed.groupedByPage', {
                              type: 'checkbox',
                            })}
                          />
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.invertedDirection')}
                            disabled={!currentFilter}
                            {...form.getInputProps('feed.invertedDirection', {
                              type: 'checkbox',
                            })}
                          />
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.smallWikis')}
                            // TODO: Small wikis
                            disabled={!currentFilter || true}
                            {...form.getInputProps('feed.smallWikis', { type: 'checkbox' })}
                          />
                          <Checkbox
                            size="xs"
                            label={t('core:ui.filterPanel.additionalWikis')}
                            // TODO: Additional wikis
                            disabled={!currentFilter || true}
                            {...form.getInputProps('feed.additionalWikis', {
                              type: 'checkbox',
                            })}
                          />
                        </SimpleGrid>
                        <SimpleGrid cols={2} spacing="xs" verticalSpacing="xs">
                          <Select
                            size="xs"
                            label={t('core:ui.filterPanel.limit')}
                            allowDeselect={false}
                            data={appConfig.FEED_LIMITS}
                            comboboxProps={{ withinPortal: false }}
                            disabled={!currentFilter}
                            {...form.getInputProps('feed.limit')}
                          />
                          <NumberInput
                            size="xs"
                            label={t('core:ui.filterPanel.interval')}
                            min={5}
                            max={60}
                            disabled={!currentFilter || !form.values.feed.liveUpdates}
                            {...form.getInputProps('feed.interval')}
                          />
                        </SimpleGrid>
                      </Stack>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Stack gap="xs">
                        <Divider label={t('core:ui.filterPanel.timeframe')} labelPosition="left" />
                        <Text size="xs" fw={500}>
                          {t('core:ui.filterPanel.start')}
                        </Text>
                        <Radio.Group {...form.getInputProps('feed.timeframe.start')}>
                          <Stack gap={5}>
                            <Radio
                              size="xs"
                              value="now"
                              label={t('core:ui.filterPanel.now')}
                              disabled={!currentFilter}
                            />
                            <Group gap="xs">
                              <Radio
                                size="xs"
                                value="timestamp"
                                label={t('core:ui.filterPanel.timestamp')}
                                flex={1}
                                disabled={!currentFilter}
                              />
                              <DateTimePicker
                                styles={{ input: { height: 32 } }}
                                withSeconds
                                size="xs"
                                popoverProps={{
                                  withinPortal: false,
                                }}
                                flex={1.5}
                                minDate={dayjs().subtract(30, 'd').toDate()}
                                maxDate={dayjs().toDate()}
                                disabled={
                                  !currentFilter || form.values.feed.timeframe.start === 'now'
                                }
                                {...form.getInputProps('feed.timeframe.startTimestamp')}
                              />
                            </Group>
                          </Stack>
                        </Radio.Group>
                        <Text size="xs" fw={500}>
                          {t('core:ui.filterPanel.end')}
                        </Text>
                        <Radio.Group {...form.getInputProps('feed.timeframe.end')}>
                          <Stack gap={5}>
                            <Group gap="xs">
                              <Radio
                                size="xs"
                                value="period"
                                label={t('core:ui.filterPanel.period')}
                                flex={1}
                                disabled={!currentFilter}
                              />
                              <Select
                                allowDeselect={false}
                                size="xs"
                                data={appConfig.TIMEFRAME_END_PERIODS}
                                comboboxProps={{ withinPortal: false }}
                                flex={1.5}
                                maxDropdownHeight={240}
                                disabled={
                                  !currentFilter || form.values.feed.timeframe.end === 'timestamp'
                                }
                                {...form.getInputProps('feed.timeframe.endPeriod')}
                              />
                            </Group>
                            <Group gap="xs">
                              <Radio
                                size="xs"
                                value="timestamp"
                                label={t('core:ui.filterPanel.timestamp')}
                                flex={1}
                                disabled={!currentFilter}
                              />
                              <DateTimePicker
                                styles={{ input: { height: 32 } }}
                                withSeconds
                                size="xs"
                                popoverProps={{
                                  withinPortal: false,
                                }}
                                flex={1.5}
                                minDate={dayjs().subtract(30, 'd').toDate()}
                                maxDate={dayjs().toDate()}
                                disabled={
                                  !currentFilter || form.values.feed.timeframe.end === 'period'
                                }
                                {...form.getInputProps('feed.timeframe.endTimestamp')}
                              />
                            </Group>
                          </Stack>
                        </Radio.Group>
                      </Stack>
                    </Grid.Col>
                  </Grid>
                  <Group gap="xs">
                    <Divider label={t('core:common.wiki')} labelPosition="left" flex={1} />
                    {form.values.wikis[selectedWikiIndex].wikiId !== 'global' && (
                      <Checkbox
                        size="xs"
                        label={t('core:ui.filterPanel.inherited')}
                        {...form.getInputProps(`wikis.${selectedWikiIndex}.inherited`, {
                          type: 'checkbox',
                        })}
                      />
                    )}
                    <Select
                      size="xs"
                      allowDeselect={false}
                      data={form.values.wikis.map((w, i) => ({
                        value: String(i),
                        label: w.wikiId,
                      }))}
                      value={String(selectedWikiIndex)}
                      onChange={(value) => setSelectedWikiIndex(Number(value ?? 0))}
                      comboboxProps={{ withinPortal: false }}
                      disabled={!currentFilter}
                    />
                    <FilterAddWikiForm
                      currentFilter={currentFilter}
                      formWikisLength={form.values.wikis.length}
                    />
                    <ActionIcon
                      size="sm"
                      variant="transparent"
                      color="red.5"
                      disabled={
                        !currentFilter || form.values.wikis[selectedWikiIndex].wikiId === 'global'
                      }
                      onClick={handleClickDeleteWikiButton}
                      title={t('core:ui.filterPanel.deleteWiki')}
                      aria-label={t('core:ui.filterPanel.deleteWiki')}
                    >
                      <IconTrash size="1rem" />
                    </ActionIcon>
                  </Group>
                  <SimpleGrid cols={2} spacing="xs" verticalSpacing={5}>
                    <FilterNamespaceSelect
                      currentFilter={currentFilter}
                      selectedWikiIndex={selectedWikiIndex}
                      form={form}
                    />
                    <FilterTagSelect
                      currentFilter={currentFilter}
                      selectedWikiIndex={selectedWikiIndex}
                      form={form}
                    />
                    <TextInput
                      size="xs"
                      label={t('core:ui.filterPanel.pageTitle')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.pageTitle`)}
                    />
                    <TextInput
                      size="xs"
                      label={t('core:ui.filterPanel.username')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.username`)}
                    />
                  </SimpleGrid>
                  <SimpleGrid cols={3} spacing="xs" verticalSpacing="xs">
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.unregistered')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.unregistered`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.registered')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.registered`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.bot')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.bot`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.human')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.human`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.unpatrolled')}
                      disabled={
                        !currentFilter ||
                        form.values.wikis[selectedWikiIndex].inherited ||
                        isDisabledPatrolRelatedCheckboxes
                      }
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.unpatrolled`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.patrolled')}
                      disabled={
                        !currentFilter ||
                        form.values.wikis[selectedWikiIndex].inherited ||
                        isDisabledPatrolRelatedCheckboxes
                      }
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.patrolled`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.autopatrolled')}
                      disabled={
                        !currentFilter ||
                        form.values.wikis[selectedWikiIndex].inherited ||
                        isDisabledPatrolRelatedCheckboxes
                      }
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.autopatrolled`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.minorEdits')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.minorEdits`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.nonMinorEdits')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.nonMinorEdits`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.redirect')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.redirect`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.nonRedirect')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.nonRedirect`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.latestRevision')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.latestRevision`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.pageEdits')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.pageEdits`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.pageCreations')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.pageCreations`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.categoryChanges')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.categoryChanges`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.loggedActions')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.loggedActions`, {
                        type: 'checkbox',
                      })}
                    />
                    <Checkbox
                      size="xs"
                      label={t('core:ui.filterPanel.wikidataEdits')}
                      disabled={!currentFilter || form.values.wikis[selectedWikiIndex].inherited}
                      {...form.getInputProps(`wikis.${selectedWikiIndex}.config.wikidataEdits`, {
                        type: 'checkbox',
                      })}
                    />
                  </SimpleGrid>
                </Stack>
              </Card>
            </Stack>
          </form>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function FilterPanel() {
  const { t } = useTranslation();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();

  return (
    <Popover
      width={1000}
      position="top-start"
      shadow="lg"
      radius="md"
      transitionProps={{ transition: dir === 'rtl' ? 'pop-bottom-right' : 'pop-bottom-left' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          title={t('core:ui.filterPanel.title')}
          aria-label={t('core:ui.filterPanel.title')}
        >
          <IconFilter size="1.5rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        py="xs"
        px="sm"
        style={{
          backgroundColor:
            computedColorScheme === 'dark'
              ? 'var(--mantine-color-dark-7)'
              : 'var(--mantine-color-white)',
        }}
      >
        <FilterPanelContent />
      </Popover.Dropdown>
    </Popover>
  );
}
