import React, { FunctionComponent } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { Icon } from '@tabler/icons-react';
import { ToolboxSettingsFormValues } from '@/components/ToolboxPanel/ToolboxSettings';
import { ToolIconColor } from '@/tools/types/ToolIconColor';
import { WikiId } from '@/types/mw/WikiId';
import { TabType } from '@/types/persistence/Tab';

export interface NativeTool {
  metadata: NativeToolMetadata;
  config: NativeToolConfig;
  component: FunctionComponent<NativeToolComponentProps>;
  additionalSettingsForm: FunctionComponent<NativeToolAdditionalSettingsFormProps>;
}

export interface NativeToolMetadata {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
  toolVersion: string;
  settingsVersion: number;
}

export interface NativeToolConfig {
  restriction: {
    allowedWikis: WikiId[]; // For l10n
    allowedRights: string[];
    allowedTabs: TabType[];
  };
  hotkey?: string;
}

export interface NativeToolComponentProps {
  metadata: NativeToolMetadata;
  config: NativeToolConfig;
  children: (payload: NativeToolComponentPayload) => React.ReactNode;
}

export interface NativeToolComponentPayload {
  trigger?: () => void;
  loading?: boolean;
  targetRef?: React.RefObject<HTMLButtonElement>;
  actions?: NativeToolAction[];
}

export interface NativeToolAction {
  metadata: NativeToolActionMetadata;
  config: NativeToolActionConfig;
  component: FunctionComponent<NativeToolActionComponentProps>;
}

export interface NativeToolActionMetadata {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
}

export interface NativeToolActionConfig {
  hotkey?: string;
}

export interface NativeToolActionComponentProps {
  metadata: NativeToolActionMetadata;
  config: NativeToolActionConfig;
  children: (payload: NativeToolActionComponentPayload) => React.ReactNode;
}

export interface NativeToolActionComponentPayload {
  trigger?: () => void;
  loading?: boolean;
  targetRef?: React.RefObject<HTMLButtonElement>;
}

export interface NativeToolAdditionalSettingsFormProps {
  parentForm: UseFormReturnType<ToolboxSettingsFormValues>;
  toolIndex: number;
  userAdditionalSettings: Record<string, unknown>;
}
