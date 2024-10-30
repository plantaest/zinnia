import { Icon } from '@tabler/icons-react';
import React, { FunctionComponent } from 'react';
import { UseFormReturnType } from '@mantine/form';
import { WikiId } from '@/types/mw/WikiId';
import { TabType } from '@/types/persistence/Tab';
import { ToolboxSettingsFormValues } from '@/components/ToolboxPanel/ToolboxSettings';

export const toolIconColors = [
  'red',
  'pink',
  'grape',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
] as const;

export type ToolIconColor = (typeof toolIconColors)[number];

// Native tool

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
    allowedWikis: WikiId[];
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
  data: Record<string, unknown>;
}

// Extended tool

export interface ExtendedTool {
  metadata: ExtendedToolMetadata;
  config: ExtendToolConfig;
  component: FunctionComponent<ExtendedToolComponentProps>;
}

export interface ExtendedToolMetadata {
  id: string;
  name: string;
  iconLabel: string;
}

export interface ExtendToolConfig {
  restriction: {
    allowedWikis: WikiId[];
    allowedRights: string[];
    allowedTabs: TabType[];
  };
  source: {
    server: string;
    page: string;
  };
  sandboxTargetSelector?: string;
  styles?: string;
}

export interface ExtendedToolComponentProps {
  metadata: ExtendedToolMetadata;
  config: ExtendToolConfig;
  children: (payload: ExtendedToolComponentPayload) => React.ReactNode;
}

export interface ExtendedToolComponentPayload {
  trigger?: () => void;
  loading?: boolean;
  targetRef?: React.RefObject<HTMLButtonElement>;
}
