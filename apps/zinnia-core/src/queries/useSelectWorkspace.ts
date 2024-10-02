import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@legendapp/state/react';
import { metaWiki } from '@/utils/wikis';
import { Notify } from '@/utils/Notify';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { UserConfig } from '@/types/persistence/UserConfig';

export function useSelectWorkspace() {
  const { t } = useTranslation();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, AsterError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'selectWorkspace'],
    mutationFn: async (workspaceId) => {
      const userConfig = structuredClone(config);
      userConfig.activeWorkspaceId = workspaceId;

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => appState.userConfig.set(userConfig),
    onError: () => Notify.error(t('core:hook.useSaveOption.error.default')),
  });
}
