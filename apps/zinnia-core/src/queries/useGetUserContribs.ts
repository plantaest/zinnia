import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { CompositeError, UserContribution } from '@plantaest/composite';
import { wikis } from '@/utils/wikis';

export function useGetUserContribs(wikiId: string, username: string, limit: number) {
  return useQuery<UserContribution[], CompositeError>({
    queryKey: [wikiId, 'user', username, 'contribs', limit],
    queryFn: () => wikis.getWiki(wikiId).user(username).contribs(limit),
    placeholderData: keepPreviousData,
    enabled: username !== 'N/A',
  });
}
