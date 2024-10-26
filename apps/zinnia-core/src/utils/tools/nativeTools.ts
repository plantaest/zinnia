import {
  IconArrowBackUp,
  IconArrowBackUpDouble,
  IconCheck,
  IconEraser,
  IconRestore,
} from '@tabler/icons-react';
import { ZinniaNativeTool } from '@/types/ui/ZinniaTool';

export const nativeTools: ZinniaNativeTool[] = [
  {
    id: 'native:mark',
    name: 'tool.mark.name',
    iconColor: 'lime',
    iconShape: IconCheck,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
    actions: [
      {
        id: 'mark',
        name: 'Mark',
        iconColor: 'lime',
        iconShape: IconCheck,
      },
    ],
    defaultAction: 'mark',
  },
  {
    id: 'native:rollback',
    name: 'tool.rollback.name',
    iconColor: 'cyan',
    iconShape: IconArrowBackUp,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
    actions: [
      {
        id: 'agf-rollback',
        name: 'AGF rollback',
        iconColor: 'teal',
        iconShape: IconArrowBackUp,
      },
      {
        id: 'normal-rollback',
        name: 'Normal rollback',
        iconColor: 'cyan',
        iconShape: IconArrowBackUp,
      },
      {
        id: 'vandalism-rollback',
        name: 'Vandalism rollback',
        iconColor: 'pink',
        iconShape: IconArrowBackUpDouble,
      },
    ],
    defaultAction: 'normal-rollback',
  },
  {
    id: 'native:restore',
    name: 'tool.restore.name',
    iconColor: 'violet',
    iconShape: IconRestore,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
    actions: [
      {
        id: 'restore',
        name: 'Restore',
        iconColor: 'violet',
        iconShape: IconRestore,
      },
    ],
    defaultAction: 'restore',
  },
  {
    id: 'native:blank',
    name: 'tool.blank.name',
    iconColor: 'indigo',
    iconShape: IconEraser,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
    actions: [
      {
        id: 'blank',
        name: 'Blank',
        iconColor: 'indigo',
        iconShape: IconEraser,
      },
    ],
    defaultAction: 'blank',
  },
];

export const nativeToolsDict = Object.fromEntries(nativeTools.map((tool) => [tool.id, tool]));
