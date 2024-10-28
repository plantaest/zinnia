import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { Workspace } from '@/types/persistence/Workspace';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notification } from '@/utils/Notification';

export function useUpdateWorkspace() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, Workspace>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'updateWorkspace'],
    mutationFn: async (workspace) => {
      const userConfig = structuredClone(config);
      userConfig.workspaces = userConfig.workspaces.map((w) =>
        w.id === workspace.id ? workspace : w
      );

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notification.success(formatMessage({ id: 'hook.useUpdateWorkspace.success.default' }));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notification.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
