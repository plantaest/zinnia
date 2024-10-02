import { useSelector } from '@legendapp/state/react';
import { appState } from '@/states/appState';
import { useGetRecentChanges } from '@/queries/useGetRecentChanges';

export const useShowMainPanel = () => {
  const userConfig = useSelector(appState.userConfig);
  const initState = useSelector(appState.ui.initState);
  const { isSuccess: isSuccessGetRecentChanges } = useGetRecentChanges();

  if (!userConfig || !('id' in userConfig)) {
    return false;
  }

  const activeWorkspace =
    userConfig.workspaces.find((w) => w.id === userConfig.activeWorkspaceId) ?? null;

  if (!activeWorkspace) {
    return true;
  }

  const activeFilter =
    activeWorkspace.filters.find((f) => f.id === activeWorkspace.activeFilterId) ?? null;

  if (!activeFilter) {
    return true;
  }

  if (activeFilter && activeFilter.wikis.length <= 1) {
    return true;
  }

  return initState === 'normal' && isSuccessGetRecentChanges;
};
