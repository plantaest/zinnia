import { PageHtmlResult } from '@plantaest/aster';
import { Anchor, Badge, Box, Flex, Group, Loader, Stack, Text } from '@mantine/core';
import ReactShadowRoot from 'react-shadow-root';
import { IconAlertTriangle, IconCheck } from '@tabler/icons-react';
import { useGetPageHtml } from '@/queries/useGetPageHtml';
import classes from './ReadTab.module.css';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import { ParsoidOutput } from '@/components/ParsoidOutput/ParsoidOutput';
import { useGetWikiStyleSheet } from '@/queries/useGetWikiStyleSheet';
import parsedHtmlStyles from './parsed-html-styles.css?inline';

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

export function ReadTab({ wikiId, pageTitle, redirect }: ReadTabProps) {
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

  return (
    <Stack p={5} gap={5}>
      <Box className={classes.box}>
        <Group gap="xs" justify="space-between" wrap="nowrap">
          <Group
            gap="xs"
            wrap="nowrap"
            style={{
              overflow: 'hidden',
              flex: 1,
            }}
          >
            <Badge ff="var(--mantine-alt-font-monospace)" h="1.625rem" radius="sm" tt="lowercase">
              {wikiId}
            </Badge>
            <Box
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
                href={
                  redirect
                    ? MwHelper.createRedirectUri(serverName, pageTitle)
                    : MwHelper.createPageUri(serverName, pageTitle)
                }
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

          <Group gap="sm">
            <Text className={classes.label}>{pageHtmlResult.pageId}</Text>
            <Flex justify="center" align="center" h={20} w={20} me={2}>
              {isLoading ? (
                <Loader color="blue" size="1rem" type="bars" />
              ) : isError ? (
                <IconAlertTriangle size="1.25rem" color="var(--mantine-color-red-5)" />
              ) : isSuccess ? (
                <IconCheck size="1.25rem" color="var(--mantine-color-green-5)" />
              ) : null}
            </Flex>
          </Group>
        </Group>
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
