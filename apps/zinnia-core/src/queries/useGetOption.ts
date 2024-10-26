import { useQuery } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { metaWiki } from '@/utils/wikis';

export function useGetOption(name: string) {
  return useQuery<unknown, CompositeError>({
    queryKey: ['metawiki', 'userInfo', 'getOption', name],
    queryFn: () => metaWiki.userInfo().getOption(name),
  });
}
