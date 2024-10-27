import {
  ActionIcon,
  Anchor,
  Box,
  Group,
  HoverCard,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconArrowsMaximize,
  IconCircle,
  IconCircleFilled,
  IconFlame,
  IconLeaf,
  IconPlus,
  IconReload,
  IconUser,
} from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import React, { Fragment, useState } from 'react';
import dayjs from 'dayjs';
import classes from './UserPanel.module.css';
import { useGetUserContribs } from '@/queries/useGetUserContribs';
import { wikis } from '@/utils/wikis';
import { appState } from '@/states/appState';
import { useLargerThan } from '@/hooks/useLargerThan';
import { MwHelper } from '@/utils/MwHelper';
import { LengthDeltaText } from '@/components/LengthDeltaText/LengthDeltaText';
import { Tab, TabType } from '@/types/persistence/Tab';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';
import { DiffPreviewPanel } from '@/components/DiffPreviewPanel/DiffPreviewPanel';
import { isRtlLang } from '@/utils/isRtlLang';

interface UserPanelProps {
  wikiId: string;
  fromUsername: string;
  toUsername: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function UserPanel({
  wikiId,
  fromUsername,
  toUsername,
  fromRevisionId,
  toRevisionId,
}: UserPanelProps) {
  const { formatMessage } = useIntl();
  const {
    data: fromUserContributions = [],
    refetch: refetchFromUserContributions,
    isFetching: isFetchingFromUserContributions,
  } = useGetUserContribs(wikiId, fromUsername, 30);
  const {
    data: toUserContributions = [],
    refetch: refetchToUserContributions,
    isFetching: isFetchingToUserContributions,
  } = useGetUserContribs(wikiId, toUsername, 30);
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;
  const dates = new Set<string>();
  const preview = useSelector(appState.ui.preview);
  const largerThanLg = useLargerThan('lg');
  const [side, setSide] = useState<'from' | 'to'>('to');
  const contributions = side === 'to' ? toUserContributions : fromUserContributions;
  const contentLanguage = wikis.getWiki(wikiId).getConfig().language;
  const contentDir = isRtlLang(contentLanguage) ? 'rtl' : 'ltr';

  const handleClickFromButton = () => setSide('from');

  const handleClickToButton = () => setSide('to');

  const handleClickReloadButton = () =>
    side === 'to' ? refetchToUserContributions() : refetchFromUserContributions();

  const handleClickContributionButton = (
    pageTitle: string,
    parentRevisionId: number,
    revisionId: number
  ) => {
    const activeTab = appState.ui.activeTab.peek();

    if (activeTab && (activeTab.type === TabType.DIFF || activeTab.type === TabType.MAIN_DIFF)) {
      const now = dayjs().toISOString();
      const diffTab: Tab = {
        id: activeTab.id,
        createdAt: activeTab.createdAt,
        updatedAt: now,
        name: `[${wikiId}] ${pageTitle} [${parentRevisionId}-${revisionId}]`,
        type: activeTab.type,
        data: {
          wikiId: wikiId,
          pageTitle: pageTitle,
          fromRevisionId: parentRevisionId === 0 ? revisionId : parentRevisionId,
          toRevisionId: revisionId,
        },
      };
      appState.ui.activeTab.set(diffTab);
      scrollToTopTabMainPanel();
    }
  };

  const handleClickPageTitleLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleDoubleClickPageTitleLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const anchor = event.target as HTMLAnchorElement;
    window.open(anchor.href);
  };

