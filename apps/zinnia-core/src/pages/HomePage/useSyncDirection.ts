import { useEffect } from 'react';
import { useDirection } from '@mantine/core';
import { useSelector } from '@legendapp/state/react';
import { zinniaRoot } from '@/utils/zinniaRoot';
import { appState } from '@/states/appState';

export function useSyncDirection() {
  const { dir, setDirection } = useDirection();
  const userConfigDirection = useSelector(appState.userConfig.dir);

  useEffect(() => {
    zinniaRoot.setAttribute('dir', dir);
  }, [dir]);

  useEffect(() => {
    if (userConfigDirection) {
      setDirection(userConfigDirection);
    }
  }, [userConfigDirection]);
}
