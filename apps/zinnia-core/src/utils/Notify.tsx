import { notifications } from '@mantine/notifications';
import { ReactNode } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import i18n from '@/i18n';

export namespace Notify {
  export const info = (message: ReactNode) =>
    notifications.show({
      title: i18n.t('core:common.notification'),
      message,
      autoClose: 5000,
    });

  export const success = (message: ReactNode) =>
    notifications.show({
      title: i18n.t('core:common.notification'),
      message,
      autoClose: 5000,
      icon: <IconCheck size="1.125rem" />,
      color: 'teal',
    });

  export const error = (message: ReactNode) =>
    notifications.show({
      title: i18n.t('core:common.notification'),
      message,
      autoClose: 10000,
      icon: <IconX size="1.125rem" />,
      color: 'red',
    });
}
