import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CompositeError, PageHtmlResult, RevisionHtmlResult } from '@plantaest/composite';
import { wikis } from '@/utils/wikis';

export function useGetPageHtml(wikiId: string, pageTitle: string, revisionId: number | null) {
  return useQuery<PageHtmlResult | RevisionHtmlResult, CompositeError>({
    queryKey: revisionId
      ? [wikiId, 'page', pageTitle, 'revisionHtml', revisionId]
      : [wikiId, 'page', pageTitle, 'html'],
    queryFn: () =>
      revisionId
        ? wikis.getWiki(wikiId).page(pageTitle).revisionHtml(revisionId)
        : wikis.getWiki(wikiId).page(pageTitle).html(),
    staleTime: revisionId ? Infinity : 0,
    placeholderData: keepPreviousData,
    meta: {
      showErrorNotification: false,
    },
  });
}
