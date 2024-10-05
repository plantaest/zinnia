import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useIntl } from 'react-intl';
import { metaWiki } from '@/utils/wikis';
import { Notify } from '@/utils/Notify';

export function useSaveOption() {
  const { formatMessage } = useIntl();

  return useMutation<void, AsterError, { name: string; value: string | null }>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption'],
    mutationFn: ({ name, value }) => metaWiki.userInfo().saveOption(name, value),
    onError: () => Notify.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
