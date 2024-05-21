import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { metaWiki } from '@/utils/wikis';
import { Notify } from '@/utils/Notify';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { UserConfig } from '@/types/persistence/UserConfig';

export function useDeleteWorkspace() {
  const { t } = useTranslation();

  return useMutation<UserConfig, AsterError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'deleteWorkspace'],
    mutationFn: async (workspaceId) => {
      const userConfig = structuredClone(appState.userConfig.get());
      userConfig.workspaces = userConfig.workspaces.filter((w) => w.id !== workspaceId);

      if (userConfig.activeWorkspaceId === workspaceId) {
        userConfig.activeWorkspaceId = null;
      }

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notify.success(t('core:hook.useDeleteWorkspace.success.default'));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
