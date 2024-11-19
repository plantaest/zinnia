import { ActionIcon, Anchor, Button, Group, Popover, Select, Stack, Text } from '@mantine/core';
import { IconBrandWikipedia, IconPlus } from '@tabler/icons-react';
import { IntlShape, useIntl } from 'react-intl';
import { useForm } from '@mantine/form';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { Filter } from '@/types/persistence/Filter';
import { errorMessage } from '@/utils/errorMessage';
import { wikis, wikiSiteIds } from '@/utils/wikis';
import { filterPanelFormAction, FilterPanelFormValues } from '@/components/FilterPanel/FilterPanel';
import { Notice } from '@/utils/Notice';
import { appConfig } from '@/config/appConfig';
import { useLargerThan } from '@/hooks/useLargerThan';

const formSchema = (formatMessage: IntlShape['formatMessage']) =>
  v.pipe(
    v.object({
      wikiId: v.pipe(
        v.string(formatMessage({ id: errorMessage.notEmpty })),
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

      Notice.success(
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

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        {formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.addWiki' })}
      </Text>
      <Group gap={5}>
        <IconBrandWikipedia size="1rem" />
        <Anchor
          size="xs"
          href="https://en.wikipedia.org/wiki/User:Plantaest/Zinnia/Supported_wikis"
          target="_blank"
        >
          {formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.supportedWikiList' })}
        </Anchor>
      </Group>
      <Select
        data-autofocus
        placeholder={formatMessage({ id: 'ui.filterPanel.filterAddWikiForm.selectWiki' })}
        size="xs"
        comboboxProps={{ withinPortal: false }}
        data={wikiSiteIds}
        {...form.getInputProps('wikiId')}
      />
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
  const largerThanMd = useLargerThan('md');

  return (
    <Popover
      width={250}
      position={largerThanMd ? 'bottom-end' : 'bottom'}
      shadow="md"
      withinPortal={false}
      trapFocus
    >
      <Popover.Target>
        <ActionIcon
          size="sm"
          variant="transparent"
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
