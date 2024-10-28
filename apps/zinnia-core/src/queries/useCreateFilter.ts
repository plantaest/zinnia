import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Filter } from '@/types/persistence/Filter';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notification } from '@/utils/Notification';

export function useCreateFilter() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, Filter>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'createFilter'],
    mutationFn: async (filter) => {
      const userConfig = structuredClone(config);
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
      Notification.success(formatMessage({ id: 'hook.useCreateFilter.success.default' }));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notification.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
