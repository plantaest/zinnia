import {
  ActionIcon,
  Anchor,
  Box,
  Group,
  HoverCard,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { IconFile, IconLeaf, IconPlus, IconReload } from '@tabler/icons-react';
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
import { DiffPreviewPanel } from '@/components/DiffPreviewPanel/DiffPreviewPanel';

interface PagePanelProps {
  wikiId: string;
  pageTitle: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function PagePanel({ wikiId, pageTitle, fromRevisionId, toRevisionId }: PagePanelProps) {
  const { formatMessage } = useIntl();
  const { data: revisions = [], refetch, isFetching } = useGetRevisions(wikiId, pageTitle, 30);
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;
  const dates = new Set<string>();
  let timeoutId: NodeJS.Timeout;
  const preview = useSelector(appState.ui.preview);
  const largerThanLg = useLargerThan('lg');

  const handleClickReloadButton = () => refetch();

  const selectRevision = (
    event: React.MouseEvent<HTMLButtonElement>,
    parentRevisionId: number,
    revisionId: number
  ) => {
    const activeTab = appState.ui.activeTab.peek();

    if (activeTab && (activeTab.type === TabType.DIFF || activeTab.type === TabType.MAIN_DIFF)) {
      let diffTab: Tab;
      const now = dayjs().toISOString();

      if (event.ctrlKey || event.metaKey) {
        diffTab = {
          id: activeTab.id,
          createdAt: activeTab.createdAt,
          updatedAt: now,
          name: `[${wikiId}] ${pageTitle} [${revisionId}-${toRevisionId}]`,
          type: activeTab.type,
          data: {
            wikiId: wikiId,
            pageTitle: pageTitle,
            fromRevisionId: revisionId,
            toRevisionId: toRevisionId,
          },
        };
      } else {
        diffTab = {
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
      }

      appState.ui.activeTab.set(diffTab);
      scrollToTopTabMainPanel();
    }
  };

  const handleClickRevisionButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    parentRevisionId: number,
    revisionId: number
  ) => {
    if (!largerThanLg) {
      event.preventDefault();
    } else {
      selectRevision(event, parentRevisionId, revisionId);
    }
  };

  const handleDoubleClickRevisionButton = (
    event: React.MouseEvent<HTMLButtonElement>,
    parentRevisionId: number,
    revisionId: number
  ) => {
    if (largerThanLg) {
      event.preventDefault();
    } else {
      selectRevision(event, parentRevisionId, revisionId);
    }
  };

  const handleMouseDownRevisionButton = (revisionId: number) => {
    if (!largerThanLg) {
      const activeTab = appState.ui.activeTab.peek();

      if (activeTab && (activeTab.type === TabType.DIFF || activeTab.type === TabType.MAIN_DIFF)) {
        timeoutId = setTimeout(() => {
          const now = dayjs().toISOString();
          const diffTab: Tab = {
            id: activeTab.id,
            createdAt: activeTab.createdAt,
            updatedAt: now,
            name: `[${wikiId}] ${pageTitle} [${revisionId}-${toRevisionId}]`,
            type: activeTab.type,
            data: {
              wikiId: wikiId,
              pageTitle: pageTitle,
              fromRevisionId: revisionId,
              toRevisionId: toRevisionId,
            },
          };
          appState.ui.activeTab.set(diffTab);
          scrollToTopTabMainPanel();
        }, 500);
      }
    }
  };

  const handleMouseUpRevisionButton = () => {
    if (!largerThanLg) {
      clearTimeout(timeoutId);
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
        <Group gap="xs" justify="space-between">
          <Group gap={6}>
            <IconFile size="1rem" stroke={1.5} />
            <Text size="sm" fw={500}>
              {formatMessage({ id: 'ui.pagePanel.title' })}
            </Text>
          </Group>

          <Group gap={2}>
            <ActionIcon
              variant="transparent"
              size="sm"
              title={formatMessage({ id: 'common.reload' })}
              aria-label={formatMessage({ id: 'common.reload' })}
              onClick={handleClickReloadButton}
              loading={isFetching}
            >
              <IconReload size="1rem" />
            </ActionIcon>
          </Group>
        </Group>

        {revisions.length > 0 && (
          <Stack gap={4}>
            {revisions.map((revision, index) => {
              const isFromRevision = revision.revisionId === fromRevisionId;
              const isToRevision = revision.revisionId === toRevisionId;
              const isIntermediateRevision =
                revision.revisionId > fromRevisionId && revision.revisionId < toRevisionId
                  ? 'new-old'
                  : revision.revisionId < fromRevisionId && revision.revisionId > toRevisionId
                    ? 'old-new'
                    : 'none';
              const date = dayjs(revision.timestamp).format('DD-MM-YYYY');
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
                    offset={25}
                    disabled={!preview || !largerThanLg || revision.parentId === 0}
                  >
                    <HoverCard.Target>
                      <UnstyledButton
                        className={classes.revision}
                        data-from={isFromRevision}
                        data-to={isToRevision}
                        data-intermediate={isIntermediateRevision}
                        onClick={(event) =>
                          handleClickRevisionButton(event, revision.parentId, revision.revisionId)
                        }
                        onDoubleClick={(event) =>
                          handleDoubleClickRevisionButton(
                            event,
                            revision.parentId,
                            revision.revisionId
                          )
                        }
                        onMouseDown={() => handleMouseDownRevisionButton(revision.revisionId)}
                        onMouseUp={handleMouseUpRevisionButton}
                        onMouseMove={handleMouseUpRevisionButton}
                        onTouchStart={() => handleMouseDownRevisionButton(revision.revisionId)}
                        onTouchEnd={handleMouseUpRevisionButton}
                        onTouchMove={handleMouseUpRevisionButton}
                      >
                        <Group gap={2} justify="space-between" w="100%">
                          <Group gap={5} wrap="nowrap">
                            <Text className={classes.index}>{index + 1}</Text>
                            <Text className={classes.timestamp}>
                              {dayjs(revision.timestamp).format('HH:mm:ss')}
                            </Text>
                            <Text className={classes.revisionId} data-hidden={revision.sha1Hidden}>
                              {revision.revisionId}
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

                        <Group gap={5} wrap="nowrap" maw="100%">
                          {revision.parentId === 0 && (
                            <ThemeIcon size={14} color="green">
                              <IconPlus size="0.85rem" stroke={1.5} />
                            </ThemeIcon>
                          )}
                          <Anchor
                            tabIndex={-1}
                            className={classes.user}
                            size="xs"
                            href={MwHelper.createUserContribUri(serverName, revision.user)}
                            target="_blank"
                            fw={500}
                            onClick={handleClickUsernameLink}
                            onDoubleClick={handleDoubleClickUsernameLink}
                            data-hidden={revision.userHidden}
                          >
                            {revision.user}
                          </Anchor>
                        </Group>
                      </UnstyledButton>
                    </HoverCard.Target>

                    <HoverCard.Dropdown p={0} style={{ overflow: 'hidden' }}>
                      <DiffPreviewPanel
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
        )}
      </Stack>
    </Box>
  );
}
