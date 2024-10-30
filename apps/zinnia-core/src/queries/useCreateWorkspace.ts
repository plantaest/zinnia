import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Workspace } from '@/types/persistence/Workspace';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notice } from '@/utils/Notice';

export function useCreateWorkspace() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, CompositeError, Workspace>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'createWorkspace'],
    mutationFn: async (workspace) => {
      const userConfig = structuredClone(config);
      userConfig.workspaces.push(workspace);

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => {
      Notice.success(formatMessage({ id: 'hook.useCreateWorkspace.success.default' }));
      appState.userConfig.set(userConfig);
    },
    onError: () => Notice.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
