import { IconRestore } from '@tabler/icons-react';
import { NativeTool, NativeToolActionComponentProps } from '@/tools/types/ZinniaTool';
import { DefaultNativeToolAdditionalSettingsFormComponent } from '@/tools/DefaultNativeToolAdditionalSettingsFormComponent';

const RestoreAction = ({ children }: NativeToolActionComponentProps) =>
  children({
    trigger: () => {},
  });

export const RestoreTool: NativeTool = {
  id: 'native:restore',
  name: 'tool.native.restore.name',
  iconColor: 'violet',
  iconShape: IconRestore,
  toolVersion: '1.0.0-beta.1',
  settingsVersion: 1,
  defaultAction: 'restore',
  actions: [
    {
      id: 'restore',
      name: 'Restore',
      iconColor: 'violet',
      iconShape: IconRestore,
      component: RestoreAction,
      allowedTabs: [],
      hotkey: '',
    },
  ],
  additionalSettingsForm: DefaultNativeToolAdditionalSettingsFormComponent,
};
