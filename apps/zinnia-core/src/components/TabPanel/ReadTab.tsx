import { PageHtmlResult } from '@plantaest/composite';
import { ActionIcon, Anchor, Badge, Box, Flex, Group, Loader, Stack, Text } from '@mantine/core';
import ReactShadowRoot from 'react-shadow-root';
import { IconAlertTriangle, IconInfoCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { v4 as uuidv4 } from 'uuid';
import { useGetPageHtml } from '@/queries/useGetPageHtml';
import classes from './ReadTab.module.css';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import { ParsoidOutput } from '@/components/ParsoidOutput/ParsoidOutput';
import { useGetWikiStyleSheet } from '@/queries/useGetWikiStyleSheet';
import parsedHtmlStyles from './parsed-html-styles.css?inline';
import { Tab, TabType } from '@/types/persistence/Tab';
import { appState } from '@/states/appState';
import { scrollToTopTabMainPanel } from '@/utils/scrollToTopTabMainPanel';

const placeholderPageHtmlResult: PageHtmlResult = {
  title: 'N/A',
  pageId: 0,
  revisionId: 0,
  html: '',
};

interface ReadTabProps {
  wikiId: string;
  pageTitle: string;
  revisionId: number;
  redirect: boolean;
}

export function ReadTab({ wikiId, pageTitle, revisionId, redirect }: ReadTabProps) {
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;

  const {
    data: pageHtmlResult = placeholderPageHtmlResult,
    isFetching: isFetchingGetPageHtml,
    isError,
    isSuccess: isSuccessGetPageHtml,
  } = useGetPageHtml(wikiId, pageTitle);
  const {
    data: wikiStyleSheet,
    isFetching: isFetchingGetWikiStyleSheet,
    isSuccess: isSuccessGetWikiStyleSheet,
  } = useGetWikiStyleSheet(wikiId, serverName, pageHtmlResult.html);

  const isLoading = isFetchingGetPageHtml || isFetchingGetWikiStyleSheet;
  const isSuccess = isSuccessGetPageHtml || isSuccessGetWikiStyleSheet;

  // TODO: Refactor duplicated functions
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

  return (
    <Stack p={5} gap={5} flex={1} w="100%">
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
                  href={
                    redirect
                      ? MwHelper.createRedirectUri(serverName, pageTitle)
                      : MwHelper.createPageUri(serverName, pageTitle)
                  }
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

            <Group gap="sm">
              <Text className={classes.label} c="cyan">
                {revisionId}
              </Text>
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
            href={
              redirect
                ? MwHelper.createRedirectUri(serverName, pageTitle)
                : MwHelper.createPageUri(serverName, pageTitle)
            }
            target="_blank"
            w="fit-content"
            style={{ wordBreak: 'break-word' }}
          >
            {pageTitle}
          </Anchor>
        </Stack>
      </Box>

      <Box px={6} pb={6} pos="relative">
        <ReactShadowRoot>
          <style>{parsedHtmlStyles}</style>
          {Boolean(pageHtmlResult.html) && Boolean(wikiStyleSheet) && (
            <>
              <style>{wikiStyleSheet}</style>
              <ParsoidOutput html={pageHtmlResult.html} options={{ wikiId, serverName }} />
            </>
          )}
        </ReactShadowRoot>
      </Box>
    </Stack>
  );
}
