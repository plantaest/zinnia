import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { Change, CompositeError } from '@plantaest/composite';
import { ApiQueryRecentChangesParams } from 'types-mediawiki/api_params';
import dayjs from 'dayjs';
import { useSelector } from '@legendapp/state/react';
import { wikis } from '@/utils/wikis';
import { WikiId } from '@/types/mw/WikiId';
import { appState } from '@/states/appState';
import { useGetRightsOnWikis } from '@/queries/useGetRightsOnWikis';
import { MwHelper } from '@/utils/MwHelper';

const balanceLimits = (rcQueryParams: Record<WikiId, ApiQueryRecentChangesParams>) => {
  const clonedRcQueryParams = structuredClone(rcQueryParams);

  const values = Object.values(clonedRcQueryParams);

  if (values.length > 1) {
    const firstLimit = Number(values[0].rclimit ?? 0);

    const averageLimit = Math.ceil(firstLimit / values.length);

    for (let i = 0; i < values.length; i += 1) {
      if (i === values.length - 1) {
        values[i].rclimit = firstLimit - (values.length - 1) * averageLimit;
      } else {
        values[i].rclimit = averageLimit;
      }
    }
  }

  return clonedRcQueryParams;
};

export function useGetRecentChanges() {
  const userConfig = useSelector(appState.userConfig);
  const rcQueryParams = useSelector(appState.ui.rcQueryParams);
  const wikiIds = Object.keys(rcQueryParams);

  const { data: rightsOnWikis } = useGetRightsOnWikis(wikiIds);

  return useQuery<Change[], CompositeError>({
    queryKey: [wikiIds, 'getRecentChanges', rcQueryParams],
    queryFn: async () => {
      const changes: Change[] = [];
      const balancedRcQueryParams = balanceLimits(rcQueryParams);

      const responses = await Promise.all(
        Object.entries(balancedRcQueryParams).map(([wikiId, queryParams]) =>
          wikis.getWiki(wikiId).getRecentChanges(queryParams, {
            hasPatrolRight: MwHelper.hasPatrolRight((rightsOnWikis ?? {})[wikiId] ?? []),
          })
        )
      );

      for (const response of responses) {
        changes.push(...response);
      }

      if (wikiIds.length > 1) {
        changes.sort((a, b) =>
          Object.values(balancedRcQueryParams)[0].rcdir === 'older'
            ? dayjs(b.timestamp).unix() - dayjs(a.timestamp).unix()
            : dayjs(a.timestamp).unix() - dayjs(b.timestamp).unix()
        );
      }

      return changes;
    },
    staleTime: Infinity,
    enabled: Boolean(userConfig) && Boolean(rightsOnWikis),
    placeholderData: keepPreviousData,
  });
}
