import { ErrorInfo, useEffect, useState } from 'react';
import { Alert, Button, Code, CopyButton, Flex, Group, Stack, Text } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { StackFrame } from 'stacktrace-js';
import { appState } from '@/states/appState';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';

interface ErrorFallbackProps {
  error: Error;
  errorInfo: ErrorInfo;
}

export function ErrorFallback({ error, errorInfo }: ErrorFallbackProps) {
  const appStateObject = appState.peek();
  const saveOptionApi = useSaveOption();
  const [errorStackFrames, setErrorStackFrames] = useState<StackFrame[]>([]);
  const [errorInfoStackFrames, setErrorInfoStackFrames] = useState<StackFrame[]>([]);

  useEffect(() => {
    import('stacktrace-js')
      .then(({ fromError }) =>
        Promise.all([
          fromError(error),
          fromError({
            name: 'ErrorInfo',
            message: 'ErrorInfo',
            stack: String(errorInfo.componentStack),
          }),
        ])
      )
      .then((sfArrays) => {
        setErrorStackFrames(sfArrays[0]);
        setErrorInfoStackFrames(sfArrays[1]);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Error mapping stack trace:', err);
      });
  }, []);

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
          h="12.5rem"
          ff="var(--zinnia-font-monospace)"
          style={{ scrollbarWidth: 'none' }}
        >
          {errorStackFrames.join('\n')}
        </Code>
      ),
    },
    {
      title: 'Error Component Stack',
      value: (
        <Code
          block
          h="12.5rem"
          ff="var(--zinnia-font-monospace)"
          style={{ scrollbarWidth: 'none' }}
        >
          {errorInfoStackFrames.join('\n')}
        </Code>
      ),
    },
    {
      title: 'App State',
      value: (
        <Code
          block
          h="12.5rem"
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
    errorStack: errorStackFrames.join('\n'),
    errorComponentStack: errorInfoStackFrames.join('\n'),
    appState: appStateObject,
  };

  const handleClickClearCacheButton = () => {
    appState.local.tabs.delete();
    appState.userConfig.language.delete();
    appState.userConfig.dir.delete();
    window.location.reload();
  };

  const handleClickFactoryResetButton = () => {
    saveOptionApi.mutate(
      {
        name: appConfig.USER_CONFIG_OPTION_KEY,
        value: null,
      },
      {
        onSuccess: () => {
          handleClickClearCacheButton();
        },
      }
    );
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
          <Button color="red" onClick={handleClickClearCacheButton}>
            Clear cache
          </Button>
          <Button
            color="red"
            onClick={handleClickFactoryResetButton}
            loading={saveOptionApi.isPending}
          >
            Factory reset
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
