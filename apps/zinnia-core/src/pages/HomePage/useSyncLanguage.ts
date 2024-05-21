import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { appState } from '@/states/appState';

export function useSyncLanguage() {
  const { i18n } = useTranslation();

  const userConfigLanguage = appState.userConfig.language.get();

  useEffect(() => {
    if (userConfigLanguage) {
      i18n.changeLanguage(userConfigLanguage).then();
    }
  }, [userConfigLanguage]);
}
