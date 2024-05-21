import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Filter } from '@/types/persistence/Filter';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

export function useCreateFilter() {
  const { t } = useTranslation();

  return useMutation<UserConfig, AsterError, Filter>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'createFilter'],
    mutationFn: async (filter) => {
      const userConfig = structuredClone(appState.userConfig.get());
      const activeWorkspace =
        userConfig.workspaces.find((w) => w.id === userConfig.activeWorkspaceId) ?? null;

      if (activeWorkspace) {
        activeWorkspace.filters.push(filter);
      }

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notify.success(t('core:hook.useCreateFilter.success.default'));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
