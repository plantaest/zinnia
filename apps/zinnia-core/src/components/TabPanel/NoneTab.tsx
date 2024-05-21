import { Stack, Text } from '@mantine/core';
import { IconBrowserOff } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function NoneTab() {
  const { t } = useTranslation();

  return (
    <Stack justify="center" align="center" h="100%">
      <IconBrowserOff size="8rem" stroke={0.5} />
      <Text fw={500}>{t('core:ui.noneTab.message')}</Text>
    </Stack>
  );
}
