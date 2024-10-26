import { useMutation } from '@tanstack/react-query';
import { AsterError } from '@plantaest/aster';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';
import { UserExtendedTool } from '@/types/persistence/Tool';

export function useUpdateExtendedTools() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<UserConfig, AsterError, UserExtendedTool[]>({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'updateExtendedTools'],
    mutationFn: async (extendedTools) => {
      const userConfig = structuredClone(config);
      userConfig.tools.extended = extendedTools;

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => appState.userConfig.set(userConfig),
    onError: () => Notify.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
