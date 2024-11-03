import './diff-styles.css';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  TypographyStylesProvider,
  useDirection,
} from '@mantine/core';
import { CompareRevisionsResult } from '@plantaest/composite';
import dayjs from 'dayjs';
import {
  IconAlertTriangle,
  IconExternalLink,
  IconFile,
  IconInfoCircle,
  IconQuote,
  IconUser,
} from '@tabler/icons-react';
import { useEffect, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useSelector } from '@legendapp/state/react';
import { useIntl } from 'react-intl';
import { useDisclosure } from '@mantine/hooks';
import { v4 as uuidv4 } from 'uuid';
import { useCompareRevisions } from '@/queries/useCompareRevisions';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import classes from './DiffTab.module.css';
import { LengthDeltaBadge } from '@/components/LengthDeltaBadge/LengthDeltaBadge';
import { isRtlLang } from '@/utils/isRtlLang';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { PagePanel } from '@/components/PagePanel/PagePanel';
import { appState } from '@/states/appState';
import { UserPanel } from '@/components/UserPanel/UserPanel';
import { useLargerThan } from '@/hooks/useLargerThan';
import { DiffTabData, Tab, TabType } from '@/types/persistence/Tab';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';
import { CloseModalButton } from '@/components/CloseModalButton/CloseModalButton';

interface DiffTabProps {
  tabId: string;
  tabData: DiffTabData;
}

