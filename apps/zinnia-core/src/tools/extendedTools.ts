import { ExtendedTool } from '@/tools/types/ZinniaTool';
import { DefaultExtendedToolComponent } from '@/tools/utils/DefaultExtendedToolComponent';
import { TabType } from '@/types/persistence/Tab';

export const extendedTools: ExtendedTool[] = [
  {
    metadata: {
      id: 'extended:link-report:viwiki:1',
      name: 'LinkReport',
      iconLabel: 'LR',
    },
    config: {
      restriction: {
        allowedWikis: ['viwiki'],
        allowedRights: [],
        allowedTabs: [],
      },
      source: {
        server: 'vi.wikipedia.org',
        page: 'User:NgocAnMaster/LinkReport.js',
      },
      sandboxTargetSelector: '#ca-linkreport',
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
        allowedWikis: ['viwiki'],
        allowedRights: [],
        allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
      },
      source: {
        server: 'meta.wikimedia.org',
        page: 'User:NhacNy2412/BlankedThePage.js',
      },
      sandboxTargetSelector: '#ca-btp',
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
        allowedWikis: [],
        allowedRights: [],
        allowedTabs: [],
      },
      source: {
        server: 'en.wikipedia.org',
        page: 'User:BrandonXLF/TodoList.js',
      },
      sandboxTargetSelector: '#userjs-todo > a',
    },
    component: DefaultExtendedToolComponent,
  },
];

export const extendedToolsDict = Object.fromEntries(
  extendedTools.map((tool) => [tool.metadata.id, tool])
);
