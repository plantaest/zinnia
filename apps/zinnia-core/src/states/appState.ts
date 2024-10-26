import {
  computed,
  observable,
  ObservableComputed,
  ObservableComputedTwoWay,
  ObservableObject,
} from '@legendapp/state';
import { ApiQueryRecentChangesParams } from 'types-mediawiki/api_params';
import { Change } from '@plantaest/composite';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Workspace } from '@/types/persistence/Workspace';
import { Filter } from '@/types/persistence/Filter';
import { FeedHelper } from '@/utils/FeedHelper';
import { WikiId } from '@/types/mw/WikiId';
import { startRef } from '@/refs/startRef';
import { isEqual } from '@/utils/isEqual';
import { Tab } from '@/types/persistence/Tab';

interface AppState {
  userConfig: UserConfig | null;
  ui: {
    initState: 'empty' | 'start' | 'normal';
    activeWorkspace: ObservableComputedTwoWay<Workspace | null>;
    activeFilter: ObservableComputed<Filter | null>;
    rcQueryParams: Record<WikiId, ApiQueryRecentChangesParams>;
    focus: boolean;
    activeTab: ObservableComputed<Tab | null>;
    selectedChange: Change | null;
    showTabPanelDrawer: boolean;
    preview: boolean;
  };
  instance: {
    numberFormat: ObservableComputed<Intl.NumberFormat>;
  };
  window: {
    height: number;
  };
  local: {
    tabs: Record<string, { tabs: Tab[]; activeTabId: string | null }>; // Key is workspace ID
    activeTabs: ObservableComputedTwoWay<Tab[]>;
    activeTabId: ObservableComputedTwoWay<string | null>;
    activeTab: ObservableComputedTwoWay<Tab | null>;
  };
}

export const appState: ObservableObject<AppState> = observable<AppState>({
  userConfig: null,
  ui: {
    initState: 'empty',
    activeWorkspace: computed(
      () =>
        (appState.userConfig.workspaces.get() ?? []).find(
          (w) => w.id === appState.userConfig.activeWorkspaceId.get()
        ) ?? null,
      (workspace: Workspace) =>
        appState.userConfig.workspaces.set(
          (appState.userConfig.workspaces.get() ?? []).map((w) =>
            w.id === appState.userConfig.activeWorkspaceId.get() ? workspace : w
          )
        )
    ),
    activeFilter: computed(
      () =>
        (appState.ui.activeWorkspace.filters.get() ?? []).find(
          (f) => f.id === appState.ui.activeWorkspace.activeFilterId.get()
        ) ?? null
    ),
    rcQueryParams: {},
    focus: false,
    activeTab: computed(
      () =>
        (appState.ui.activeWorkspace.tabs.get() ?? []).find(
          (t) => t.id === appState.ui.activeWorkspace.activeTabId.get()
        ) ?? null
    ),
    selectedChange: null,
    showTabPanelDrawer: false,
    preview: false,
  },
  instance: {
    numberFormat: computed(() => new Intl.NumberFormat(appState.userConfig.locale.get())),
  },
  window: {
    height: window.innerHeight,
  },
  local: {
    tabs: {},
    activeTabs: computed(
      () => {
        const activeWorkspace = appState.ui.activeWorkspace.get();

        if (activeWorkspace) {
          return appState.local.tabs[activeWorkspace.id].tabs.get() ?? [];
        }

        return [];
      },
      (activeTabs) => {
        const activeWorkspace = appState.ui.activeWorkspace.get();

        if (activeWorkspace) {
          appState.local.tabs[activeWorkspace.id].tabs.set(activeTabs);
        }
      }
    ),
    activeTabId: computed(
      () => {
        const activeWorkspace = appState.ui.activeWorkspace.get();

        if (activeWorkspace) {
          return appState.local.tabs[activeWorkspace.id].activeTabId.get() ?? null;
        }

        return null;
      },
      (activeTabId: string | null) => {
        const activeWorkspace = appState.ui.activeWorkspace.get();

        if (activeWorkspace) {
          appState.local.tabs[activeWorkspace.id].activeTabId.set(activeTabId);
        }
      }
    ),
    activeTab: computed(
      () =>
        (appState.local.activeTabs.get() ?? []).find(
          (t) => t.id === appState.local.activeTabId.get()
        ) ?? null,
      (tab: Tab) => {
        appState.local.activeTabs.set(
          (appState.local.activeTabs.get() ?? []).map((t) =>
            t.id === appState.local.activeTabId.get() ? tab : t
          )
        );
      }
    ),
  },
});

// Track focus changes
appState.ui.focus.onChange((change) => {
  const body = document.body;
  if (change.value) {
    startRef.current?.scrollIntoView({ behavior: 'instant' });
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
});

// Track window.height changes
window.addEventListener('resize', () => {
  appState.window.height.set(window.innerHeight);
});

appState.window.height.onChange(() => {
  if (appState.ui.focus.get()) {
    startRef.current?.scrollIntoView({ behavior: 'instant' });
  }
});

// Track activeFilter changes
appState.ui.activeFilter.onChange((change) => {
  if (!isEqual(change.getPrevious(), change.value)) {
    const activeFilter = change.value;

    const rcQueryParams =
      activeFilter && activeFilter.wikis.length > 1
        ? Object.fromEntries(
            activeFilter.wikis
              .filter((wiki) => wiki.wikiId !== 'global')
              .map((wiki, index) => [
                wiki.wikiId,
                FeedHelper.parseRcQueryParams(activeFilter, index + 1),
              ])
          )
        : {};

    appState.ui.rcQueryParams.set(rcQueryParams);
  }
});
