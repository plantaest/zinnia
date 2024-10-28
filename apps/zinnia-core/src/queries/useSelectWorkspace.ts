import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { metaWiki } from '@/utils/wikis';
import { Notification } from '@/utils/Notification';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { UserConfig } from '@/types/persistence/UserConfig';

export function useSelectWorkspace() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, string>({
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
    onError: () => Notification.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
