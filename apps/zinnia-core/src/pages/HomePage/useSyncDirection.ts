import { useEffect } from 'react';
import { useDirection } from '@mantine/core';
import { zinniaRoot } from '@/utils/zinniaRoot';
import { appState } from '@/states/appState';

export function useSyncDirection() {
  const { dir, setDirection } = useDirection();
  const userConfigDirection = appState.userConfig.dir.get();

  useEffect(() => {
    zinniaRoot.setAttribute('dir', dir);
  }, [dir]);

  useEffect(() => {
    if (userConfigDirection) {
      setDirection(userConfigDirection);
    }
  }, [userConfigDirection]);
}
