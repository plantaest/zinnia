import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Flex,
  Group,
  HoverCard,
  Menu,
  rem,
  Select,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  TypographyStylesProvider,
  UnstyledButton,
} from '@mantine/core';
import { CompositeChart } from '@mantine/charts';
import {
  IconArrowDownRight,
  IconArrowsMove,
  IconArrowsShuffle,
  IconBrackets,
  IconBrandWikipedia,
  IconChevronRight,
  IconCirclesRelation,
  IconCopyright,
  IconDots,
  IconEraser,
  IconHistory,
  IconInfoCircle,
  IconLanguage,
  IconLeaf,
  IconLetterD,
  IconLetterX,
  IconLink,
  IconList,
  IconLock,
  IconPencil,
  IconPlus,
  IconPlusMinus,
  IconQuote,
  IconReload,
  IconSlash,
  IconStar,
  IconSum,
  IconTimeline,
  IconTrash,
} from '@tabler/icons-react';
import { Fragment } from 'react';
import dayjs from 'dayjs';
import { useSelector } from '@legendapp/state/react';
import { useIntl } from 'react-intl';
import classes from './PageTab.module.css';
import { MwHelper } from '@/utils/MwHelper';
import { wikis } from '@/utils/wikis';
import { useGetRevisions } from '@/queries/useGetRevisions';
import { LengthDeltaText } from '@/components/LengthDeltaText/LengthDeltaText';
import { sanitizeHtml } from '@/utils/sanitizeHtml';
import { DiffPreviewPanel } from '@/components/DiffPreviewPanel/DiffPreviewPanel';
import { appState } from '@/states/appState';
import { useLargerThan } from '@/hooks/useLargerThan';

const infoboxes = [
  {
    title: 'Kích thước trang',
    value: '105.271',
  },
  {
    title: 'Kiểu nội dung',
    value: 'wikitext',
  },
  {
    title: 'Tình trạng khóa',
    value: 'autoconfirmed',
  },
  {
    title: 'Ngày tạo',
    value: '25-07-2024',
  },
  {
    title: 'Người tạo',
    value: 'DHN',
  },
  {
    title: 'Số phiên bản',
    value: '151',
  },
  {
    title: 'Số biên tập viên',
    value: '12',
  },
  {
    title: 'Liên kết đến',
    value: '643',
  },
  {
    title: 'Đổi hướng',
    value: '3',
  },
];

const chartData = [
  {
    date: '01-09',
    views: 215,
    edits: 15,
  },
  {
    date: '02-09',
    views: 224,
    edits: 11,
  },
  {
    date: '03-09',
    views: 251,
    edits: 9,
  },
  {
    date: '04-09',
    views: 270,
    edits: 1,
  },
  {
    date: '05-09',
    views: 269,
    edits: 6,
  },
  {
    date: '06-09',
    views: 277,
    edits: 9,
  },
  {
    date: '07-09',
    views: 307,
    edits: 0,
  },
  {
    date: '08-09',
    views: 257,
    edits: 2,
  },
  {
    date: '09-09',
    views: 324,
    edits: 5,
  },
  {
    date: '10-09',
    views: 258,
    edits: 7,
  },
  {
    date: '11-09',
    views: 415,
    edits: 5,
  },
  {
    date: '12-09',
    views: 546,
    edits: 2,
  },
  {
    date: '13-09',
    views: 372,
    edits: 14,
  },
  {
    date: '14-09',
    views: 348,
    edits: 2,
  },
  {
    date: '15-09',
    views: 433,
    edits: 0,
  },
  {
    date: '16-09',
    views: 552,
    edits: 0,
  },
  {
    date: '17-09',
    views: 451,
    edits: 4,
  },
  {
    date: '18-09',
    views: 445,
    edits: 5,
  },
  {
    date: '19-09',
    views: 453,
    edits: 15,
  },
  {
    date: '20-09',
    views: 433,
    edits: 6,
  },
  {
    date: '21-09',
    views: 419,
    edits: 14,
  },
  {
    date: '22-09',
    views: 540,
    edits: 9,
  },
  {
    date: '23-09',
    views: 558,
    edits: 14,
  },
  {
    date: '24-09',
    views: 490,
    edits: 12,
  },
  {
    date: '25-09',
    views: 806,
    edits: 13,
  },
  {
    date: '26-09',
    views: 797,
    edits: 15,
  },
  {
    date: '27-09',
    views: 625,
    edits: 12,
  },
  {
    date: '28-09',
    views: 546,
    edits: 9,
  },
  {
    date: '29-09',
    views: 625,
    edits: 15,
  },
  {
    date: '30-09',
    views: 576,
    edits: 10,
  },
];

