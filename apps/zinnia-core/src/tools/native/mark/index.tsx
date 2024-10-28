import { IconCheck, IconReload } from '@tabler/icons-react';
import { Button, CloseButton, Drawer, Group, Popover, Stack, Switch, Text } from '@mantine/core';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { useRef, useState } from 'react';
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
import { Notification } from '@/utils/Notification';
import { useToolUtils } from '@/tools/useToolUtils';
import { mergeAndRemoveEqualKeys } from '@/utils/mergeAndRemoveEqualKeys';
import { useLargerThan } from '@/hooks/useLargerThan';
import { useGetRevisions } from '@/queries/useGetRevisions';
import { usePatrol } from '@/queries/usePatrol';

const TOOL_ID = 'native:mark';

// Settings

const settingsSchema = v.object({
  showConfirmationDialog: v.boolean(),
  showSuccessNotification: v.boolean(),
});

type SettingsFormValues = v.InferInput<typeof settingsSchema>;

const settingsInitialFormValues: SettingsFormValues = {
  showConfirmationDialog: true,
  showSuccessNotification: true,
};

function AdditionalSettingsForm({
  parentForm,
  toolIndex,
  data,
}: NativeToolAdditionalSettingsFormComponentProps) {
  const { formatMessage } = useIntl();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { ...settingsInitialFormValues, ...data },
    validate: valibotResolver(settingsSchema),
    onValuesChange: (values) => {
      parentForm.setFieldValue(
        `native.${toolIndex}.settings.additional.data`,
        mergeAndRemoveEqualKeys(settingsInitialFormValues, values)
      );
    },
  });

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <Text size="xs">
          {formatMessage({ id: 'tool.native.mark.message.showConfirmationDialog' })}
        </Text>
        <Switch
          size="xs"
          key={form.key('showConfirmationDialog')}
          {...form.getInputProps('showConfirmationDialog', { type: 'checkbox' })}
        />
      </Group>
      <Group gap="xs" justify="space-between" wrap="nowrap">
        <Text size="xs">
          {formatMessage({ id: 'tool.native.mark.message.showSuccessNotification' })}
        </Text>
        <Switch
          size="xs"
          key={form.key('showSuccessNotification')}
          {...form.getInputProps('showSuccessNotification', { type: 'checkbox' })}
        />
      </Group>
    </Stack>
  );
}

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
  const diffTabData =
    activeTab && (activeTab.type === TabType.DIFF || activeTab.type === TabType.MAIN_DIFF)
      ? activeTab.data
      : null;
  const readTabData =
    activeTab && (activeTab.type === TabType.READ || activeTab.type === TabType.MAIN_READ)
      ? activeTab.data
      : null;
  const [opened, setOpened] = useState(false);
  const userMarkTool = useSelector(() =>
    appState.userConfig.tools.native.get().find((tool) => tool.toolId === TOOL_ID)
  );
  const userAdditionalSettings: Partial<SettingsFormValues> = userMarkTool
    ? userMarkTool.settings.additional.data
    : {};
  const additionalSettings: SettingsFormValues = {
    ...settingsInitialFormValues,
    ...userAdditionalSettings,
  };
  const targetRef = useRef<HTMLButtonElement>(null);
  const largerThanXs = useLargerThan('xs');
  const { data: firstRevisions = [], isLoading: isLoadingFirstRevisions } = useGetRevisions(
    readTabData && readTabData.revisionId === null ? readTabData.wikiId : 'N/A',
    readTabData && readTabData.revisionId === null ? readTabData.pageTitle : 'N/A',
    1,
    'newer'
  );
  const revisionId = diffTabData
    ? diffTabData.toRevisionId
    : readTabData && readTabData.revisionId
      ? readTabData.revisionId
      : firstRevisions.length > 0
        ? firstRevisions[0].revisionId
        : 0;
  const currentReadTabRevisionId = useSelector(appState.ui.currentReadTabRevisionId);
  const wikiId = diffTabData ? diffTabData.wikiId : readTabData ? readTabData.wikiId : 'N/A';
  const patrolApi = usePatrol(wikiId, revisionId);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const revisionIdFragment = (
    <Text
      size="sm"
      component="span"
      c={readTabData && revisionId !== currentReadTabRevisionId ? 'orange' : 'cyan'}
      fw={600}
      ff="var(--zinnia-font-monospace)"
    >
      {revisionId}
    </Text>
  );

  const run = () => {
    if (wikiId !== 'N/A' && revisionId !== 0 && !patrolApi.isSuccess) {
      patrolApi.mutate(undefined, {
        onSuccess: () => {
          additionalSettings.showSuccessNotification &&
            Notification.success(
              formatMessage(
                { id: 'tool.native.mark.message.successfulMark' },
                { revisionId: revisionIdFragment }
              )
            );
        },
        onSettled: () => closeButtonRef.current?.focus(),
      });
    }
  };

  const trigger = () => {
    if (activeTab && markAsPatrolledAction.allowedTabs.includes(activeTab.type)) {
      if (additionalSettings.showConfirmationDialog) {
        setOpened(!opened);
      } else {
        run();
      }
    } else {
      Notification.info(allowedTabsMessage(markAsPatrolledAction.allowedTabs));
    }
  };

  const triggerByHotkey = () => {
    if (opened || (!opened && !additionalSettings.showConfirmationDialog)) {
      targetRef.current?.focus();
    }
    trigger();
  };

  useHotkeys([[markAsPatrolledAction.hotkey, triggerByHotkey]]);

  const contentFragment = (
    <Stack gap="xs">
      <Stack gap={5}>
        <Group gap="xs" justify="space-between">
          <Text size="sm" fw={600}>
            {formatMessage({ id: 'common.confirm' })}
          </Text>
          <CloseButton
            size="xs"
            aria-label={formatMessage({ id: 'common.close' })}
            onClick={() => setOpened(false)}
            ref={closeButtonRef}
          />
        </Group>
        <Text size="sm">
          {formatMessage(
            {
              id:
                readTabData && readTabData.revisionId === null
                  ? 'tool.native.mark.message.confirmationTextForFirstRevision'
                  : 'tool.native.mark.message.confirmationText',
            },
            { revisionId: revisionIdFragment }
          )}
        </Text>
      </Stack>
      <Button
        data-autofocus
        disabled={isLoadingFirstRevisions || patrolApi.isSuccess}
        onClick={run}
        loading={patrolApi.isPending}
        color={patrolApi.isError ? 'red' : 'blue'}
      >
        {patrolApi.isSuccess ? (
          <IconCheck size="1.5rem" />
        ) : patrolApi.isError ? (
          <IconReload size="1.5rem" />
        ) : (
          formatMessage({ id: 'common.ok' })
        )}
      </Button>
    </Stack>
  );

  const targetLoading = additionalSettings.showConfirmationDialog ? false : patrolApi.isPending;
  const childrenFragment = children({ trigger, loading: targetLoading, targetRef });

  return largerThanXs ? (
    <Popover
      width={250}
      position="top"
      shadow="lg"
      radius="md"
      trapFocus
      opened={opened}
      onChange={setOpened}
    >
      <Popover.Target>{childrenFragment}</Popover.Target>
      <Popover.Dropdown px="sm" py="xs">
        {contentFragment}
      </Popover.Dropdown>
    </Popover>
  ) : (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        position="bottom"
        withCloseButton={false}
        styles={{ content: { height: 'auto' } }}
      >
        {contentFragment}
      </Drawer>
      {childrenFragment}
    </>
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
