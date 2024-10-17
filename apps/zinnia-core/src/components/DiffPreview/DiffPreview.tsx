import { Flex, Loader } from '@mantine/core';
import { IconAlertTriangle } from '@tabler/icons-react';
import { useCompareRevisions } from '@/queries/useCompareRevisions';
import { wikis } from '@/utils/wikis';
import { isRtlLang } from '@/utils/isRtlLang';

interface DiffPreviewProps {
  wikiId: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function DiffPreview({ wikiId, fromRevisionId, toRevisionId }: DiffPreviewProps) {
  const contentLanguage = wikis.getWiki(wikiId).getConfig().language;
  const contentDir = isRtlLang(contentLanguage) ? 'rtl' : 'ltr';

  const {
    data: compareResult = { body: '' },
    isFetching,
    isError,
  } = useCompareRevisions(wikiId, fromRevisionId, toRevisionId, 'table');

  const processedDiffTableHtml = compareResult.body.replaceAll(/colspan="\d"/g, '');

  return (
    <Flex align="start" p={5} h="50vh" style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
      {isFetching ? (
        <Flex justify="center" align="center" flex={1} h="100%">
          <Loader color="blue" size="md" />
        </Flex>
      ) : isError ? (
        <Flex justify="center" align="center" flex={1} h="100%">
          <IconAlertTriangle size="2.75rem" strokeWidth={1.5} color="var(--mantine-color-red-5)" />
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
