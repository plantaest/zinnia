import './diff-styles.css';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Flex,
  Group,
  Loader,
  Stack,
  Text,
  TypographyStylesProvider,
  useDirection,
} from '@mantine/core';
import { CompareRevisionsResult } from '@plantaest/aster';
import dayjs from 'dayjs';
import { IconAlertTriangle, IconCheck, IconLink, IconQuote, IconUser } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useCompareRevisions } from '@/queries/useCompareRevisions';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import classes from './DiffTab.module.css';
import { LengthDeltaBadge } from '@/components/LengthDeltaBadge/LengthDeltaBadge';
import { isRtlLang } from '@/utils/isRtlLang';
import { sanitizeHtml } from '@/utils/sanitizeHtml';

interface DiffTabProps {
  wikiId: string;
  pageTitle: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export function DiffTab({ wikiId, pageTitle, fromRevisionId, toRevisionId }: DiffTabProps) {
  const { dir: globalDir } = useDirection();

  const placeholderCompareRevisionsResult: CompareRevisionsResult = {
    fromId: 0,
    fromRevisionId: fromRevisionId,
    fromNs: 0,
    fromTitle: 'N/A',
    fromSize: 0,
    fromTimestamp: '2000-01-01T00:00:00Z',
    fromUser: 'N/A',
    fromUserId: 0,
    fromComment: null,
    fromParsedComment: null,
    toId: 0,
    toRevisionId: toRevisionId,
    toNs: 0,
    toTitle: 'N/A',
    toSize: 0,
    toTimestamp: '2000-01-01T00:00:00Z',
    toUser: 'N/A',
    toUserId: 0,
    toComment: null,
    toParsedComment: null,
    prev: 0,
    next: 0,
    diffSize: 0,
    body: '',
  };

  const {
    data: compareResult = placeholderCompareRevisionsResult,
    isFetching: isLoading,
    isError,
    isSuccess,
  } = useCompareRevisions(wikiId, fromRevisionId, toRevisionId, 'table');

  const serverName = wikis.getWiki(wikiId).getConfig().serverName;
  const contentLanguage = wikis.getWiki(wikiId).getConfig().language;
  const contentDir = isRtlLang(contentLanguage) ? 'rtl' : 'ltr';

  const diffTableRef = useRef<HTMLTableElement | null>(null);

  useEffect(() => {
    type TempRefs = null | {
      diffTable: Element;
      deletedCells: NodeListOf<Element>;
      addedCells: NodeListOf<Element>;
      changeToDeleted: () => void;
      changeToAdded: () => void;
      movedParaLeftAnchors: NodeListOf<Element>;
      movedParaRightAnchors: NodeListOf<Element>;
      scrollToCorrespondingCell: (event: Event) => void;
    };

    let tempRefs: TempRefs = null;

    if (diffTableRef.current) {
      // Select only one column at once
      const diffTable = diffTableRef.current;
      const deletedCells = diffTable.querySelectorAll('.diff-side-deleted');
      const addedCells = diffTable.querySelectorAll('.diff-side-added');

      const changeToDeleted = () => {
        if (diffTable.getAttribute('data-selected-side') === 'added') {
          window.getSelection()?.removeAllRanges();
        }
        diffTable.setAttribute('data-selected-side', 'deleted');
      };

      const changeToAdded = () => {
        if (diffTable.getAttribute('data-selected-side') === 'deleted') {
          window.getSelection()?.removeAllRanges();
        }
        diffTable.setAttribute('data-selected-side', 'added');
      };

      for (const cell of deletedCells) {
        cell.addEventListener('mousedown', changeToDeleted);
      }

      for (const cell of addedCells) {
        cell.addEventListener('mousedown', changeToAdded);
      }

      // Show moved paragraph anchors
      const movedParaLeftAnchors = diffTable.querySelectorAll('.mw-diff-movedpara-left');
      const movedParaLeftCells = diffTable.querySelectorAll(
        'tr:has(.mw-diff-movedpara-left) .diff-side-deleted'
      );
      const movedParaRightAnchors = diffTable.querySelectorAll('.mw-diff-movedpara-right');
      const movedParaRightCells = diffTable.querySelectorAll(
        'tr:has(.mw-diff-movedpara-right) .diff-side-added'
      );

      const scrollToCorrespondingCell = (event: Event) => {
        event.preventDefault();
        const currentAnchor = event.currentTarget as HTMLAnchorElement;
        const correspondingAnchorName = currentAnchor.getAttribute('href')?.replace('#', '');
        const correspondingCell = diffTable.querySelector(
          `td:has([name="${correspondingAnchorName}"])`
        );
        const correspondingCellAnchor = diffTable.querySelector(
          `td:has([name="${correspondingAnchorName}"]) > a`
        );

        if (correspondingCell && correspondingCellAnchor) {
          // Ref: https://stackoverflow.com/a/52835382
          scrollIntoView(correspondingCell, {
            behavior: 'instant',
            boundary: diffTable,
          });
          (correspondingCellAnchor as HTMLElement).focus();
        }
      };

      for (let i = 0; i < movedParaLeftAnchors.length; i += 1) {
        movedParaLeftCells[i].prepend(movedParaLeftAnchors[i]);
        movedParaLeftAnchors[i].innerHTML = '>>';
        movedParaLeftAnchors[i].addEventListener('click', scrollToCorrespondingCell);
      }

      for (let i = 0; i < movedParaRightAnchors.length; i += 1) {
        movedParaRightCells[i].prepend(movedParaRightAnchors[i]);
        movedParaRightAnchors[i].innerHTML = '<<';
        movedParaRightAnchors[i].addEventListener('click', scrollToCorrespondingCell);
      }

      // Support cleanup function
      tempRefs = {
        diffTable,
        deletedCells,
        addedCells,
        changeToDeleted,
        changeToAdded,
        movedParaLeftAnchors,
        movedParaRightAnchors,
        scrollToCorrespondingCell,
      };
    }

    return () => {
      if (tempRefs) {
        tempRefs.diffTable.removeAttribute('data-selected-side');

        for (const cell of tempRefs.deletedCells) {
          cell.removeEventListener('mousedown', tempRefs.changeToDeleted);
        }

        for (const cell of tempRefs.addedCells) {
          cell.removeEventListener('mousedown', tempRefs.changeToAdded);
        }

        for (const anchor of tempRefs.movedParaLeftAnchors) {
          anchor.removeEventListener('click', tempRefs.scrollToCorrespondingCell);
        }

        for (const anchor of tempRefs.movedParaRightAnchors) {
          anchor.removeEventListener('click', tempRefs.scrollToCorrespondingCell);
        }
      }
    };
  }, [compareResult.body, diffTableRef.current]);

  // Example: https://w.wiki/A5qr
  const processedDiffTableHtml = compareResult.body.replaceAll(/colspan="\d"/g, '');

  return (
    <Stack p={5} gap={5} flex={1} w="100%">
      <Box className={classes.box}>
        <Stack gap="xs">
          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Group
              gap="xs"
              wrap="nowrap"
              style={{
                overflow: 'hidden',
                flex: 1,
              }}
            >
              <Badge ff="var(--zinnia-font-monospace)" h="1.625rem" radius="sm" tt="lowercase">
                {wikiId}
              </Badge>
              <Box
                visibleFrom="sm"
                style={{
                  display: 'flex',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  flex: 1,
                  color: 'var(--mantine-color-anchor)',
                }}
              >
                <Anchor
                  fw={600}
                  href={MwHelper.createPageUri(serverName, pageTitle)}
                  target="_blank"
                  style={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                >
                  {pageTitle}
                </Anchor>
              </Box>
            </Group>

            <Group gap="xs">
              <ActionIcon
                size={26}
                variant="filled"
                component="a"
                href={MwHelper.createDiffUri(
                  serverName,
                  pageTitle,
                  compareResult.fromRevisionId,
                  compareResult.toRevisionId
                )}
                target="_blank"
              >
                <IconLink size="1rem" />
              </ActionIcon>
              <LengthDeltaBadge
                newLength={compareResult.toSize}
                oldLength={compareResult.fromSize}
              />
              <Flex justify="center" align="center" h={20} w={20} me={2}>
                {isLoading ? (
                  <Loader color="blue" size="1rem" />
                ) : isError ? (
                  <IconAlertTriangle size="1.25rem" color="var(--mantine-color-red-5)" />
                ) : isSuccess ? (
                  <IconCheck size="1.25rem" color="var(--mantine-color-green-5)" />
                ) : null}
              </Flex>
            </Group>
          </Group>

          <Anchor
            hiddenFrom="sm"
            fw={600}
            href={MwHelper.createPageUri(serverName, pageTitle)}
            target="_blank"
            w="fit-content"
            style={{ wordBreak: 'break-word' }}
          >
            {pageTitle}
          </Anchor>
        </Stack>
      </Box>

      <Flex gap={5} dir={contentDir} direction={{ base: 'column', sm: 'row' }}>
        <Box dir={globalDir} className={classes.box} flex={1} miw={0}>
          <Stack gap={5}>
            <Group justify="space-between" gap={5}>
              <Group gap={5}>
                <Text className={classes.label} c="blue">
                  {dayjs(compareResult.fromTimestamp).format('HH:mm:ss')}
                </Text>
                <Text className={classes.label}>
                  {dayjs(compareResult.fromTimestamp).format('YYYY-MM-DD')}
                </Text>
              </Group>

              <Text className={classes.label} c="orange">
                {compareResult.fromRevisionId}
              </Text>
            </Group>

            <Group gap={8} wrap="nowrap">
              <IconUser size="1rem" />
              <Box
                style={{
                  display: 'flex',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <Anchor
                  size="sm"
                  fw={500}
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                  href={MwHelper.createUserContribUri(serverName, compareResult.fromUser)}
                  target="_blank"
                >
                  {compareResult.fromUser}
                </Anchor>
              </Box>
            </Group>

            <Group gap={8} wrap="nowrap">
              <IconQuote size="1rem" />
              {compareResult.fromParsedComment ? (
                <TypographyStylesProvider flex={1} miw={0}>
                  <Text
                    size="xs"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    title={sanitizeHtml(compareResult.fromParsedComment)}
                    dangerouslySetInnerHTML={{
                      __html: MwHelper.correctParsedComment(
                        serverName,
                        compareResult.fromParsedComment
                      ),
                    }}
                  />
                </TypographyStylesProvider>
              ) : (
                <Text size="xs" c="dimmed" fs="italic">
                  N/A
                </Text>
              )}
            </Group>
          </Stack>
        </Box>

        <Box dir={globalDir} className={classes.box} flex={1} miw={0}>
          <Stack gap={5}>
            <Group justify="space-between" gap={5}>
              <Group gap={5}>
                <Text className={classes.label} c="blue">
                  {dayjs(compareResult.toTimestamp).format('HH:mm:ss')}
                </Text>
                <Text className={classes.label}>
                  {dayjs(compareResult.toTimestamp).format('YYYY-MM-DD')}
                </Text>
              </Group>

              <Text className={classes.label} c="cyan">
                {compareResult.toRevisionId}
              </Text>
            </Group>

            <Group gap={8} wrap="nowrap">
              <IconUser size="1rem" />
              <Box
                style={{
                  display: 'flex',
                  flex: 1,
                  overflow: 'hidden',
                }}
              >
                <Anchor
                  size="sm"
                  fw={500}
                  style={{
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                  }}
                  href={MwHelper.createUserContribUri(serverName, compareResult.toUser)}
                  target="_blank"
                >
                  {compareResult.toUser}
                </Anchor>
              </Box>
            </Group>

            <Group gap={8}>
              <IconQuote size="1rem" />
              {compareResult.toParsedComment ? (
                <TypographyStylesProvider flex={1} miw={0}>
                  <Text
                    size="xs"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                    title={sanitizeHtml(compareResult.toParsedComment)}
                    dangerouslySetInnerHTML={{
                      __html: MwHelper.correctParsedComment(
                        serverName,
                        compareResult.toParsedComment
                      ),
                    }}
                  />
                </TypographyStylesProvider>
              ) : (
                <Text size="xs" c="dimmed" fs="italic">
                  N/A
                </Text>
              )}
            </Group>
          </Stack>
        </Box>
      </Flex>

      <Box>
        <table className="diff" dir={contentDir} ref={diffTableRef}>
          <colgroup>
            <col className="diff-content" />
            <col className="diff-content" />
          </colgroup>
          <tbody
            dangerouslySetInnerHTML={{
              __html: processedDiffTableHtml,
            }}
          />
        </table>
      </Box>
    </Stack>
  );
}
