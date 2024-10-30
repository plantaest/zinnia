import { Instant } from '@/types/lang/Instant';
import { ToolIconColor } from '@/tools/types/ZinniaTool';
import { nativeToolsDict } from '@/tools/nativeTools';

export interface UserNativeTool {
  toolId: string;
  createdAt: Instant;
  updatedAt: Instant;
  settings: {
    general: {
      dock: boolean;
    };
    additional: {
      version: number;
      data: Record<string, any>;
    };
  };
}

export interface UserExtendedTool {
  toolId: string;
  createdAt: Instant;
  updatedAt: Instant;
  settings: {
    general: {
      dock: boolean;
      iconColor: ToolIconColor;
    };
  };
}

export const defaultUserNativeTools: (now: Instant) => UserNativeTool[] = (now) => [
  {
    toolId: 'native:mark',
    createdAt: now,
    updatedAt: now,
    settings: {
      general: {
        dock: true,
      },
      additional: {
        version: nativeToolsDict['native:mark'].metadata.settingsVersion,
        data: {},
      },
    },
  },
  {
    toolId: 'native:rollback',
    createdAt: now,
    updatedAt: now,
    settings: {
      general: {
        dock: true,
      },
      additional: {
        version: nativeToolsDict['native:rollback'].metadata.settingsVersion,
        data: {},
      },
    },
  },
  {
    toolId: 'native:restore',
    createdAt: now,
    updatedAt: now,
    settings: {
      general: {
        dock: true,
      },
      additional: {
        version: nativeToolsDict['native:restore'].metadata.settingsVersion,
        data: {},
      },
    },
  },
];
