import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';

export function useSyncLanguage() {
  const { i18n } = useTranslation();

  const userConfigLanguage = useSelector(appState.userConfig.language);

  useEffect(() => {
    if (userConfigLanguage) {
      i18n.changeLanguage(userConfigLanguage).then();
    }
  }, [userConfigLanguage]);
}
