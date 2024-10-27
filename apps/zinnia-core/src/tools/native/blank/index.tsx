import { IconEraser } from '@tabler/icons-react';
import { NativeTool, NativeToolActionComponentProps } from '@/tools/types/ZinniaTool';
import { DefaultNativeToolAdditionalSettingsFormComponent } from '@/tools/DefaultNativeToolAdditionalSettingsFormComponent';

const BlankAction = ({ children }: NativeToolActionComponentProps) =>
  children({
    trigger: () => {},
  });

export const BlankTool: NativeTool = {
  id: 'native:blank',
  name: 'tool.native.blank.name',
  iconColor: 'indigo',
  iconShape: IconEraser,
  toolVersion: '1.0.0-beta.1',
  settingsVersion: 1,
  defaultAction: 'blank',
  actions: [
    {
      id: 'blank',
      name: 'Blank',
      iconColor: 'indigo',
      iconShape: IconEraser,
      component: BlankAction,
      allowedTabs: [],
      hotkey: '',
    },
  ],
  additionalSettingsForm: DefaultNativeToolAdditionalSettingsFormComponent,
};
