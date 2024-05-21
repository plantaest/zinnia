import { useTranslation } from 'react-i18next';
import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

export function useSelectFilter() {
  const { t } = useTranslation();

  return useMutation<UserConfig, AsterError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'selectFilter'],
    mutationFn: async (filterId) => {
      const userConfig = structuredClone(appState.userConfig.get());
      const activeWorkspace =
        userConfig.workspaces.find((w) => w.id === userConfig.activeWorkspaceId) ?? null;

      if (activeWorkspace) {
        activeWorkspace.activeFilterId = filterId;
      }

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => appState.userConfig.set(userConfig),
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
