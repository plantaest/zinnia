import { IconRestore } from '@tabler/icons-react';
import { DefaultNativeToolAdditionalSettingsForm } from '@/tools/utils/DefaultNativeToolAdditionalSettingsForm';
import { DefaultNativeToolComponent } from '@/tools/utils/DefaultNativeToolComponent';
import { NativeTool } from '@/tools/types/NativeTool';

export const restoreTool: NativeTool = {
  metadata: {
    id: 'native:restore',
    name: 'tool.native.restore.name',
    iconColor: 'violet',
    iconShape: IconRestore,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
  },
  config: {
    restriction: {
      allowedWikis: [],
      allowedRights: [],
      allowedTabs: [],
    },
  },
  component: DefaultNativeToolComponent,
  additionalSettingsForm: DefaultNativeToolAdditionalSettingsForm,
};
