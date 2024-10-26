import { Icon } from '@tabler/icons-react';
import { WikiId } from '@/types/mw/WikiId';

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

export interface ZinniaNativeTool {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
  toolVersion: string;
  settingsVersion: number;
  actions: ZinniaNativeToolAction[];
  defaultAction: string;
}

interface ZinniaNativeToolAction {
  id: string;
  name: string;
  iconColor: ToolIconColor;
  iconShape: Icon;
}

export interface ZinniaExtendedTool {
  id: string;
  name: string;
  iconLabel: string;
  allowedWikis: WikiId[];
}
