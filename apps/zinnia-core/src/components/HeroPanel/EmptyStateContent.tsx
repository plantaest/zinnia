import { useIntl } from 'react-intl';
import { Text } from '@mantine/core';
import classes from './EmptyStateContent.module.css';

export function EmptyStateContent() {
  const { formatMessage } = useIntl();

  return <Text className={classes.loading}>{`${formatMessage({ id: 'common.loading' })}...`}</Text>;
}
