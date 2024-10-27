import { Text } from '@mantine/core';
import { useIntl } from 'react-intl';

export function DefaultNativeToolAdditionalSettingsFormComponent() {
  const { formatMessage } = useIntl();

  return (
    <Text size="xs" c="dimmed" fs="italic">
      {formatMessage({ id: 'tool.message.noAdditionalSettings' })}
    </Text>
  );
}
