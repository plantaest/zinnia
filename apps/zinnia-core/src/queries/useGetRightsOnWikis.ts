import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { wikis } from '@/utils/wikis';
import { WikiId } from '@/types/mw/WikiId';

export function useGetRightsOnWikis(wikiIds: string[]) {
  return useQuery<Record<WikiId, string[]>, AsterError>({
    queryKey: [wikiIds, 'userInfo', 'getRights'],
    queryFn: async () => {
      const rightsOnWikis: Record<WikiId, string[]> = {};

      const responses = await Promise.all(
        wikiIds.map((wikiId) => wikis.getWiki(wikiId).userInfo().getRights())
      );

      for (let i = 0; i < responses.length; i += 1) {
        rightsOnWikis[wikiIds[i]] = responses[i];
      }

      return rightsOnWikis;
    },
    staleTime: Infinity,
    enabled: wikiIds.length > 0,
    placeholderData: keepPreviousData,
  });
}
