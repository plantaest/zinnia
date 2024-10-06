import { ActionIcon, Anchor, Group, Stack, Text } from '@mantine/core';
import { IconCode, IconHeart, IconHome, IconMessages } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import dayjs from 'dayjs';

const links = [
  {
    link: 'https://en.wikipedia.org/wiki/User:Plantaest/Zinnia',
    icon: IconHome,
    name: 'ui.welcomeTab.home',
  },
  {
    link: 'https://en.wikipedia.org/wiki/User_talk:Plantaest/Zinnia',
    icon: IconMessages,
    name: 'ui.welcomeTab.talk',
  },
  {
    link: 'https://github.com/plantaest/zinnia',
    icon: IconCode,
    name: 'ui.welcomeTab.code',
  },
  {
    link: 'https://en.wikipedia.org/wiki/User:Plantaest/Zinnia/Support',
    icon: IconHeart,
    name: 'ui.welcomeTab.support',
  },
];

export function WelcomeTab() {
  const { formatMessage } = useIntl();

  return (
    <Stack p="xs" gap="xs" h="100%" justify="space-between">
      <Stack gap="xs" align="center" mb="2rem" style={{ zIndex: 1 }}>
        <Text mt="1.25rem" c="blue.5" fw={600} fz="3rem" ta="center" ff="var(--zinnia-font-family)">
          Zinnia
        </Text>
        <Text mb="2rem" fw={600} fz="1.25rem" ta="center" ff="var(--zinnia-font-family)">
          {formatMessage({ id: 'ui.welcomeTab.slogan' })}
        </Text>

        <Group gap="2.5rem">
          {links.map((link) => (
            <Stack key={link.name} align="center" gap="xs">
              <ActionIcon
                size="xl"
                variant="subtle"
                aria-label={formatMessage({ id: link.name })}
                color="blue"
                component="a"
                href={link.link}
                target="_blank"
              >
                <link.icon style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
              <Text ta="center" fw={500}>
                {formatMessage({ id: link.name })}
              </Text>
            </Stack>
          ))}
        </Group>
      </Stack>

      <Text mb="1.5rem" ta="center" c="dimmed" style={{ zIndex: 1 }}>
        <Anchor href="https://meta.wikimedia.org/wiki/User:Plantaest" target="_blank">
          Plantaest
        </Anchor>{' '}
        @ {dayjs().year()}
      </Text>
    </Stack>
  );
}
