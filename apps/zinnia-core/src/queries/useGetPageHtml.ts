import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CompositeError, PageHtmlResult } from '@plantaest/composite';
import { wikis } from '@/utils/wikis';

export function useGetPageHtml(wikiId: string, pageTitle: string) {
  return useQuery<PageHtmlResult, CompositeError>({
    queryKey: [wikiId, 'page', pageTitle, 'html'],
    queryFn: () => wikis.getWiki(wikiId).page(pageTitle).html(),
    placeholderData: keepPreviousData,
    meta: {
      showErrorNotification: false,
    },
  });
}
