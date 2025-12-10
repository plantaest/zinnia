import { createTheme, MantineThemeOverride } from '@mantine/core';
import { zinniaRoot } from '@/utils/zinniaRoot';

export const theme: MantineThemeOverride = createTheme({
  focusRing: 'always',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5c5f66',
      '#373A40',
      '#2C2E33',
      '#25262b',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
  components: {
    Portal: {
      defaultProps: {
        target: zinniaRoot,
      },
    },
    Popover: {
      defaultProps: {
        hideDetached: false,
      },
    },
  },
  other: {
    altFontMonospace: 'var(--zinnia-font-monospace)',
  },
});
