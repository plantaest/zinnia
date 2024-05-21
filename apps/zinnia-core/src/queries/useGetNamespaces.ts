import { useQuery } from '@tanstack/react-query';
import { AsterError, Namespace } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { wikis } from '@/utils/wikis';
import { defaultNamespaces } from '@/utils/defaultNamespaces';

export function useGetNamespaces(wikiId: string) {
  const { t } = useTranslation();

  return useQuery<Namespace[], AsterError>({
    queryKey: [wikiId, 'siteInfo', 'getNamespaces'],
    queryFn: async () => {
      if (wikiId === 'global') {
        return defaultNamespaces.map((namespace) => ({
          id: namespace.id,
          name: t(namespace.name),
        }));
      }

      return wikis.getWiki(wikiId).siteInfo().getNamespaces();
    },
    staleTime: Infinity,
  });
}
