import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { metaWiki } from '@/utils/wikis';
import { appState } from '@/states/appState';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

export function useDeleteFilter() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, AsterError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'deleteFilter'],
    mutationFn: async (filterId) => {
      const userConfig = structuredClone(config);
      const activeWorkspace =
        userConfig.workspaces.find((w) => w.id === userConfig.activeWorkspaceId) ?? null;

      if (activeWorkspace) {
        activeWorkspace.filters = activeWorkspace.filters.filter((f) => f.id !== filterId);

        if (activeWorkspace.activeFilterId === filterId) {
          activeWorkspace.activeFilterId = null;
        }
      }

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notify.success(formatMessage({ id: 'hook.useDeleteFilter.success.default' }));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notify.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
