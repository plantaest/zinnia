import { Stack, Text } from '@mantine/core';
import { IconBrowserOff } from '@tabler/icons-react';
import { useIntl } from 'react-intl';

export function NoneTab() {
  const { formatMessage } = useIntl();

  return (
    <Stack justify="center" align="center" h="100%">
      <IconBrowserOff size="8rem" stroke={0.5} />
      <Text fw={500}>{formatMessage({ id: 'ui.noneTab.message' })}</Text>
    </Stack>
  );
}
