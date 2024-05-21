import { useTranslation } from 'react-i18next';
import { Text } from '@mantine/core';
import classes from './EmptyStateContent.module.css';

export function EmptyStateContent() {
  const { t } = useTranslation();

  return <Text className={classes.loading}>{`${t('core:common.loading')}...`}</Text>;
}
