import { Stack, Text } from '@mantine/core';
import { Fragment, memo } from 'react';
import dayjs from 'dayjs';
import { useIntl } from 'react-intl';
import { IconInboxOff } from '@tabler/icons-react';
import { useSelector } from '@legendapp/state/react';
import { ChangeCard } from '@/components/ChangeCard/ChangeCard';
import { useGetRecentChanges } from '@/queries/useGetRecentChanges';
import { appState } from '@/states/appState';
import { FeedDateTimeCard } from '@/components/FeedPanel/FeedDateTimeCard';
import classes from './FeedPanel.module.css';
import { FeedControlPanel } from '@/components/FeedPanel/FeedControlPanel';

function _FeedPanel() {
  const { formatMessage } = useIntl();
  const { data: recentChanges = [] } = useGetRecentChanges();
  const focus = useSelector(appState.ui.focus);

  const dates = new Set<string>();
  const times = new Set<string>();

  const feedItemFragments = recentChanges.map((change, index) => {
    const date = dayjs(change.timestamp).format('DD-MM-YYYY');
    const time = dayjs(change.timestamp).format('YYYY-MM-DDTHH:00');
    let showDate;
    let showTime;

    if (dates.has(date)) {
      showDate = false;
    } else {
      showDate = true;
      dates.add(date);
    }

    if (times.has(time)) {
      showTime = false;
    } else {
      showTime = true;
      times.add(time);
    }

    return (
      <Fragment key={change.recentChangeId}>
        {showDate && <FeedDateTimeCard datetime={date} type="date" />}
        {showTime && <FeedDateTimeCard datetime={dayjs(time).format('HH:mm')} type="time" />}
        <ChangeCard change={change} index={index} />
      </Fragment>
    );
  });

  return (
    <Stack w={{ md: '16rem', lg: '18rem' }} className={classes.wrapper} data-focus={focus}>
      <FeedControlPanel />

      {recentChanges.length === 0 && (
        <Stack className={classes.empty}>
          <IconInboxOff size="5rem" stroke={0.5} />
          <Text fw={500}>{formatMessage({ id: 'ui.feedPanel.empty' })}</Text>
        </Stack>
      )}

      {recentChanges.length > 0 && <Stack gap={5}>{feedItemFragments}</Stack>}
    </Stack>
  );
}

export const FeedPanel = memo(_FeedPanel);
