import { IconCheck } from '@tabler/icons-react';
import { Button, Group, Popover, Stack, Switch, Text } from '@mantine/core';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import * as v from 'valibot';
import { useForm } from '@mantine/form';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import {
  NativeTool,
  NativeToolAction,
  NativeToolActionComponentProps,
  NativeToolAdditionalSettingsFormComponentProps,
} from '@/tools/types/ZinniaTool';
import { appState } from '@/states/appState';
import { TabType } from '@/types/persistence/Tab';
import { Notify } from '@/utils/Notify';
import { useToolUtils } from '@/tools/useToolUtils';
import { isEqual } from '@/utils/isEqual';

const TOOL_ID = 'native:mark';

// Actions

const markAsPatrolledAction: NativeToolAction = {
  id: 'mark-as-patrolled',
  name: 'tool.native.mark.actions.markAsPatrolled.name',
  iconColor: 'lime',
  iconShape: IconCheck,
  component: MarkAsPatrolledAction,
  allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
  hotkey: 'ctrl+M',
};

function MarkAsPatrolledAction({ children }: NativeToolActionComponentProps) {
  const { formatMessage } = useIntl();
  const { allowedTabsMessage } = useToolUtils();
  const activeTab = useSelector(appState.ui.activeTab);
  const revisionId = activeTab
    ? activeTab.type === TabType.DIFF || activeTab.type === TabType.MAIN_DIFF
      ? activeTab.data.toRevisionId
      : activeTab.type === TabType.READ || activeTab.type === TabType.MAIN_READ
        ? activeTab.data.revisionId
        : 0
    : 0;
  const [opened, setOpened] = useState(false);
  const userMarkTool = useSelector(() =>
    appState.userConfig.tools.native.get().find((tool) => tool.toolId === TOOL_ID)
  );
  const additionalSettings: Partial<FormValues> = userMarkTool
    ? userMarkTool.settings.additional.data
    : {};

  const run = () => {
    // eslint-disable-next-line no-console
    console.log('Patrolled');
  };

  const trigger = () => {
    if (activeTab && markAsPatrolledAction.allowedTabs.includes(activeTab.type)) {
      if (additionalSettings.showConfirmDialog === undefined) {
        setOpened(!opened);
      }

      if (additionalSettings.showConfirmDialog === false) {
        run();
      }
    } else {
      Notify.info(allowedTabsMessage(markAsPatrolledAction.allowedTabs));
    }
  };

  useHotkeys([[markAsPatrolledAction.hotkey, trigger]]);

  return (
    <Popover
      width={250}
      position="top"
      shadow="lg"
      radius="md"
      trapFocus
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>{children({ trigger })}</Popover.Target>
      <Popover.Dropdown px="sm" py="xs">
        <Stack gap="xs">
          <Stack gap={5}>
            <Text size="sm" fw={600}>
              {formatMessage({ id: 'common.confirm' })}
            </Text>
            <Text size="sm">
              {formatMessage(
                { id: 'tool.native.mark.message.confirmationText' },
                {
                  revisionId: (
                    <Text component="span" c="cyan" fw={600} ff="var(--zinnia-font-monospace)">
                      {revisionId}
                    </Text>
                  ),
                }
              )}
            </Text>
          </Stack>
          <Button onClick={run}>{formatMessage({ id: 'common.ok' })}</Button>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

// Settings

const schema = v.object({
  showConfirmDialog: v.boolean(),
});

type FormValues = v.InferInput<typeof schema>;

const initialValues: FormValues = {
  showConfirmDialog: true,
};

function AdditionalSettingsForm({
  parentForm,
  toolIndex,
  data,
}: NativeToolAdditionalSettingsFormComponentProps) {
  const { formatMessage } = useIntl();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: isEqual(data, {}) ? initialValues : (data as FormValues),
    validate: valibotResolver(schema),
    onValuesChange: (values) => {
      if (!isEqual(initialValues, values)) {
        parentForm.setFieldValue(`native.${toolIndex}.settings.additional.data`, values);
      } else {
        parentForm.setFieldValue(`native.${toolIndex}.settings.additional.data`, {});
      }
    },
  });

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text size="xs">{formatMessage({ id: 'tool.native.mark.message.showConfirmDialog' })}</Text>
        <Switch
          size="xs"
          key={form.key('showConfirmDialog')}
          {...form.getInputProps('showConfirmDialog', { type: 'checkbox' })}
        />
      </Group>
    </Stack>
  );
}

// Metadata

export const MarkTool: NativeTool = {
  id: TOOL_ID,
  name: 'tool.native.mark.name',
  iconColor: 'lime',
  iconShape: IconCheck,
  toolVersion: '1.0.0-beta.1',
  settingsVersion: 1,
  defaultAction: 'mark-as-patrolled',
  actions: [markAsPatrolledAction],
  additionalSettingsForm: AdditionalSettingsForm,
};
