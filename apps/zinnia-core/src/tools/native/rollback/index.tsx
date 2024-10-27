import { IconArrowBackUp, IconArrowBackUpDouble } from '@tabler/icons-react';
import { NativeTool, NativeToolActionComponentProps } from '@/tools/types/ZinniaTool';
import { DefaultNativeToolAdditionalSettingsFormComponent } from '@/tools/DefaultNativeToolAdditionalSettingsFormComponent';

const RollbackAction = ({ children }: NativeToolActionComponentProps) =>
  children({
    trigger: () => {},
  });

export const RollbackTool: NativeTool = {
  id: 'native:rollback',
  name: 'tool.native.rollback.name',
  iconColor: 'cyan',
  iconShape: IconArrowBackUp,
  toolVersion: '1.0.0-beta.1',
  settingsVersion: 1,
  defaultAction: 'normal-rollback',
  actions: [
    {
      id: 'agf-rollback',
      name: 'AGF rollback',
      iconColor: 'teal',
      iconShape: IconArrowBackUp,
      component: RollbackAction,
      allowedTabs: [],
      hotkey: '',
    },
    {
      id: 'normal-rollback',
      name: 'Normal rollback',
      iconColor: 'cyan',
      iconShape: IconArrowBackUp,
      component: RollbackAction,
      allowedTabs: [],
      hotkey: '',
    },
    {
      id: 'vandalism-rollback',
      name: 'Vandalism rollback',
      iconColor: 'pink',
      iconShape: IconArrowBackUpDouble,
      component: RollbackAction,
      allowedTabs: [],
      hotkey: '',
    },
  ],
  additionalSettingsForm: DefaultNativeToolAdditionalSettingsFormComponent,
};
