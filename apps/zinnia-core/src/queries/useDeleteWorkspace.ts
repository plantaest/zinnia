import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { metaWiki } from '@/utils/wikis';
import { Notify } from '@/utils/Notify';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { UserConfig } from '@/types/persistence/UserConfig';

export function useDeleteWorkspace() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'deleteWorkspace'],
    mutationFn: async (workspaceId) => {
      const userConfig = structuredClone(config);
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
      Notify.success(formatMessage({ id: 'hook.useDeleteWorkspace.success.default' }));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
