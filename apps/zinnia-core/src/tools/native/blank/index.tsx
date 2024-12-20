import { IconEraser } from '@tabler/icons-react';
import { DefaultNativeToolAdditionalSettingsForm } from '@/tools/utils/DefaultNativeToolAdditionalSettingsForm';
import { DefaultNativeToolComponent } from '@/tools/utils/DefaultNativeToolComponent';
import { NativeTool } from '@/tools/types/NativeTool';

export const blankTool: NativeTool = {
  metadata: {
    id: 'native:blank',
    name: 'tool.native.blank.name',
    iconColor: 'indigo',
    iconShape: IconEraser,
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
