import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Workspace } from '@/types/persistence/Workspace';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

export function useCreateWorkspace() {
  const { t } = useTranslation();

  return useMutation<UserConfig, AsterError, Workspace>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'createWorkspace'],
    mutationFn: async (workspace) => {
      const userConfig = structuredClone(appState.userConfig.get());
      userConfig.workspaces.push(workspace);

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notify.success(t('core:hook.useCreateWorkspace.success.default'));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
