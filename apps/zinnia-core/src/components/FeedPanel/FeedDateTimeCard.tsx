import { Box } from '@mantine/core';
import { memo } from 'react';
import classes from './FeedDateTimeCard.module.css';

interface FeedDateTimeCardProps {
  datetime: string;
  type: 'date' | 'time';
}

function _FeedDateTimeCard({ datetime, type }: FeedDateTimeCardProps): JSX.Element {
  return (
    <Box className={classes.date} data-type={type}>
      {datetime}
    </Box>
  );
}

export const FeedDateTimeCard = memo(_FeedDateTimeCard);
