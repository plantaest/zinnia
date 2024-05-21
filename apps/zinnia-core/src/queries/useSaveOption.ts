import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { metaWiki } from '@/utils/wikis';
import { Notify } from '@/utils/Notify';

export function useSaveOption() {
  const { t } = useTranslation();

  return useMutation<void, AsterError, { name: string; value: string | null }>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption'],
    mutationFn: ({ name, value }) => metaWiki.userInfo().saveOption(name, value),
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
