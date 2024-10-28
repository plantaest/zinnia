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

export interface NativeTool {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
  toolVersion: string;
  settingsVersion: number;
  defaultAction: string;
  actions: NativeToolAction[];
  additionalSettingsForm: FunctionComponent<NativeToolAdditionalSettingsFormComponentProps>;
}

export interface NativeToolAction {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
  component: FunctionComponent<NativeToolActionComponentProps>;
  allowedTabs: TabType[];
  hotkey: string;
}

export interface NativeToolActionComponentProps {
  children: (payload: NativeToolActionComponentPayload) => React.ReactNode;
}

export interface NativeToolActionComponentPayload {
  trigger: () => void;
  targetRef?: React.RefObject<HTMLButtonElement>;
}

export interface NativeToolAdditionalSettingsFormComponentProps {
  parentForm: UseFormReturnType<ToolboxSettingsFormValues>;
  toolIndex: number;
  data: Record<string, unknown>;
}

export interface ExtendedTool {
  id: string;
  name: string;
  iconLabel: string;
  allowedWikis: WikiId[];
}
