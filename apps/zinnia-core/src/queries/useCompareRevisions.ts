import { AsterError, CompareRevisionsResult, DiffType } from '@plantaest/aster';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { wikis } from '@/utils/wikis';

export function useCompareRevisions(
  wikiId: string,
  fromRevisionId: number,
  toRevisionId: number,
  diffType: DiffType
) {
  return useQuery<CompareRevisionsResult, AsterError>({
    queryKey: [wikiId, 'compareRevisions', fromRevisionId, toRevisionId, diffType],
    queryFn: () => wikis.getWiki(wikiId).compareRevisions(fromRevisionId, toRevisionId, diffType),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
}
