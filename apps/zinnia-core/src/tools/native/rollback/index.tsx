import { IconArrowBackUp, IconArrowBackUpDouble } from '@tabler/icons-react';
import { NativeTool, NativeToolAction, NativeToolComponentProps } from '@/tools/types/ZinniaTool';
import { DefaultNativeToolAdditionalSettingsForm } from '@/tools/utils/DefaultNativeToolAdditionalSettingsForm';
import { DefaultNativeToolActionComponent } from '@/tools/utils/DefaultNativeToolActionComponent';

// Actions

const friendlyRollbackAction: NativeToolAction = {
  metadata: {
    id: 'agf-rollback',
    name: 'AGF rollback',
    iconColor: 'teal',
    iconShape: IconArrowBackUp,
  },
  config: {},
  component: DefaultNativeToolActionComponent,
};

const normalRollbackAction: NativeToolAction = {
  metadata: {
    id: 'normal-rollback',
    name: 'Normal rollback',
    iconColor: 'cyan',
    iconShape: IconArrowBackUp,
  },
  config: {},
  component: DefaultNativeToolActionComponent,
};

const vandalismRollbackAction: NativeToolAction = {
  metadata: {
    id: 'vandalism-rollback',
    name: 'Vandalism rollback',
    iconColor: 'pink',
    iconShape: IconArrowBackUpDouble,
  },
  config: {},
  component: DefaultNativeToolActionComponent,
};

// Component

function RollbackTool({ children }: NativeToolComponentProps) {
  const actions = [friendlyRollbackAction, normalRollbackAction, vandalismRollbackAction];

  return children({ actions });
}

// Specification

export const rollbackTool: NativeTool = {
  metadata: {
    id: 'native:rollback',
    name: 'tool.native.rollback.name',
    iconColor: 'cyan',
    iconShape: IconArrowBackUp,
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
  component: RollbackTool,
  additionalSettingsForm: DefaultNativeToolAdditionalSettingsForm,
};
