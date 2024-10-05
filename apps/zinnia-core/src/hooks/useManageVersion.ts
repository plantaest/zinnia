import { useCallback, useEffect } from 'react';
import semverGt from 'semver/functions/gt';
import semverEq from 'semver/functions/eq';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';
import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';
import { UserConfig } from '@/types/persistence/UserConfig';
import { appConfig } from '@/config/appConfig';
import { versionMap } from '@/utils/migration/versionMap';
import { Notify } from '@/utils/Notify';
import { migrateFunctions } from '@/utils/migration/migrateFunctions';
import { useGetOption } from '@/queries/useGetOption';
import { useSaveOption } from '@/queries/useSaveOption';

export function useManageVersion() {
  const { formatMessage } = useIntl();
  const { data: userConfigOption, isSuccess: isSuccessUserConfigOption } = useGetOption(
    appConfig.USER_CONFIG_OPTION_KEY
  );
  const saveOptionApi = useSaveOption();
  const userConfig = useSelector(appState.userConfig);

  const updateAppVersion = useCallback((currentAppVersion: string, persistedAppVersion: string) => {
    const now = dayjs().toISOString();
    appState.userConfig.updatedAt.set(now);
    appState.userConfig.appVersion.set(currentAppVersion);
    saveOptionApi.mutate(
      {
        name: appConfig.USER_CONFIG_OPTION_KEY,
        value: JSON.stringify(userConfig),
      },
      {
        onSuccess: () =>
          Notify.success(
            formatMessage(
              { id: 'hook.useCreateFilter.success.default' },
              {
                newVersion: currentAppVersion,
                oldVersion: persistedAppVersion,
              }
            )
          ),
      }
    );
  }, []);

  useEffect(() => {
    if (isSuccessUserConfigOption) {
      if (userConfigOption === null) {
        appState.ui.initState.set('start');
      } else {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const userConfig: UserConfig = JSON.parse(userConfigOption as string);

        const currentAppVersion = appConfig.VERSION;
        const persistedAppVersion = userConfig.appVersion;
        const currentSchemaVersion = versionMap[currentAppVersion];
        const persistedSchemaVersion = userConfig.schemaVersion;

        if (semverEq(currentSchemaVersion, persistedSchemaVersion)) {
          appState.userConfig.set(structuredClone(userConfig));
          appState.ui.initState.set('normal');

          if (semverGt(currentAppVersion, persistedAppVersion)) {
            updateAppVersion(currentAppVersion, persistedAppVersion);
          }
        }

        if (semverGt(currentSchemaVersion, persistedSchemaVersion)) {
          const schemaVersions = [...new Set(Object.values(versionMap))];
          const currentSchemaVersionIndex = schemaVersions.findIndex(
            (version) => version === currentSchemaVersion
          );
          const persistedSchemaVersionIndex = schemaVersions.findIndex(
            (version) => version === persistedSchemaVersion
          );

          let migratedUserConfig = userConfig as UserConfig;

          for (let i = persistedSchemaVersionIndex; i < currentSchemaVersionIndex; i += 1) {
            const key = `migrate_${schemaVersions[i]}_to_${schemaVersions[i + 1]}`;
            const migrateFn = migrateFunctions[key];
            migratedUserConfig = migrateFn(migratedUserConfig);
          }

          appState.userConfig.set(migratedUserConfig);
          appState.ui.initState.set('normal');

          if (semverGt(currentAppVersion, persistedAppVersion)) {
            updateAppVersion(currentAppVersion, persistedAppVersion);
          }
        }
      }
    }
  }, [userConfigOption]);
}