interface PageTabProps {
  wikiId: string;
  pageTitle: string;
}

export function PageTab({ wikiId, pageTitle }: PageTabProps) {
  const { formatMessage } = useIntl();
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;
  const { data: revisions = [], isFetching } = useGetRevisions(wikiId, pageTitle, 30);
  const dates = new Set<string>();
  const preview = useSelector(appState.ui.preview);
  const largerThanMd = useLargerThan('md');

  return (
    <Stack p={5} gap={5} w="100%">
      <Box className={classes.box}>
        <Stack gap="xs">
          <Group gap="xs">
            <Badge ff="var(--zinnia-font-monospace)" h="1.625rem" radius="sm" tt="lowercase">
              {wikiId}
            </Badge>

            <Anchor
              fw={600}
              href={MwHelper.createPageUri(serverName, pageTitle)}
              target="_blank"
              w="fit-content"
              style={{ wordBreak: 'break-word' }}
            >
              {pageTitle}
            </Anchor>
          </Group>

          <Group gap={5} justify="space-between">
            <Group gap={5} visibleFrom="md">
              <Button
                leftSection={<IconHistory size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Lịch sử
              </Button>
              <Button
                leftSection={<IconList size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Nhật trình
              </Button>
              <Button
                leftSection={<IconStar size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Theo dõi
              </Button>
              <Button
                leftSection={<IconPencil size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Sửa đổi
              </Button>
              <Button
                leftSection={<IconBrackets size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Sửa mã nguồn
              </Button>
              <Button
                leftSection={<IconLanguage size="1rem" />}
                variant="subtle"
                size="compact-sm"
                className={classes.headerButton}
              >
                Ngôn ngữ
              </Button>
            </Group>

            <Group gap={5} hiddenFrom="md">
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconHistory size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconList size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconStar size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconPencil size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconBrackets size="1rem" />
              </ActionIcon>
              <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                <IconLanguage size="1rem" />
              </ActionIcon>
            </Group>

            <Menu shadow="md" width={225} position="bottom-end" offset={5}>
              <Menu.Target>
                {largerThanMd ? (
                  <Button
                    leftSection={<IconDots size="1rem" />}
                    variant="subtle"
                    size="compact-sm"
                    className={classes.headerButton}
                  >
                    Khác
                  </Button>
                ) : (
                  <ActionIcon variant="subtle" size={26} className={classes.headerButton}>
                    <IconDots size="1rem" />
                  </ActionIcon>
                )}
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item leftSection={<IconEraser style={{ width: rem(14), height: rem(14) }} />}>
                  Tẩy bộ nhớ đệm
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconArrowsMove style={{ width: rem(14), height: rem(14) }} />}
                >
                  Di chuyển
                </Menu.Item>
                <Menu.Item leftSection={<IconLock style={{ width: rem(14), height: rem(14) }} />}>
                  Khóa
                </Menu.Item>
                <Menu.Item leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}>
                  Xóa
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconArrowsShuffle style={{ width: rem(14), height: rem(14) }} />}
                >
                  Trộn
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item leftSection={<IconSlash style={{ width: rem(14), height: rem(14) }} />}>
                  Trang con
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconArrowDownRight style={{ width: rem(14), height: rem(14) }} />}
                >
                  Các liên kết đến đây
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconCirclesRelation style={{ width: rem(14), height: rem(14) }} />}
                >
                  Thay đổi liên quan
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconLetterD style={{ width: rem(14), height: rem(14) }} />}
                >
                  Khoản mục Wikidata
                </Menu.Item>

                <Menu.Divider />

                <Menu.Item leftSection={<IconLink style={{ width: rem(14), height: rem(14) }} />}>
                  Đếm liên kết
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconCopyright style={{ width: rem(14), height: rem(14) }} />}
                >
                  Kiểm tra bản quyền
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconPlusMinus style={{ width: rem(14), height: rem(14) }} />}
                >
                  WikiBlame
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Stack>
      </Box>

      <Flex gap={5} direction={{ base: 'column', xl: 'row' }}>
        <Box className={classes.box} flex={1}>
          <Stack gap="xs" h="100%">
            <Group gap="xs" justify="space-between">
              <Group gap="xs">
                <IconInfoCircle size="1rem" />
                <Text size="sm" fw={500}>
                  Thông tin trang
                </Text>
              </Group>

              <Group gap={5}>
                <ActionIcon variant="transparent" size="xs">
                  <IconBrandWikipedia size="1rem" />
                </ActionIcon>
                <ActionIcon variant="transparent" size="xs">
                  <IconLetterX size="1rem" />
                </ActionIcon>
                <ActionIcon variant="transparent" size="xs">
                  <IconSum size="1rem" />
                </ActionIcon>
              </Group>
            </Group>

            <SimpleGrid cols={{ base: 2, xs: 3 }} spacing={6} verticalSpacing={6} h="100%">
              {infoboxes.map((infobox, index) => (
                <Flex className={classes.infobox} key={index}>
                  <Text size="xs" c="dimmed">
                    {infobox.title}
                  </Text>
                  <Text
                    size="sm"
                    fw={500}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {infobox.value}
                  </Text>
                </Flex>
              ))}
            </SimpleGrid>
          </Stack>
        </Box>

        <Box className={classes.box} flex={1}>
          <Stack gap="xs">
            <Group gap="xs">
              <IconTimeline size="1rem" />
              <Text size="sm" fw={500}>
                Lượt xem
              </Text>
            </Group>

            <CompositeChart
              h={185}
              data={chartData}
              dataKey="date"
              maxBarWidth={30}
              withRightYAxis
              series={[
                { name: 'views', label: 'Số lượt xem', color: 'yellow.8', type: 'area' },
                {
                  name: 'edits',
                  label: 'Số sửa đổi',
                  color: 'rgba(18, 120, 255, 0.2)',
                  yAxisId: 'right',
                  type: 'bar',
                },
              ]}
              curveType="monotone"
              gridAxis="none"
            />
          </Stack>
        </Box>
      </Flex>

      <Box className={classes.box}>
        <Stack gap="xs">
          <Flex gap="xs" justify="space-between" direction={{ base: 'column', xs: 'row' }}>
            <Group gap="xs">
              <IconList size="1rem" />
              <Text size="sm" fw={500}>
                Nhật trình
              </Text>
            </Group>

            <Group gap="xs" wrap="nowrap">
              <ActionIcon
                variant="transparent"
                size="sm"
                title={formatMessage({ id: 'common.reload' })}
                aria-label={formatMessage({ id: 'common.reload' })}
                loading={isFetching}
              >
                <IconReload size="1rem" />
              </ActionIcon>
              <Select
                size="xs"
                allowDeselect={false}
                data={[
                  'Lịch sử',
                  'Di chuyển',
                  'Khóa',
                  'Xóa',
                  'Tuần tra',
                  'Trộn',
                  'Bộ lọc sai phạm',
                  'Chống spam',
                  'Chặn tiêu đề',
                  'Tên miền bị cấm',
                  'Đổi kiểu nội dung',
                ]}
                defaultValue="Lịch sử"
                comboboxProps={{ shadow: 'lg' }}
                maxDropdownHeight={186}
                w={{ base: '100%', xs: 175 }}
              />
            </Group>
          </Flex>

          {revisions.length > 0 && (
            <Stack gap={5}>
              {revisions.map((revision, index) => {
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

                    <Group gap={5} wrap="nowrap" align="stretch">
                      <Box className={classes.revision}>
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
                            className={classes.user}
                            size="xs"
                            href={MwHelper.createUserContribUri(serverName, revision.user)}
                            target="_blank"
                            fw={500}
                            data-hidden={revision.userHidden}
                          >
                            {revision.user}
                          </Anchor>
                        </Group>

                        <Group gap={5} wrap="nowrap" maw="100%">
                          <IconQuote size="0.85rem" color="var(--mantine-color-gray-light-color)" />
                          {revision.parsedComment.length > 0 ? (
                            <TypographyStylesProvider flex={1} miw={0}>
                              <Text
                                size="xs"
                                style={{
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                }}
                                title={sanitizeHtml(revision.parsedComment)}
                                dangerouslySetInnerHTML={{
                                  __html: MwHelper.correctParsedComment(
                                    serverName,
                                    revision.parsedComment
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
                      </Box>

                      <HoverCard
                        width={675}
                        shadow="lg"
                        radius="md"
                        position="left"
                        offset={25}
                        disabled={!preview || !largerThanMd || revision.parentId === 0}
                      >
                        <HoverCard.Target>
                          <UnstyledButton className={classes.diffButton} w={{ base: 40, xs: 60 }}>
                            <IconChevronRight
                              size="1.25rem"
                              stroke={1.5}
                              color="var(--mantine-color-gray-light-color)"
                            />
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
                    </Group>
                  </Fragment>
                );
              })}
            </Stack>
          )}
        </Stack>
      </Box>
    </Stack>
  );
}
