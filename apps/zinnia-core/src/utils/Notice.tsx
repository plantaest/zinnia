import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';

export namespace Notice {
  export const info = (message: ReactNode) =>
    notifications.show({
      message,
      autoClose: 8000,
    });

  export const success = (message: ReactNode) =>
    notifications.show({
      message,
      autoClose: 5000,
      icon: <IconCheck size="1.125rem" />,
      color: 'teal',
    });

  export const error = (message: ReactNode) =>
    notifications.show({
      message,
      autoClose: 20000,
      icon: <IconX size="1.125rem" />,
      color: 'red',
    });
}
