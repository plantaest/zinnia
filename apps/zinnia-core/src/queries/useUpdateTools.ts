import { useMutation } from '@tanstack/react-query';
import { CompositeError } from '@plantaest/composite';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appState } from '@/states/appState';
import { metaWiki } from '@/utils/wikis';
import { appConfig } from '@/config/appConfig';
import { Notice } from '@/utils/Notice';
import { UserExtendedTool, UserNativeTool } from '@/types/persistence/Tool';

export function useUpdateTools() {
  const { formatMessage } = useIntl();
  const config = useSelector(appState.userConfig);

  return useMutation<
    UserConfig,
    CompositeError,
    { native: UserNativeTool[]; extended: UserExtendedTool[] }
  >({
    mutationKey: ['metawiki', 'userInfo', 'saveOption', 'updateTools'],
    mutationFn: async (tools) => {
      const userConfig = structuredClone(config);
      userConfig.tools.native = tools.native;
      userConfig.tools.extended = tools.extended;

      await metaWiki
        .userInfo()
        .saveOption(appConfig.USER_CONFIG_OPTION_KEY, JSON.stringify(userConfig));

      return userConfig;
    },
    onSuccess: (userConfig) => appState.userConfig.set(userConfig),
    onError: () => Notice.error(formatMessage({ id: 'hook.useSaveOption.error.default' })),
  });
}
