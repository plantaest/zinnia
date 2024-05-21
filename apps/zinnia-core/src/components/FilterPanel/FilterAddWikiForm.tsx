import { ActionIcon, Anchor, Button, Group, Popover, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useForm, zodResolver } from '@mantine/form';
import React from 'react';
import { Filter } from '@/types/persistence/Filter';
import { errorMessage } from '@/utils/errorMessage';
import { wikis } from '@/utils/wikis';
import { filterPanelFormAction, FilterPanelFormValues } from '@/components/FilterPanel/FilterPanel';
import { Notify } from '@/utils/Notify';
import { appConfig } from '@/config/appConfig';

const formSchema = (t: (key: string) => string) =>
  z
    .object({
      wikiId: z.string().trim().min(1, t(errorMessage.notEmpty)),
    })
    .refine(
      (schema) =>
        schema.wikiId.trim().length === 0 ||
        wikis.getWikiSites().getWikiIds().includes(schema.wikiId),
      {
        message: t(errorMessage.notSupportedWikiId),
        path: ['wikiId'],
      }
    );

type FormValues = z.infer<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  wikiId: '',
};

function FilterAddWikiFormContent() {
  const { t } = useTranslation();

  const form = useForm({
    initialValues: initialFormValues,
    validate: zodResolver(formSchema(t)),
  });

  const handleFormSubmit = form.onSubmit((formValues) => {
    const wiki: FilterPanelFormValues['wikis'][number] = {
      wikiId: formValues.wikiId,
      inherited: true,
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
    };

    filterPanelFormAction.setFieldValue('wikis', (filterWikis) => {
      if (filterWikis.length > appConfig.MAX_FILTER_WIKIS) {
        form.setFieldError('wikiId', errorMessage.maxLimitFilterWikis);
        return filterWikis;
      }

      const currentWikiIds = filterWikis.map((w) => w.wikiId);

      if (currentWikiIds.includes(wiki.wikiId)) {
        form.setFieldError('wikiId', errorMessage.existedWikiId);
        return filterWikis;
      }

      Notify.success(
        t('core:ui.filterPanel.filterAddWikiForm.notify', {
          wikiId: formValues.wikiId,
        })
      );

      return [...filterWikis, wiki];
    });
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleFormSubmit();
    }
  };

  return (
    <Stack gap="xs">
      <TextInput
        placeholder="Wiki ID"
        size="xs"
        onKeyDown={handleKeyDown}
        {...form.getInputProps('wikiId')}
      />
      <Group gap={3.5}>
        <Text size="xs" c="dimmed">
          {t('core:ui.filterPanel.filterAddWikiForm.eg')}
        </Text>
        <Anchor
          size="xs"
          href="https://en.wikipedia.org/wiki/User:Plantaest/Zinnia/Supported_wikis"
          target="_blank"
        >
          {t('core:ui.filterPanel.filterAddWikiForm.fullList')}
        </Anchor>
      </Group>
      <Button size="xs" onClick={() => handleFormSubmit()}>
        {t('core:common.add')}
      </Button>
    </Stack>
  );
}

interface FilterAddWikiFormProps {
  currentFilter: Filter | null;
  formWikisLength: number;
}

export function FilterAddWikiForm({ currentFilter, formWikisLength }: FilterAddWikiFormProps) {
  const { t } = useTranslation();

  return (
    <Popover width={250} position="bottom-end" shadow="md" withinPortal={false} trapFocus>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="transparent"
          color="blue.5"
          disabled={!currentFilter || formWikisLength > appConfig.MAX_FILTER_WIKIS}
          title={t('core:ui.filterPanel.filterAddWikiForm.addWiki')}
          aria-label={t('core:ui.filterPanel.filterAddWikiForm.addWiki')}
        >
          <IconPlus size="1rem" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown py="xs" px="sm">
        <FilterAddWikiFormContent />
      </Popover.Dropdown>
    </Popover>
  );
}