export function DiffTab({ tabId, tabData }: DiffTabProps) {
  const { dir: globalDir } = useDirection();
  const { formatMessage } = useIntl();
  const largerThanLg = useLargerThan('lg');

  const { wikiId, pageTitle, fromRevisionId, toRevisionId } = tabData;

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

  const advancedMode = useSelector(appState.userConfig.advancedMode);

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

  // PagePanel & UserPanel modals
  const [openedPagePanelModal, { open: openPagePanelModal, close: closePagePanelModal }] =
    useDisclosure(false);
  const [openedUserPanelModal, { open: openUserPanelModal, close: closeUserPanelModal }] =
    useDisclosure(false);

  const handleClickPageInfoButton = () => {
    const now = dayjs().toISOString();
    const pageTab: Tab = {
      id: uuidv4(),
      createdAt: now,
      updatedAt: now,
      name: `[${wikiId}] ${pageTitle}`,
      type: TabType.PAGE,
      data: {
        wikiId: wikiId,
        pageTitle: pageTitle,
      },
    };
    appState.ui.activeTabs.set((tabs) => [...tabs, pageTab]);
    appState.ui.activeTabId.set(pageTab.id);
    scrollToTopTabMainPanel();
  };

  // PageContext
  const activeTabId = useSelector(appState.ui.activeTabId);

  useEffect(() => {
    if (tabId === activeTabId && isSuccess) {
      appState.ui.pageContext.set({
        environment: 'zinnia',
        contextType: 'diff',
        wikiId: tabData.wikiId,
        wikiServerName: wikis.getWiki(tabData.wikiId).getConfig().serverName,
        pageId: compareResult.toId,
        pageTitle: tabData.pageTitle,
        revisionId: compareResult.toRevisionId,
      });
    }
  }, [activeTabId, tabData, compareResult, isSuccess]);

  return (
    <Flex wrap="nowrap" w="100%">
      <Stack p={5} gap={5} flex={1} w="100%" miw={0}>
        <Box className={classes.box}>
          <Stack gap="xs">
            <Group gap="xs" justify="space-between" wrap="nowrap">
              <Group gap="xs" wrap="nowrap" flex={1} miw={0}>
                <Badge ff="var(--zinnia-font-monospace)" h="1.625rem" radius="sm" tt="lowercase">
                  {wikiId}
                </Badge>
                <Flex flex={1} miw={0} visibleFrom="sm">
                  <Anchor
                    fw={600}
                    href={MwHelper.createPageUri(serverName, pageTitle)}
                    target="_blank"
                    style={{
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  >
                    {pageTitle}
                  </Anchor>
                </Flex>
              </Group>

              <Group gap="xs">
                <ActionIcon.Group>
                  {!largerThanLg && advancedMode && (
                    <>
                      <ActionIcon
                        size={26}
                        variant="light"
                        onClick={openPagePanelModal}
                        title={formatMessage({ id: 'ui.pagePanel.title' })}
                        aria-label={formatMessage({ id: 'ui.pagePanel.title' })}
                      >
                        <IconFile size="1rem" />
                      </ActionIcon>
                      <ActionIcon
                        size={26}
                        variant="light"
                        onClick={openUserPanelModal}
                        title={formatMessage({ id: 'ui.userPanel.title' })}
                        aria-label={formatMessage({ id: 'ui.userPanel.title' })}
                      >
                        <IconUser size="1rem" />
                      </ActionIcon>
                    </>
                  )}
                  <ActionIcon
                    size={26}
                    variant="light"
                    component="a"
                    href={MwHelper.createDiffUri(
                      serverName,
                      pageTitle,
                      compareResult.fromRevisionId,
                      compareResult.toRevisionId
                    )}
                    target="_blank"
                  >
                    <IconExternalLink size="1rem" />
                  </ActionIcon>
                </ActionIcon.Group>
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
                    <ActionIcon variant="transparent" size={26} onClick={handleClickPageInfoButton}>
                      <IconInfoCircle size="1.25rem" />
                    </ActionIcon>
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
                    {dayjs(compareResult.fromTimestamp).format('DD-MM-YYYY')}
                  </Text>
                </Group>

                <Text className={classes.label} c="orange">
                  {compareResult.fromRevisionId}
                </Text>
              </Group>

              <Group gap={8} wrap="nowrap">
                <IconUser size="1rem" />
                <Flex flex={1} miw={0}>
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
                </Flex>
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
                    {dayjs(compareResult.toTimestamp).format('DD-MM-YYYY')}
                  </Text>
                </Group>

                <Text className={classes.label} c="cyan">
                  {compareResult.toRevisionId}
                </Text>
              </Group>

              <Group gap={8} wrap="nowrap">
                <IconUser size="1rem" />
                <Flex flex={1} miw={0}>
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
                </Flex>
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

      {advancedMode && (
        <>
          <Stack gap={5} visibleFrom="lg" className={classes.right}>
            <PagePanel
              wikiId={wikiId}
              pageTitle={pageTitle}
              fromRevisionId={fromRevisionId}
              toRevisionId={toRevisionId}
            />
            <UserPanel
              wikiId={wikiId}
              fromUsername={compareResult.fromUser}
              toUsername={compareResult.toUser}
              fromRevisionId={fromRevisionId}
              toRevisionId={toRevisionId}
            />
          </Stack>

          <Modal
            opened={openedPagePanelModal}
            onClose={closePagePanelModal}
            padding="xs"
            fullScreen
            withCloseButton={false}
            withOverlay={false}
          >
            <Stack gap="xs">
              <CloseModalButton onClick={closePagePanelModal} />
              <PagePanel
                wikiId={wikiId}
                pageTitle={pageTitle}
                fromRevisionId={fromRevisionId}
                toRevisionId={toRevisionId}
              />
            </Stack>
          </Modal>

          <Modal
            opened={openedUserPanelModal}
            onClose={closeUserPanelModal}
            padding="xs"
            fullScreen
            withCloseButton={false}
            withOverlay={false}
          >
            <Stack gap="xs">
              <CloseModalButton onClick={closeUserPanelModal} />
              <UserPanel
                wikiId={wikiId}
                fromUsername={compareResult.fromUser}
                toUsername={compareResult.toUser}
                fromRevisionId={fromRevisionId}
                toRevisionId={toRevisionId}
              />
            </Stack>
          </Modal>
        </>
      )}
    </Flex>
  );
}
