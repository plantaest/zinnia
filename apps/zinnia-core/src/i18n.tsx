import { createIntl, createIntlCache } from 'react-intl';

const messages = new Map();
const intlCache = createIntlCache();
const locales: Record<string, () => Promise<any>> = import.meta.glob('./compiled-locales/*.json');
const suggestedLanguage = document.documentElement.lang || navigator.language;

const supportedLanguages = ['en', 'vi'];

export const createIntlInstance = async (language?: string) => {
  const locale =
    language || (supportedLanguages.includes(suggestedLanguage) ? suggestedLanguage : 'en');

  if (!messages.has(locale)) {
    const loadedMessages = (await locales[`./compiled-locales/${locale}.json`]()).default;
    messages.set(locale, loadedMessages);
  }

  return createIntl(
    {
      defaultLocale: 'en',
      locale: locale,
      messages: messages.get(locale),
      defaultRichTextElements: {
        strong: (chunks) => <strong>{chunks}</strong>,
      },
    },
    intlCache
  );
};

export const i18n = {
  _intl: await createIntlInstance(),
  getIntl: () => i18n._intl,
  changeLanguage: async (language: string) => {
    if (i18n._intl.locale !== language) {
      const intl = await createIntlInstance(language);
      i18n._intl = intl;
      return intl;
    }
    return i18n._intl;
  },
};
