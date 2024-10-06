import { ErrorInfo } from 'react';
import { Alert, Button, Code, CopyButton, Flex, Group, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { appState } from '@/states/appState';

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
}

export function ErrorFallback({ error, errorInfo }: ErrorFallbackProps) {
  const appStateObject = appState.peek();

  const lines = [
    {
      title: 'Error Name',
      value: <Text size="lg">{error.name}</Text>,
    },
    {
      title: 'Error Message',
      value: <Text size="lg">{error.message}</Text>,
    },
    {
      title: 'Error Stack',
      value: (
        <Code
          block
          mah="18.25rem"
          ff="var(--zinnia-font-monospace)"
          style={{ scrollbarWidth: 'none' }}
        >
          {error.stack}
        </Code>
      ),
    },
    {
      title: 'Error Component Stack',
      value: (
        <Code
          block
          mah="18.25rem"
          ff="var(--zinnia-font-monospace)"
          style={{ scrollbarWidth: 'none' }}
        >
          {errorInfo.componentStack}
        </Code>
      ),
    },
    {
      title: 'App State',
      value: (
        <Code
          block
          mah="18.25rem"
          ff="var(--zinnia-font-monospace)"
          style={{ scrollbarWidth: 'none' }}
        >
          {JSON.stringify(appStateObject, null, 2)}
        </Code>
      ),
    },
  ];

  const logs = {
    id: uuidv4(),
    timestamp: dayjs().toISOString(),
    errorName: error.name,
    errorMessage: error.message,
    errorStack: error.stack,
    errorComponentStack: errorInfo.componentStack,
    appState: appStateObject,
  };

  return (
    <Alert
      variant="white"
      color="pink"
      title="Error"
      icon={<IconInfoCircle />}
      styles={{ body: { minWidth: 0 } }}
    >
      <Stack>
        <Group gap="sm">
          <CopyButton value={JSON.stringify(logs)}>
            {({ copied, copy }) => (
              <Button color={copied ? 'teal' : 'blue'} onClick={copy}>
                {copied ? 'Copied logs' : 'Copy logs'}
              </Button>
            )}
          </CopyButton>
          <Button
            component="a"
            href="https://en.wikipedia.org/wiki/User_talk:Plantaest/Zinnia"
            target="_blank"
          >
            Go to Talk
          </Button>
          <Button
            component="a"
            href="https://meta.wikimedia.org/wiki/Special:EmailUser/Plantaest"
            target="_blank"
          >
            Email to Plantaest
          </Button>
        </Group>
        {lines.map((line) => (
          <Flex key={line.title} direction="column">
            <Text size="xs" c="dimmed">
              {line.title}
            </Text>
            {line.value}
          </Flex>
        ))}
      </Stack>
    </Alert>
  );
}
