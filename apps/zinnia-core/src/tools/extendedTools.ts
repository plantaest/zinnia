import { DefaultExtendedToolComponent } from '@/tools/utils/DefaultExtendedToolComponent';
import { TabType } from '@/types/persistence/Tab';
import { CURRENT_WIKI, ExtendedTool } from '@/tools/types/ExtendedTool';

export const extendedTools: ExtendedTool[] = [
  {
    metadata: {
      id: 'extended:link-report:viwiki:1',
      name: 'LinkReport',
      iconLabel: 'LR',
    },
    config: {
      restriction: {
        allowedSites: [],
        allowedWikis: [],
        allowedRights: [],
        allowedTabs: [],
      },
      source: {
        server: 'vi.wikipedia.org',
        page: 'User:NgocAnMaster/LinkReport.js',
      },
      sandbox: {
        initialServer: 'vi.wikipedia.org',
        syncedWikiContext: false,
        targetSelector: '#ca-linkreport',
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:blanked-the-page:metawiki:1',
      name: 'BlankedThePage',
      iconLabel: 'BTP',
    },
    config: {
      restriction: {
        allowedSites: [],
        allowedWikis: [],
        allowedRights: [],
        allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
      },
      source: {
        server: 'meta.wikimedia.org',
        page: 'User:NhacNy2412/BlankedThePage.js',
      },
      sandbox: {
        initialServer: CURRENT_WIKI,
        syncedWikiContext: true,
        targetSelector: '#ca-btp',
        cleanupFunction: ({ sandboxRoot }) => {
          const target = sandboxRoot.querySelector('#ca-btp');
          target && target.remove();
        },
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:todo-list:enwiki:1',
      name: 'TodoList',
      iconLabel: 'TL',
    },
    config: {
      restriction: {
        allowedSites: [],
        allowedWikis: [],
        allowedRights: [],
        allowedTabs: [],
      },
      source: {
        server: 'en.wikipedia.org',
        page: 'User:BrandonXLF/TodoList.js',
      },
      sandbox: {
        initialServer: CURRENT_WIKI,
        syncedWikiContext: false,
        targetSelector: '#userjs-todo > a',
        styles: '#userjs-todo-popup { top: 0 !important; }',
      },
    },
    component: DefaultExtendedToolComponent,
  },
];

export const extendedToolsDict = Object.fromEntries(
  extendedTools.map((tool) => [tool.metadata.id, tool])
);
