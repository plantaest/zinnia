import { ActionIcon, Button, Group, useDirection, useMantineColorScheme } from '@mantine/core';
import { IconTextDirectionLtr, IconTextDirectionRtl } from '@tabler/icons-react';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const { toggleDirection, dir } = useDirection();

  return (
    <Group gap="xs">
      <Button onClick={() => setColorScheme('light')}>Light</Button>
      <Button onClick={() => setColorScheme('dark')}>Dark</Button>
      <Button onClick={() => setColorScheme('auto')}>Auto</Button>
      <ActionIcon onClick={() => toggleDirection()} variant="default" radius="md" size="lg">
        {dir === 'rtl' ? (
          <IconTextDirectionLtr stroke={1.5} />
        ) : (
          <IconTextDirectionRtl stroke={1.5} />
        )}
      </ActionIcon>
    </Group>
  );
}
