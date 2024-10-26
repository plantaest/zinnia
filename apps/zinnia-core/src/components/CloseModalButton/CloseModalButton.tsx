import { Button } from '@mantine/core';
import { useIntl } from 'react-intl';
import { IconX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';

interface CloseModalButtonProps {
  onClick?: () => void;
}

export function CloseModalButton({ onClick = modals.closeAll }: CloseModalButtonProps) {
  const { formatMessage } = useIntl();

  return (
    <Button
      color="pink"
      variant="light"
      radius="md"
      style={{ border: '2px dashed var(--mantine-color-pink-5)' }}
      title={formatMessage({ id: 'common.close' })}
      aria-label={formatMessage({ id: 'common.close' })}
      onClick={onClick}
    >
      <IconX size="1.25rem" />
    </Button>
  );
}
