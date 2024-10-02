import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Filter } from '@/types/persistence/Filter';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

export function useUpdateFilter() {
  const { t } = useTranslation();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, AsterError, Filter>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'updateFilter'],
    mutationFn: async (filter) => {
      const userConfig = structuredClone(config);
      const activeWorkspace =
        userConfig.workspaces.find((w) => w.id === userConfig.activeWorkspaceId) ?? null;

      if (activeWorkspace) {
        activeWorkspace.filters = activeWorkspace.filters.map((f) =>
          f.id === filter.id ? filter : f
        );
      }

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notify.success(t('core:hook.useUpdateFilter.success.default'));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
