import { ExtendedTool } from '@/tools/types/ZinniaTool';
import { DefaultExtendedToolComponent } from '@/tools/utils/DefaultExtendedToolComponent';

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
        page: 'User:Plantaest/LinkReport.js',
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
        allowedTabs: [],
      },
      source: {
        server: 'meta.wikimedia.org',
        page: 'User:NhacNy2412/BlankedThePage.js',
      },
      sandboxTargetSelector: '#ca-btp',
    },
    component: DefaultExtendedToolComponent,
  },
];

export const extendedToolsDict = Object.fromEntries(
  extendedTools.map((tool) => [tool.metadata.id, tool])
);
