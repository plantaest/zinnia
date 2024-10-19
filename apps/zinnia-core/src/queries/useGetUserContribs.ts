import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { AsterError, UserContribution } from '@plantaest/aster';
import { wikis } from '@/utils/wikis';

export function useGetUserContribs(wikiId: string, username: string, limit: number) {
  return useQuery<UserContribution[], AsterError>({
    queryKey: [wikiId, 'user', username, 'contribs', limit],
    queryFn: () => wikis.getWiki(wikiId).user(username).contribs(limit),
    placeholderData: keepPreviousData,
    enabled: username !== 'N/A',
  });
}
