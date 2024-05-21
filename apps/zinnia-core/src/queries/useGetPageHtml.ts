import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AsterError, PageHtmlResult } from '@plantaest/aster';
import { wikis } from '@/utils/wikis';

export function useGetPageHtml(wikiId: string, pageTitle: string) {
  return useQuery<PageHtmlResult, AsterError>({
    queryKey: [wikiId, 'page', pageTitle, 'html'],
    queryFn: () => wikis.getWiki(wikiId).page(pageTitle).html(),
    placeholderData: keepPreviousData,
    meta: {
      showErrorNotification: false,
    },
  });
}
