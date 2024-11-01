import {
  computed,
  observable,
  ObservableComputed,
  ObservableComputedTwoWay,
  ObservableObject,
} from '@legendapp/state';
import { ApiQueryRecentChangesParams } from 'types-mediawiki/api_params';
import { Change, WikiHelper } from '@plantaest/composite';
import { UserConfig } from '@/types/persistence/UserConfig';
import { Workspace } from '@/types/persistence/Workspace';
import { Filter } from '@/types/persistence/Filter';
import { FeedHelper } from '@/utils/FeedHelper';
import { WikiId } from '@/types/mw/WikiId';
import { startRef } from '@/refs/startRef';
import { isEqual } from '@/utils/isEqual';
import { Tab } from '@/types/persistence/Tab';
import { underscoreTitle } from '@/utils/underscoreTitle';
import { zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';
import { defaultPageContext, PageContext } from '@/tools/types/PageContext';
import { createModifiedMw } from '@/tools/sandbox/createModifiedMw';
import { wikis } from '@/utils/wikis';
import { extendedToolsDict } from '@/tools/extendedTools';
import { SYNCED_WIKI_CONTEXT } from '@/tools/types/ExtendedTool';
import { zinniaSandboxRoot } from '@/tools/sandbox/zinniaSandboxRoot';

interface AppState {
  userConfig: UserConfig | null;
  ui: {
    initState: 'empty' | 'start' | 'normal';
    activeWorkspace: ObservableComputedTwoWay<Workspace | null>;
    activeFilter: ObservableComputed<Filter | null>;
    rcQueryParams: Record<WikiId, ApiQueryRecentChangesParams>;
    focus: boolean;
    selectedChange: Change | null;
    showTabPanelDrawer: boolean;
    preview: boolean;
    activeTabs: ObservableComputedTwoWay<Tab[]>;
    activeTabId: ObservableComputedTwoWay<string | null>;
    activeTab: ObservableComputedTwoWay<Tab | null>;
    extendedToolExecuteFunctions: Map<string, Function>;
    pageContext: PageContext;
  };
  instance: {
    numberFormat: ObservableComputed<Intl.NumberFormat>;
    listFormat: ObservableComputed<Intl.ListFormat>;
  };
  window: {
    height: number;
  };
  local: {
    tabs: Record<string, { tabs: Tab[]; activeTabId: string | null }>; // Key is workspace ID
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
    selectedChange: null,
    showTabPanelDrawer: false,
    preview: false,
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
        (appState.ui.activeTabs.get() ?? []).find((t) => t.id === appState.ui.activeTabId.get()) ??
        null,
      (tab: Tab) => {
        appState.ui.activeTabs.set(
          (appState.ui.activeTabs.get() ?? []).map((t) =>
            t.id === appState.ui.activeTabId.get() ? tab : t
          )
        );
      }
    ),
    extendedToolExecuteFunctions: new Map(),
    pageContext: defaultPageContext,
  },
  instance: {
    numberFormat: computed(() => new Intl.NumberFormat(appState.userConfig.locale.get())),
    listFormat: computed(() => new Intl.ListFormat(appState.userConfig.language.get())),
  },
  window: {
    height: window.innerHeight,
  },
  local: {
    tabs: {},
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

// Track pageContext changes
appState.ui.pageContext.onChange((change) => {
  if (change.getPrevious().wikiId !== change.value.wikiId) {
    zinniaSandbox.mw = createModifiedMw({
      serverName: WikiHelper.createActionApiUri(
        wikis.getWiki(change.value.wikiId).getConfig().serverName
      ),
    });

    const executeFunctions = appState.ui.extendedToolExecuteFunctions.peek();

    for (const [toolId, executeFunction] of executeFunctions) {
      const tool = extendedToolsDict[toolId];

      if (tool.config.restriction.allowedWikis === SYNCED_WIKI_CONTEXT) {
        tool.config.cleanupFunction &&
          tool.config.cleanupFunction({ sandboxRoot: zinniaSandboxRoot });
        executeFunction();
      }
    }
  }

  zinniaSandbox.mw.config.set('wgPageName', underscoreTitle(change.value.pageTitle));
});
