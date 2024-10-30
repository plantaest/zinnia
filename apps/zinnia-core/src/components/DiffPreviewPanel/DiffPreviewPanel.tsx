import { Flex, Loader, Text } from '@mantine/core';
import { IconAlertTriangle, IconEqual } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useCompareRevisions } from '@/queries/useCompareRevisions';
import { wikis } from '@/utils/wikis';
import { isRtlLang } from '@/utils/isRtlLang';

interface DiffPreviewPanelProps {
  wikiId: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function DiffPreviewPanel({ wikiId, fromRevisionId, toRevisionId }: DiffPreviewPanelProps) {
  const { formatMessage } = useIntl();
  const contentLanguage = wikis.getWiki(wikiId).getConfig().language;
  const contentDir = isRtlLang(contentLanguage) ? 'rtl' : 'ltr';

  const {
    data: compareResult = { body: '' },
    isFetching,
    isError,
  } = useCompareRevisions(wikiId, fromRevisionId, toRevisionId, 'table');

  const processedDiffTableHtml = compareResult.body.replaceAll(/colspan="\d"/g, '');

  return (
    <Flex
      align="start"
      p={5}
      h="50vh"
      mih={375}
      mah={500}
      style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}
    >
      {isFetching ? (
        <Flex justify="center" align="center" flex={1} h="100%">
          <Loader color="blue" size="md" />
        </Flex>
      ) : isError ? (
        <Flex justify="center" align="center" flex={1} h="100%">
          <IconAlertTriangle size="2.75rem" strokeWidth={1.5} color="var(--mantine-color-red-5)" />
        </Flex>
      ) : processedDiffTableHtml.trim().length === 0 ? (
        <Flex justify="center" align="center" flex={1} h="100%" gap="sm" direction="column">
          <IconEqual size="2.75rem" strokeWidth={1.5} />
          <Text>{formatMessage({ id: 'ui.diffPreviewPanel.noDifference' })}</Text>
        </Flex>
      ) : (
        <table className="diff" dir={contentDir}>
          <colgroup>
            <col className="diff-content" />
            <col className="diff-content" />
          </colgroup>
          <tbody
            dangerouslySetInnerHTML={{
              __html: processedDiffTableHtml,
            }}
          />
        </table>
      )}
    </Flex>
  );
}
