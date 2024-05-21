import { useQuery } from '@tanstack/react-query';
import { AsterError, Tag } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { wikis } from '@/utils/wikis';
import { defaultTags } from '@/utils/defaultTags';

export function useGetTags(wikiId: string) {
  const { t } = useTranslation();

  return useQuery<Tag[], AsterError>({
    queryKey: [wikiId, 'getTags'],
    queryFn: async () => {
      if (wikiId === 'global') {
        return defaultTags.map((tag) => ({
          name: tag.name,
          displayName: tag.displayName ? t(tag.displayName) : null,
        }));
      }

      return wikis.getWiki(wikiId).getTags();
    },
    staleTime: Infinity,
  });
}
