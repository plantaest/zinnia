import { ExtendedTool } from '@/tools/types/ZinniaTool';

export const extendedTools: ExtendedTool[] = [
  {
    id: 'extended:twinkle:enwiki',
    name: 'Twinkle (en)',
    iconLabel: 'TW',
    allowedWikis: ['enwiki'],
  },
  {
    id: 'extended:twinkle:viwiki',
    name: 'Twinkle (vi)',
    iconLabel: 'TW',
    allowedWikis: ['viwiki'],
  },
  {
    id: 'extended:link-report:viwiki:705327',
    name: 'LinkReport',
    iconLabel: 'LR',
    allowedWikis: ['viwiki'],
  },
];

export const extendedToolsDict = Object.fromEntries(extendedTools.map((tool) => [tool.id, tool]));
