import {
  Anchor,
  Avatar,
  Box,
  Flex,
  Group,
  MantineColor,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import {
  IconAlignJustified,
  IconArrowLoopRight,
  IconCategory,
  IconCode,
  IconExternalLink,
  IconEye,
  IconLeaf,
  IconPlus,
  IconRobotFace,
  IconSpy,
  IconUser,
} from '@tabler/icons-react';
import { Change } from '@plantaest/aster';
import dayjs from 'dayjs';
import { useComputed } from '@legendapp/state/react';
import React, { memo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import classes from './ChangeCard.module.css';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import { TablerIcon } from '@/types/lib/TablerIcon';
import { appState } from '@/states/appState';
import { OresScoreBadge } from '@/components/ChangeCard/OresScoreBadge';
import { Tab, TabType } from '@/types/persistence/Tab';
import { LengthDeltaBadge } from '@/components/LengthDeltaBadge/LengthDeltaBadge';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';
import { shortenPageTitle } from '@/utils/shortenPageTitle';
import { shortenId } from '@/utils/shortenId';

interface EditChangeCardProps {
  change: Change;
  index: number;
}

function _ChangeCard({ change, index }: EditChangeCardProps) {
  const isCodeFile = ['.js', '.css', '.json'].some((fileType) => change.title.endsWith(fileType));

  const changeTypeIcons: Record<Change['type'], TablerIcon> = {
    edit: change.redirect ? IconArrowLoopRight : isCodeFile ? IconCode : IconAlignJustified,
    new: change.redirect ? IconArrowLoopRight : isCodeFile ? IconCode : IconPlus,
    categorize: IconCategory,
    log: IconEye,
    external: IconExternalLink,
  };

  const changeTypeColors: Record<Change['type'], MantineColor> = {
    edit: 'blue',
    new: 'green',
    categorize: 'orange',
    log: 'violet',
    external: 'pink',
  };

  const ChangeIcon = changeTypeIcons[change.type];

  const UserIcon = change.anon ? IconSpy : change.bot ? IconRobotFace : IconUser;

  const serverName = wikis.getWiki(change.wikiId).getConfig().serverName;

  const pageTitleLink =
    change.type === 'log'
      ? MwHelper.createLogPageUri(serverName, change.title)
      : change.type === 'external'
        ? MwHelper.createWikidataItemUri(change.wikiId, change.title)
        : change.redirect
          ? MwHelper.createRedirectUri(serverName, change.title)
          : MwHelper.createPageUri(serverName, change.title);

  const usernameLink =
    change.type === 'log'
      ? MwHelper.createLogUserUri(serverName, change.user)
      : change.type === 'external'
        ? MwHelper.createWikidataUserContribUri(change.user)
        : MwHelper.createUserContribUri(serverName, change.user);

  const isSelected = useComputed(() => {
    const selectedChange = appState.ui.selectedChange.get();
    return (
      selectedChange &&
      change.wikiId === selectedChange.wikiId &&
      change.recentChangeId === selectedChange.recentChangeId
    );
  });

  const handleClickChangeButton = (event: React.MouseEvent<HTMLButtonElement>) => {
    const tabs = appState.local.activeTabs.get();
    const now = dayjs().toISOString();

    if (change.type === 'edit') {
      if (event.ctrlKey || event.metaKey) {
        const diffTab: Tab = {
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          name: `[${change.wikiId}] ${shortenPageTitle(change.title)} [${shortenId(change.oldRevisionId)}-${shortenId(change.revisionId)}]`,
          type: TabType.DIFF,
          data: {
            wikiId: change.wikiId,
            fromRevisionId: change.oldRevisionId,
            toRevisionId: change.revisionId,
          },
        };
        appState.local.activeTabs.set([...tabs, diffTab]);
      } else {
        appState.ui.selectedChange.set(change);

        const currentMainDiffTab = tabs.find((tab) => tab.type === TabType.MAIN_DIFF);
        let tabId;

        if (!currentMainDiffTab) {
          tabId = uuidv4();
          const mainDiffTab: Tab = {
            id: tabId,
            createdAt: now,
            updatedAt: now,
            name: `[${change.wikiId}] ${shortenPageTitle(change.title)} [${shortenId(change.oldRevisionId)}-${shortenId(change.revisionId)}]`,
            type: TabType.MAIN_DIFF,
            data: {
              wikiId: change.wikiId,
              fromRevisionId: change.oldRevisionId,
              toRevisionId: change.revisionId,
            },
          };
          appState.local.activeTabs.set([...tabs, mainDiffTab]);
        } else {
          tabId = currentMainDiffTab.id;
          const mainDiffTab: Tab = {
            id: tabId,
            createdAt: currentMainDiffTab.createdAt,
            updatedAt: now,
            name: `[${change.wikiId}] ${shortenPageTitle(change.title)} [${shortenId(change.oldRevisionId)}-${shortenId(change.revisionId)}]`,
            type: TabType.MAIN_DIFF,
            data: {
              wikiId: change.wikiId,
              fromRevisionId: change.oldRevisionId,
              toRevisionId: change.revisionId,
            },
          };
          appState.local.activeTabs.set(
            appState.local.activeTabs
              .get()
              .map((tab) => (tab.type === TabType.MAIN_DIFF ? mainDiffTab : tab))
          );
        }

        appState.local.activeTabId.set(tabId);
        scrollToTopTabMainPanel();
      }
    }

    if (change.type === 'new') {
      if (event.ctrlKey || event.metaKey) {
        const readTab: Tab = {
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
          name: `[${change.wikiId}] ${shortenPageTitle(change.title)}`,
          type: TabType.READ,
          data: {
            wikiId: change.wikiId,
            pageTitle: change.title,
            revisionId: change.revisionId,
            redirect: change.redirect,
          },
        };
        appState.local.activeTabs.set([...tabs, readTab]);
      } else {
        appState.ui.selectedChange.set(change);

        const currentMainReadTab = tabs.find((tab) => tab.type === TabType.MAIN_READ);
        let tabId;

        if (!currentMainReadTab) {
          tabId = uuidv4();
          const mainReadTab: Tab = {
            id: tabId,
            createdAt: now,
            updatedAt: now,
            name: `[${change.wikiId}] ${shortenPageTitle(change.title)}`,
            type: TabType.MAIN_READ,
            data: {
              wikiId: change.wikiId,
              pageTitle: change.title,
              revisionId: change.revisionId,
              redirect: change.redirect,
            },
          };
          appState.local.activeTabs.set([...tabs, mainReadTab]);
        } else {
          tabId = currentMainReadTab.id;
          const mainReadTab: Tab = {
            id: tabId,
            createdAt: currentMainReadTab.createdAt,
            updatedAt: now,
            name: `[${change.wikiId}] ${shortenPageTitle(change.title)}`,
            type: TabType.MAIN_READ,
            data: {
              wikiId: change.wikiId,
              pageTitle: change.title,
              revisionId: change.revisionId,
              redirect: change.redirect,
            },
          };
          appState.local.activeTabs.set(
            appState.local.activeTabs
              .get()
              .map((tab) => (tab.type === TabType.MAIN_READ ? mainReadTab : tab))
          );
        }

        appState.local.activeTabId.set(tabId);
        scrollToTopTabMainPanel();
      }
    }
  };

  const handleClickPageTitleLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleClickUsernameLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  const handleDoubleClickPageTitleLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const anchor = event.target as HTMLAnchorElement;
    window.open(anchor.href);
  };

  const handleDoubleClickUsernameLink = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const anchor = event.target as HTMLAnchorElement;
    window.open(anchor.href);
  };

  return (
    <Flex gap={7} wrap="nowrap" className={classes.wrapper}>
      <Box className={classes.bar} />
      <UnstyledButton
        className={classes.card}
        data-active={isSelected.get()}
        onClick={handleClickChangeButton}
      >
        <Stack gap={4}>
          <Group justify="space-between" gap={5}>
            {/* TODO: LOCALIZE (date/time) */}
            <Group gap={5}>
              <Text className={classes.indexAndWikiId}>{index + 1}</Text>
              <Text className={classes.timestamp} data-patrolled={change.patrolled}>
                {dayjs(change.timestamp).format('HH:mm:ss')}
              </Text>
              {change.minor && (
                <IconLeaf size="1rem" stroke={1.5} color="var(--mantine-color-gray-light-color)" />
              )}
            </Group>
            <Text className={classes.indexAndWikiId}>{change.wikiId}</Text>
          </Group>

          <Group justify="space-between" gap={8} wrap="nowrap">
            <Group className={classes.pageTitle}>
              <Avatar size="sm" radius="sm" color={changeTypeColors[change.type]} variant="filled">
                <ChangeIcon size="1rem" />
              </Avatar>

              <Anchor
                size="sm"
                href={pageTitleLink}
                target="_blank"
                fw={500}
                onClick={handleClickPageTitleLink}
                onDoubleClick={handleDoubleClickPageTitleLink}
              >
                {change.title}
              </Anchor>
            </Group>

            {['edit', 'new'].includes(change.type) && (
              <LengthDeltaBadge newLength={change.newLength} oldLength={change.oldLength} />
            )}
          </Group>

          <Group justify="space-between" gap={8}>
            <Group className={classes.username}>
              <Avatar size="sm" radius="sm" color="blue" variant="filled">
                <UserIcon size="1rem" />
              </Avatar>

              <Anchor
                size="sm"
                href={usernameLink}
                target="_blank"
                fw={500}
                onClick={handleClickUsernameLink}
                onDoubleClick={handleDoubleClickUsernameLink}
              >
                {change.user}
              </Anchor>
            </Group>

            <OresScoreBadge change={change} />
          </Group>
        </Stack>
      </UnstyledButton>
    </Flex>
  );
}

export const ChangeCard = memo(_ChangeCard);
