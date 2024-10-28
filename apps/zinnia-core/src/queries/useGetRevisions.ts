import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CompositeError, Revision } from '@plantaest/composite';
import { wikis } from '@/utils/wikis';

export function useGetRevisions(
  wikiId: string,
  pageTitle: string,
  limit: number,
  direction: 'newer' | 'older' = 'older'
) {
  return useQuery<Revision[], CompositeError>({
    queryKey: [wikiId, 'page', pageTitle, 'revisions', limit, direction],
    queryFn: () => wikis.getWiki(wikiId).page(pageTitle).revisions(limit, direction),
    placeholderData: keepPreviousData,
    enabled: wikiId !== 'N/A',
  });
}
