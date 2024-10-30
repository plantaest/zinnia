import { useIntl } from 'react-intl';
import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notice } from '@/utils/Notice';

export function useSelectFilter() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, string>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'selectFilter'],
    mutationFn: async (filterId) => {
      const userConfig = structuredClone(config);
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
    onError: () => Notice.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
