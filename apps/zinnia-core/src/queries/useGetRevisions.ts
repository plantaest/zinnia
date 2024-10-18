import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AsterError, Revision } from '@plantaest/aster';
import { wikis } from '@/utils/wikis';

export function useGetRevisions(wikiId: string, pageTitle: string, limit: number) {
  return useQuery<Revision[], AsterError>({
    queryKey: [wikiId, 'page', pageTitle, 'revisions', limit],
    queryFn: () => wikis.getWiki(wikiId).page(pageTitle).revisions(limit),
    placeholderData: keepPreviousData,
  });
}
