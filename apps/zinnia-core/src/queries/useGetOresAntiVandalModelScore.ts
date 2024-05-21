import { useQuery } from '@tanstack/react-query';
import { wikis } from '@/utils/wikis';

// Refs:
// https://api.wikimedia.org/wiki/Lift_Wing_API/Reference/Get_revscoring_damaging_prediction
// https://api.wikimedia.org/wiki/Lift_Wing_API/Reference/Get_revscoring_reverted_prediction
const liftWingApi = (wikiId: string, model: string, revisionId: number) =>
  fetch(`https://api.wikimedia.org/service/lw/inference/v1/models/${wikiId}-${model}:predict`, {
    method: 'POST',
    body: JSON.stringify({
      rev_id: revisionId,
    }),
  });

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const oresApi = (wikiId: string, model: string, revisionId: number) =>
  fetch(`https://ores.wikimedia.org/v3/scores/${wikiId}/${revisionId}/${model}`);

export function useGetOresAntiVandalModelScore(
  wikiId: string,
  revisionId: number,
  inViewPort: boolean = true
) {
  const wiki = wikis.getWiki(wikiId);
  const oresAntiVandalModel = wiki.getConfig().oresAntiVandalModel!;

  return useQuery<number>({
    queryKey: [wikiId, 'getOresAntiVandalModelScore', revisionId],
    queryFn: async () => {
      const response = await liftWingApi(wikiId, oresAntiVandalModel, revisionId);

      if (!response.ok) {
        throw new Error(
          `Unable to get ORES anti-vandal model score of ${wikiId}. Model: ${oresAntiVandalModel}. Revision ID: ${revisionId}. Details: ${JSON.stringify(await response.json())}`
        );
      }

      return (await response.json())[wikiId].scores[revisionId][oresAntiVandalModel].score
        .probability.true;
    },
    staleTime: Infinity,
    enabled: wiki.getConfig().oresSupport === 'basic' && inViewPort,
    meta: {
      showErrorNotification: false,
    },
    retry: 0,
  });
}
