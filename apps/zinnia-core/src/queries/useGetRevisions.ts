import { keepPreviousData, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { CompositeError, Revision } from '@plantaest/composite';
import { wikis } from '@/utils/wikis';

export function useGetRevisions(
  wikiId: string,
  pageTitle: string,
  limit: number,
  direction: 'newer' | 'older' = 'older',
  queryOptions: Omit<UseQueryOptions<Revision[], CompositeError>, 'queryKey'> = {}
) {
  return useQuery({
    ...queryOptions,
    queryKey: [wikiId, 'page', pageTitle, 'revisions', limit, direction],
    queryFn: () => wikis.getWiki(wikiId).page(pageTitle).revisions(limit, direction),
    placeholderData: keepPreviousData,
  });
}
