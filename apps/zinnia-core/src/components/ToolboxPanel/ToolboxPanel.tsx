import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import {
  ActionIcon,
  Box,
  Popover,
  Stack,
  useComputedColorScheme,
  useDirection,
} from '@mantine/core';
import { IconGridDots } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { ToolboxMain } from '@/components/ToolboxPanel/ToolboxMain';
import { ToolboxNativeToolList } from '@/components/ToolboxPanel/ToolboxNativeToolList';
import { ToolboxExtendedToolList } from '@/components/ToolboxPanel/ToolboxExtendedToolList';
import { ToolboxSettings } from '@/components/ToolboxPanel/ToolboxSettings';
import { useLargerThan } from '@/hooks/useLargerThan';
import { CloseModalButton } from '@/components/CloseModalButton/CloseModalButton';

export type ToolboxLayer = 'main' | 'nativeToolList' | 'extendedToolList' | 'settings';

function ToolboxPanelContent() {
  const [layer, setLayer] = useState<ToolboxLayer>('main');

  const layers: Record<ToolboxLayer, React.ReactNode> = {
    main: <ToolboxMain onChangeLayer={setLayer} />,
    nativeToolList: <ToolboxNativeToolList onChangeLayer={setLayer} />,
    extendedToolList: <ToolboxExtendedToolList onChangeLayer={setLayer} />,
    settings: <ToolboxSettings onChangeLayer={setLayer} />,
  };

  return layers[layer];
}

export function ToolboxPanel() {
  const { formatMessage } = useIntl();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');

  const handleClickToolboxButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: (
        <Stack gap="xs">
          <CloseModalButton />
          <ToolboxPanelContent />
        </Stack>
      ),
    });

  return largerThanMd ? (
    <Popover
      width={525}
      position="top-end"
      shadow="lg"
      radius="md"
      transitionProps={{ transition: dir === 'rtl' ? 'pop-bottom-left' : 'pop-bottom-right' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          title={formatMessage({ id: 'ui.toolboxPanel.title' })}
          aria-label={formatMessage({ id: 'ui.toolboxPanel.title' })}
        >
          <IconGridDots size="1.5rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        py={0}
        px={0}
        style={{
          backgroundColor:
            computedColorScheme === 'dark'
              ? 'var(--mantine-color-dark-7)'
              : 'var(--mantine-color-white)',
          overflow: 'hidden',
        }}
      >
        <Box h={400} px="sm" py="xs" style={{ overflowY: 'auto', overscrollBehavior: 'contain' }}>
          <ToolboxPanelContent />
        </Box>
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      variant="subtle"
      size="lg"
      title={formatMessage({ id: 'ui.toolboxPanel.title' })}
      aria-label={formatMessage({ id: 'ui.toolboxPanel.title' })}
      onClick={handleClickToolboxButton}
    >
      <IconGridDots size="1.5rem" />
    </ActionIcon>
  );
}
