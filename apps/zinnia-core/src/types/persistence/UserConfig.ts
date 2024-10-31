import { Workspace } from '@/types/persistence/Workspace';
import { Instant } from '@/types/lang/Instant';
import { UserExtendedTool, UserNativeTool } from '@/types/persistence/Tool';

export interface UserConfig {
  id: string;
  createdAt: Instant;
  updatedAt: Instant;
  appVersion: string;
  schemaVersion: string;
  colorScheme: 'light' | 'dark' | 'auto';
  language: string;
  locale: string;
  dir: 'ltr' | 'rtl';
  advancedMode: boolean;
  workspaces: Workspace[];
  activeWorkspaceId: string | null;
  tools: {
    native: UserNativeTool[];
    extended: UserExtendedTool[];
  };
}
