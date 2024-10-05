import { useEffect } from 'react';
import { useComputedColorScheme } from '@mantine/core';

export function useSyncColorScheme() {
  const computedColorScheme = useComputedColorScheme();

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-mantine-color-scheme', computedColorScheme);
    return () => html.removeAttribute('data-mantine-color-scheme');
  }, [computedColorScheme]);
}
