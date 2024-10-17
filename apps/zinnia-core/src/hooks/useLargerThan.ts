import { MantineSize, useMantineTheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export function useLargerThan(breakpoint: MantineSize) {
  const theme = useMantineTheme();
  return useMediaQuery(`(min-width: ${theme.breakpoints[breakpoint]})`, false);
}