  return (
    <Box className={classes.wrapper}>
      <Stack gap="xs">
        <Group gap="xs" justify="space-between">
          <Group gap={6}>
            <IconUser size="1rem" stroke={1.5} />
            <Text size="sm" fw={500}>
              {formatMessage({ id: 'ui.userPanel.title' })}
            </Text>
          </Group>

          <Group gap={2}>
            <Tooltip.Group openDelay={200} closeDelay={200}>
              <Group gap={2} dir={contentDir}>
                <Tooltip label={fromUsername}>
                  <ActionIcon
                    variant="transparent"
                    size="sm"
                    color="orange.5"
                    aria-label={fromUsername}
                    onClick={handleClickFromButton}
                  >
                    {side === 'from' ? (
                      <IconCircleFilled size="1rem" />
                    ) : (
                      <IconCircle size="1rem" />
                    )}
                  </ActionIcon>
                </Tooltip>
                <Tooltip label={toUsername}>
                  <ActionIcon
                    variant="transparent"
                    size="sm"
                    color="cyan.5"
                    aria-label={toUsername}
                    onClick={handleClickToButton}
                  >
                    {side === 'to' ? <IconCircleFilled size="1rem" /> : <IconCircle size="1rem" />}
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Tooltip.Group>
            <ActionIcon
              variant="transparent"
              size="sm"
              title={formatMessage({ id: 'common.reload' })}
              aria-label={formatMessage({ id: 'common.reload' })}
              onClick={handleClickReloadButton}
              loading={
                side === 'to' ? isFetchingToUserContributions : isFetchingFromUserContributions
              }
            >
              <IconReload size="1rem" />
            </ActionIcon>
            <ActionIcon
              variant="transparent"
              size="sm"
              title={formatMessage({ id: 'common.extend' })}
              aria-label={formatMessage({ id: 'common.extend' })}
            >
              <IconArrowsMaximize size="1rem" />
            </ActionIcon>
          </Group>
        </Group>

        <Stack gap={4}>
          {contributions.map((contribution, index) => {
            const isFromRevision = contribution.revisionId === fromRevisionId;
            const isToRevision = contribution.revisionId === toRevisionId;
            const date = dayjs(contribution.timestamp).format('DD-MM-YYYY');
            let showDate;

            if (dates.has(date)) {
              showDate = false;
            } else {
              showDate = true;
              dates.add(date);
            }

            return (
              <Fragment key={contribution.revisionId}>
                {showDate && <Text className={classes.index}>{date}</Text>}
                <HoverCard
                  width={675}
                  shadow="lg"
                  radius="md"
                  position="left"
                  offset={25}
                  disabled={!preview || !largerThanLg || contribution.parentId === 0}
                >
                  <HoverCard.Target>
                    <UnstyledButton
                      className={classes.contribution}
                      data-from={isFromRevision}
                      data-to={isToRevision}
                      onClick={() =>
                        handleClickContributionButton(
                          contribution.title,
                          contribution.parentId,
                          contribution.revisionId
                        )
                      }
                    >
                      <Group gap={2} justify="space-between" w="100%">
                        <Group gap={5} wrap="nowrap">
                          <Text className={classes.index}>{index + 1}</Text>
                          <Text className={classes.timestamp}>
                            {dayjs(contribution.timestamp).format('HH:mm:ss')}
                          </Text>
                          <Text className={classes.revisionId}>{contribution.revisionId}</Text>
                          {contribution.minor && (
                            <IconLeaf
                              size="0.85rem"
                              stroke={1.5}
                              color="var(--mantine-color-gray-light-color)"
                            />
                          )}
                          {contribution.top && (
                            <IconFlame
                              size="0.85rem"
                              stroke={1.5}
                              color="var(--mantine-color-orange-5)"
                            />
                          )}
                        </Group>

                        <LengthDeltaText
                          className={classes.delta}
                          newLength={contribution.size}
                          oldLength={contribution.size - contribution.sizeDiff}
                        />
                      </Group>

                      <Group gap={5} wrap="nowrap" maw="100%">
                        {contribution.new && (
                          <ThemeIcon size={14} color="green">
                            <IconPlus size="0.85rem" stroke={1.5} />
                          </ThemeIcon>
                        )}
                        <Anchor
                          className={classes.pageTitle}
                          size="xs"
                          href={MwHelper.createPageUri(serverName, contribution.title)}
                          target="_blank"
                          fw={500}
                          onClick={handleClickPageTitleLink}
                          onDoubleClick={handleDoubleClickPageTitleLink}
                        >
                          {contribution.title}
                        </Anchor>
                      </Group>
                    </UnstyledButton>
                  </HoverCard.Target>

                  <HoverCard.Dropdown p={0} style={{ overflow: 'hidden' }}>
                    <DiffPreviewPanel
                      wikiId={wikiId}
                      fromRevisionId={contribution.parentId}
                      toRevisionId={contribution.revisionId}
                    />
                  </HoverCard.Dropdown>
                </HoverCard>
              </Fragment>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
