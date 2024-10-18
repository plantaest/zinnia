import { Anchor, Box, Group, HoverCard, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconLeaf } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { Fragment } from 'react';
import { useSelector } from '@legendapp/state/react';
import { useIntl } from 'react-intl';
import classes from './PagePanel.module.css';
import { useGetRevisions } from '@/queries/useGetRevisions';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import { LengthDeltaText } from '@/components/LengthDeltaText/LengthDeltaText';
import { Tab, TabType } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';
import { useLargerThan } from '@/hooks/useLargerThan';
import { DiffPreview } from '@/components/DiffPreview/DiffPreview';

interface PagePanelProps {
  wikiId: string;
  pageTitle: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function PagePanel({ wikiId, pageTitle, fromRevisionId, toRevisionId }: PagePanelProps) {
  const { formatMessage } = useIntl();
  const { data: revisions = [] } = useGetRevisions(wikiId, pageTitle, 30);
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;
  const activeTab = useSelector(appState.local.activeTab);
  const dates = new Set<string>();
  let timeoutId: NodeJS.Timeout;
  const preview = useSelector(appState.ui.preview);
  const largerThanMd = useLargerThan('md');

  const handleClickRevisionButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    parentRevisionId: number,
    revisionId: number
  ) => {
    if (activeTab) {
      let mainDiffTab: Tab;
      const now = dayjs().toISOString();

      if (event.ctrlKey || event.metaKey) {
        mainDiffTab = {
          id: activeTab.id,
          createdAt: activeTab.createdAt,
          updatedAt: now,
          name: `[${wikiId}] ${pageTitle} [${revisionId}-${toRevisionId}]`,
          type: TabType.MAIN_DIFF,
          data: {
            wikiId: wikiId,
            pageTitle: pageTitle,
            fromRevisionId: revisionId,
            toRevisionId: toRevisionId,
          },
        };
      } else {
        mainDiffTab = {
          id: activeTab.id,
          createdAt: activeTab.createdAt,
          updatedAt: now,
          name: `[${wikiId}] ${pageTitle} [${parentRevisionId}-${revisionId}]`,
          type: TabType.MAIN_DIFF,
          data: {
            wikiId: wikiId,
            pageTitle: pageTitle,
            fromRevisionId: parentRevisionId === 0 ? revisionId : parentRevisionId,
            toRevisionId: revisionId,
          },
        };
      }

      appState.local.activeTab.set(mainDiffTab);
      scrollToTopTabMainPanel();
    }
  };

  const handleTouchStartRevisionButton = (revisionId: number) => {
    if (activeTab) {
      timeoutId = setTimeout(() => {
        const now = dayjs().toISOString();
        const mainDiffTab: Tab = {
          id: activeTab.id,
          createdAt: activeTab.createdAt,
          updatedAt: now,
          name: `[${wikiId}] ${pageTitle} [${revisionId}-${toRevisionId}]`,
          type: TabType.MAIN_DIFF,
          data: {
            wikiId: wikiId,
            pageTitle: pageTitle,
            fromRevisionId: revisionId,
            toRevisionId: toRevisionId,
          },
        };
        appState.local.activeTab.set(mainDiffTab);
        scrollToTopTabMainPanel();
      }, 1500);
    }
  };

  const handleClickUsernameLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleDoubleClickUsernameLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const anchor = event.target as HTMLAnchorElement;
    window.open(anchor.href);
  };

  return (
    <Box className={classes.wrapper}>
      <Stack gap="xs">
        <Text size="sm" fw={500}>
          {formatMessage({ id: 'ui.pagePanel.title' })}
        </Text>

        <Stack gap={4}>
          {revisions.map((revision, index) => {
            const isFromRevision = revision.revisionId === fromRevisionId;
            const isToRevision = revision.revisionId === toRevisionId;
            const date = dayjs(revision.timestamp).format('YYYY-MM-DD');
            let showDate;

            if (dates.has(date)) {
              showDate = false;
            } else {
              showDate = true;
              dates.add(date);
            }

            return (
              <Fragment key={revision.revisionId}>
                {showDate && <Text className={classes.index}>{date}</Text>}
                <HoverCard
                  width={675}
                  shadow="lg"
                  radius="md"
                  position="left"
                  offset={30}
                  disabled={!preview || !largerThanMd || revision.parentId === 0}
                >
                  <HoverCard.Target>
                    <UnstyledButton
                      className={classes.revision}
                      data-from={isFromRevision}
                      data-to={isToRevision}
                      onClick={(event) =>
                        handleClickRevisionButton(event, revision.parentId, revision.revisionId)
                      }
                      onTouchStart={() => handleTouchStartRevisionButton(revision.revisionId)}
                      onTouchEnd={() => clearTimeout(timeoutId)}
                      onTouchMove={() => clearTimeout(timeoutId)}
                    >
                      <Group gap={5} justify="space-between" w="100%">
                        <Group gap={5} wrap="nowrap">
                          <Text className={classes.index}>{index + 1}</Text>
                          <Text className={classes.timestamp}>
                            {dayjs(revision.timestamp).format('HH:mm:ss')}
                          </Text>
                          {revision.minor && (
                            <IconLeaf
                              size="0.85rem"
                              stroke={1.5}
                              color="var(--mantine-color-gray-light-color)"
                            />
                          )}
                        </Group>

                        <LengthDeltaText
                          className={classes.delta}
                          newLength={revision.size}
                          oldLength={revision.parentSize}
                        />
                      </Group>

                      <Anchor
                        className={classes.user}
                        size="xs"
                        href={MwHelper.createUserContribUri(serverName, revision.user)}
                        target="_blank"
                        fw={500}
                        onClick={handleClickUsernameLink}
                        onDoubleClick={handleDoubleClickUsernameLink}
                      >
                        {revision.user}
                      </Anchor>
                    </UnstyledButton>
                  </HoverCard.Target>

                  <HoverCard.Dropdown p={0} style={{ overflow: 'hidden' }}>
                    <DiffPreview
                      wikiId={wikiId}
                      fromRevisionId={revision.parentId}
                      toRevisionId={revision.revisionId}
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
