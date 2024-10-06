import { ActionIcon, Anchor, Button, Group, Popover, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useForm } from '@mantine/form';
import React from 'react';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { Filter } from '@/types/persistence/Filter';
import { errorMessage } from '@/utils/errorMessage';
import { wikis } from '@/utils/wikis';
import { filterPanelFormAction, FilterPanelFormValues } from '@/components/FilterPanel/FilterPanel';
import { Notify } from '@/utils/Notify';
import { appConfig } from '@/config/appConfig';

const formSchema = (formatMessage: ({ id }: { id: string }) => string) =>
  v.pipe(
    v.object({
      wikiId: v.pipe(
        v.string(),
        v.trim(),
        v.minLength(1, formatMessage({ id: errorMessage.notEmpty }))
      ),
    }),
    v.forward(
      v.check(
        (input) =>
          input.wikiId.trim().length === 0 ||
          wikis.getWikiSites().getWikiIds().includes(input.wikiId),
        formatMessage({ id: errorMessage.notSupportedWikiId })
      ),
      ['wikiId']
    )
  );

type FormValues = v.InferInput<ReturnType<typeof formSchema>>;

const initialFormValues: FormValues = {
  wikiId: '',
};

function FilterAddWikiFormContent() {
  const { formatMessage } = useIntl();

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema(formatMessage)),
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

    filterPanelFormAction.setValues((values) => {
      const filterWikis = values.wikis!;

      if (filterWikis.length > appConfig.MAX_FILTER_WIKIS) {
        form.setErrors({ wikiId: formatMessage({ id: errorMessage.maxLimitFilterWikis }) });
        return {};
      }

      const currentWikiIds = filterWikis.map((w) => w.wikiId);

      if (currentWikiIds.includes(wiki.wikiId)) {
        form.setErrors({ wikiId: formatMessage({ id: errorMessage.existedWikiId }) });
        return {};
      }

      Notify.success(
        formatMessage(
          { id: 'ui.filterPanel.filterAddWikiForm.notify' },
          {
            wikiId: formValues.wikiId,
          }
        )
      );

      return {
        wikis: [...filterWikis, wiki],
      };
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
          {formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.eg' })}
        </Text>
        <Anchor
          size="xs"
          href="https://en.wikipedia.org/wiki/User:Plantaest/Zinnia/Supported_wikis"
          target="_blank"
        >
          {formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.fullList' })}
        </Anchor>
      </Group>
      <Button size="xs" onClick={() => handleFormSubmit()}>
        {formatMessage({ id: 'common.add' })}
      </Button>
    </Stack>
  );
}

interface FilterAddWikiFormProps {
  currentFilter: Filter | null;
  formWikisLength: number;
}

export function FilterAddWikiForm({ currentFilter, formWikisLength }: FilterAddWikiFormProps) {
  const { formatMessage } = useIntl();

  return (
    <Popover width={250} position="bottom-end" shadow="md" withinPortal={false} trapFocus>
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="transparent"
          color="blue.5"
          disabled={!currentFilter || formWikisLength > appConfig.MAX_FILTER_WIKIS}
          title={formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.addWiki' })}
          aria-label={formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.addWiki' })}
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
