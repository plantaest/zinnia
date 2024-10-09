import { MantineSize, useMantineTheme } from '@mantine/core';

export function useLargerThanFunction(breakpoint: MantineSize) {
  const theme = useMantineTheme();
  return () => window.matchMedia(`(min-width: ${theme.breakpoints[breakpoint]})`).matches;
}
