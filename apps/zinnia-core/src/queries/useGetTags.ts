import { useQuery } from '@tanstack/react-query';
import { CompositeError, Tag } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { wikis } from '@/utils/wikis';
import { defaultTags } from '@/utils/defaultTags';

export function useGetTags(wikiId: string) {
  const { formatMessage } = useIntl();

  return useQuery<Tag[], CompositeError>({
    queryKey: [wikiId, 'getTags'],
    queryFn: async () => {
      if (wikiId === 'global') {
        return defaultTags.map((tag) => ({
          name: tag.name,
          displayName: tag.displayName ? formatMessage({ id: tag.displayName }) : null,
        }));
      }

      return wikis.getWiki(wikiId).getTags();
    },
  });
}
