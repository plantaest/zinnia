import { useQuery } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { metaWiki } from '@/utils/wikis';

export function useGetOption(name: string) {
  return useQuery<unknown, AsterError>({
    queryKey: ['metawiki', 'userInfo', 'getOption', name],
    queryFn: () => metaWiki.userInfo().getOption(name),
  });
}
