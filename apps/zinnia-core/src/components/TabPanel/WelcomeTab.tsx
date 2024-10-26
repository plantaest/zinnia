import { ActionIcon, Anchor, Box, SimpleGrid, Stack, Text } from '@mantine/core';
import { IconCode, IconHeart, IconHome, IconMessages } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { ZinniaLogo } from '@/components/TabPanel/ZinniaLogo';

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
    <Stack p="xs" gap="xs" flex={1} justify="space-between">
      <Stack gap="xl" align="center" mb="2.5rem">
        <Box mt="1rem" py="2rem">
          <ZinniaLogo width={160} />
        </Box>

        <SimpleGrid cols={{ base: 2, xs: 4 }} spacing="2.5rem" verticalSpacing="2.5rem">
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
        </SimpleGrid>
      </Stack>

      <Text mb="1.5rem" ta="center" c="dimmed" size="xs">
        <Anchor href="https://meta.wikimedia.org/wiki/User:Plantaest" target="_blank">
          Plantaest
        </Anchor>{' '}
        ×{' '}
        <Anchor href="https://meta.wikimedia.org/wiki/Viettech_Initiative" target="_blank">
          Viettech Initiative
        </Anchor>
      </Text>
    </Stack>
  );
}
