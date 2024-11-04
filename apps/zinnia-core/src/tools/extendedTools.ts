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
      restriction: {},
      source: {
        server: 'vi.wikipedia.org',
        page: 'User:NgocAnMaster/LinkReport.js',
      },
      sandbox: {
        initialWiki: 'viwiki',
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
        allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
      },
      source: {
        server: 'meta.wikimedia.org',
        page: 'User:NhacNy2412/BlankedThePage.js',
      },
      sandbox: {
        initialWiki: CURRENT_WIKI,
        targetSelector: '#ca-btp',
        syncedWikiContext: true,
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
      restriction: {},
      source: {
        server: 'en.wikipedia.org',
        page: 'User:BrandonXLF/TodoList.js',
      },
      sandbox: {
        initialWiki: CURRENT_WIKI,
        targetSelector: '#userjs-todo > a',
        styles: '#userjs-todo-popup { top: 0 !important; }',
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:afd-closer:viwiki:1',
      name: 'AfDCloser',
      iconLabel: 'ADC',
    },
    config: {
      restriction: {
        allowedSites: ['viwiki'], // This script uses wgUserGroups, mw.Title
        allowedWikis: ['viwiki'],
        allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
        allowedPages: (pageContext) =>
          pageContext.pageTitle.startsWith('Wikipedia:Biểu quyết xoá bài/'),
      },
      source: {
        server: 'vi.wikipedia.org',
        page: 'User:NguoiDungKhongDinhDanh/AfDCloser.js',
      },
      sandbox: {
        initialWiki: 'viwiki',
        targetSelector: '#ca-afdcloser',
        cleanupFunction: ({ sandboxRoot }) => {
          const target = sandboxRoot.querySelector('#ca-afdcloser');
          target && target.remove();
        },
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:page-curation:enwiki:1',
      name: 'PageCuration',
      iconLabel: 'PC',
    },
    config: {
      restriction: {},
      source: {
        server: 'en.wikipedia.org',
        page: 'User:Lourdes/PageCuration.js',
      },
      sandbox: {
        initialWiki: CURRENT_WIKI,
        targetSelector: '#pt-pagecuration > a',
        openInNewTab: true,
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:null-edit:enwiki:1',
      name: 'NullEdit',
      iconLabel: 'NE',
    },
    config: {
      restriction: {
        allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
      },
      source: {
        server: 'en.wikipedia.org',
        page: 'User:BrandonXLF/NullEdit.js',
      },
      sandbox: {
        initialWiki: CURRENT_WIKI,
        targetSelector: '[id="Null edit"]',
        syncedWikiContext: true,
        cleanupFunction: ({ sandboxRoot }) => {
          const target = sandboxRoot.querySelector('[id="Null edit"]');
          target && target.remove();
        },
      },
    },
    component: DefaultExtendedToolComponent,
  },
  {
    metadata: {
      id: 'extended:global-prefs:enwiki:1',
      name: 'GlobalPrefs',
      iconLabel: 'GP',
    },
    config: {
      restriction: {},
      source: {
        server: 'en.wikipedia.org',
        page: 'User:BrandonXLF/GlobalPrefs.js',
      },
      sandbox: {
        initialWiki: CURRENT_WIKI,
        targetSelector: '#globalpreferences > a',
        openInNewTab: true,
      },
    },
    component: DefaultExtendedToolComponent,
  },
];

export const extendedToolsDict = Object.fromEntries(
  extendedTools.map((tool) => [tool.metadata.id, tool])
);
