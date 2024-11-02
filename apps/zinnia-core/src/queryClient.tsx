import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { CopyButton, Flex, Group, Text } from '@mantine/core';
import { IconCopy } from '@tabler/icons-react';
import { CompositeError } from '@plantaest/composite';
import { i18n } from '@/i18n';
import { Notice } from '@/utils/Notice';
import { appConfig } from '@/config/appConfig';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.showErrorNotification !== false) {
        Notice.error(
          <Flex direction="column">
            <Group gap={8}>
              <Text size="sm">
                {(query.meta?.errorMessage as string) ||
                  i18n.getIntl().formatMessage({ id: 'query.defaultErrorMessage' })}
              </Text>
              <CopyButton value={JSON.stringify({ error, query }, null, 2)}>
                {({ copied, copy }) => (
                  <IconCopy
                    style={{ minWidth: '0.85rem' }}
                    size="0.85rem"
                    color={copied ? 'var(--mantine-color-teal-5)' : 'var(--mantine-color-blue-5)'}
                    onClick={copy}
                  />
                )}
              </CopyButton>
            </Group>
            {'code' in error && (
              <Text size="xs" c="dimmed" ff="var(--zinnia-font-monospace)">
                {(error as CompositeError).code}
              </Text>
            )}
          </Flex>
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
