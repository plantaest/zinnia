import {
  ActionIcon,
  Group,
  Paper,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconHeart, IconHome, IconMessages } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';
import classes from './HeaderPanel.module.css';

const headerLinks = [
  {
    link: 'https://en.wikipedia.org/wiki/User:Plantaest/Zinnia',
    icon: IconHome,
    name: 'core:ui.headerPanel.home',
  },
  {
    link: 'https://en.wikipedia.org/wiki/User_talk:Plantaest/Zinnia',
    icon: IconMessages,
    name: 'core:ui.headerPanel.talk',
  },
  {
    link: 'https://en.wikipedia.org/wiki/User:Plantaest/Zinnia/Support',
    icon: IconHeart,
    name: 'core:ui.headerPanel.support',
  },
];

function _HeaderPanel() {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const computedColorScheme = useComputedColorScheme();

  return (
    <Paper px="md" py="xs" withBorder shadow="sm" className={classes.wrapper}>
      <Group justify="space-between" gap="xs">
        <Text c="violet.5" fw={600} fz="2rem" ff={theme.other.altFontFamily}>
          Zinnia
        </Text>
        <Group gap="xs">
          {headerLinks.map((headerLink) => (
            <ActionIcon
              key={headerLink.name}
              variant="subtle"
              size={38}
              color={computedColorScheme === 'dark' ? 'gray' : 'dark'}
              component="a"
              href={headerLink.link}
              target="_blank"
              title={t(headerLink.name)}
              aria-label={t(headerLink.name)}
            >
              <headerLink.icon size="1.5rem" />
            </ActionIcon>
          ))}
        </Group>
      </Group>
    </Paper>
  );
}

export const HeaderPanel = memo(_HeaderPanel);
