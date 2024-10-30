import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/charts/styles.css';
import './shadow.css';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useDocumentTitle } from '@mantine/hooks';
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { configureObservablePersistence, persistObservable } from '@legendapp/state/persist';
import { ObservablePersistLocalStorage } from '@legendapp/state/persist-plugins/local-storage';
import { RawIntlProvider } from 'react-intl';
import { zinniaRoot } from '@/utils/zinniaRoot';
import { theme } from './theme';
import { Notice } from '@/utils/Notice';
import { appConfig } from '@/config/appConfig';
import { appState } from '@/states/appState';
import { HomePage } from '@/pages/HomePage/Home.page';
import { i18n } from '@/i18n';
import { useSyncLanguage } from '@/hooks/useSyncLanguage';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

// dayjs
dayjs.extend(duration);
dayjs.extend(isSameOrBefore);

// Legend State Config
enableReactTracking({ warnUnobserved: true });

configureObservablePersistence({
  pluginLocal: ObservablePersistLocalStorage,
});

persistObservable(appState.local.tabs, {
  local: 'zinnia.appState.local.tabs',
});

persistObservable(appState.userConfig.language, {
  local: 'zinnia.appState.userConfig.language',
});

persistObservable(appState.userConfig.dir, {
  local: 'zinnia.appState.userConfig.dir',
});

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.showErrorNotification !== false) {
        Notice.error(
          (query.meta?.errorMessage as string) ||
            i18n.getIntl().formatMessage({ id: 'query.defaultErrorMessage' })
        );
      }

      if (appConfig.DEBUG) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      if (appConfig.DEBUG) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    },
  }),
});

interface AppProps {
  shadowRoot?: ShadowRoot;
}

export default function App({ shadowRoot }: AppProps) {
  useDocumentTitle('Zinnia');
  useSyncLanguage();

  return (
    <QueryClientProvider client={queryClient}>
      <DirectionProvider>
        <RawIntlProvider value={i18n.getIntl()}>
          <MantineProvider
            theme={theme}
            defaultColorScheme="auto"
            cssVariablesSelector=".zinnia-root"
            getRootElement={() => zinniaRoot}
          >
            <Notifications />
            <ModalsProvider>
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            </ModalsProvider>
          </MantineProvider>
        </RawIntlProvider>
      </DirectionProvider>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition="bottom-left"
        shadowDOMTarget={shadowRoot}
      />
    </QueryClientProvider>
  );
}
