import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { metaWiki } from '@/utils/wikis';
import { Notice } from '@/utils/Notice';

export function useSaveOption() {
  const { formatMessage } = useIntl();

  return useMutation<void, CompositeError, { name: string; value: string | null }>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption'],
    mutationFn: ({ name, value }) => metaWiki.userInfo().saveOption(name, value),
    onError: () => Notice.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
