import { useEffect } from 'react';
import { useSelector } from '@legendapp/state/react';
import { useForceUpdate } from '@mantine/hooks';
import { appState } from '@/states/appState';
import { i18n } from '@/i18n';

export function useSyncLanguage() {
  const language = useSelector(appState.userConfig.language);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    if (i18n.getIntl().locale !== language) {
      i18n.changeLanguage(language).then(forceUpdate);
    }
  }, [language]);
}
