import { IconCheck, IconReload } from '@tabler/icons-react';
import { Button, CloseButton, Drawer, Group, Popover, Stack, Switch, Text } from '@mantine/core';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import { useRef, useState } from 'react';
import { useHotkeys } from '@mantine/hooks';
import * as v from 'valibot';
import { useForm } from '@mantine/form';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { appState } from '@/states/appState';
import { TabType } from '@/types/persistence/Tab';
import { Notice } from '@/utils/Notice';
import { useToolUtils } from '@/tools/utils/useToolUtils';
import { mergeAndRemoveEqualKeys } from '@/utils/mergeAndRemoveEqualKeys';
import { useLargerThan } from '@/hooks/useLargerThan';
import { useGetRevisions } from '@/queries/useGetRevisions';
import { usePatrol } from '@/queries/usePatrol';
import {
  NativeTool,
  NativeToolAdditionalSettingsFormProps,
  NativeToolComponentProps,
} from '@/tools/types/NativeTool';
import { defaultPageContext } from '@/tools/types/PageContext';

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
  userAdditionalSettings,
}: NativeToolAdditionalSettingsFormProps) {
  const { formatMessage } = useIntl();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      ...settingsInitialFormValues,
      ...userAdditionalSettings,
      ...mergeAndRemoveEqualKeys(
        settingsInitialFormValues,
        parentForm.getValues().native[toolIndex].settings.additional.data
      ),
    },
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

// Component

function MarkTool({ metadata, config, children }: NativeToolComponentProps) {
  const { formatMessage } = useIntl();
  const { getAdditionalSettings, isAllowedTabs } = useToolUtils('native', metadata);
  const additionalSettings = getAdditionalSettings(settingsInitialFormValues);

  const pageContext = useSelector(appState.ui.pageContext);

  const { data: firstRevisions = [], isLoading: isLoadingFirstRevisions } = useGetRevisions(
    pageContext.wikiId,
    pageContext.pageTitle,
    1,
    'newer',
    {
      enabled: () => pageContext !== defaultPageContext && pageContext.contextType === 'page',
      staleTime: Infinity,
    }
  );
  const firstRevisionId = firstRevisions.length > 0 ? firstRevisions[0].revisionId : null;
  const revisionId =
    pageContext.contextType === 'page' && firstRevisionId
      ? firstRevisionId
      : pageContext.revisionId;
  const patrolApi = usePatrol(pageContext.wikiId, revisionId);

  const [openedDialog, setOpenedDialog] = useState(false);
  const largerThanXs = useLargerThan('xs');
  const targetRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const revisionIdFragment = (
    <Text
      size="sm"
      component="span"
      c={
        pageContext.contextType === 'page' && pageContext.revisionId !== firstRevisionId
          ? 'orange'
          : 'cyan'
      }
      fw={600}
      ff="var(--zinnia-font-monospace)"
    >
      {revisionId}
    </Text>
  );

  const run = () => {
    if (pageContext !== defaultPageContext && !patrolApi.isSuccess) {
      patrolApi.mutate(undefined, {
        onSuccess: () => {
          additionalSettings.showSuccessNotification &&
            Notice.success(
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
    if (isAllowedTabs(config.restriction.allowedTabs)) {
      if (additionalSettings.showConfirmationDialog) {
        setOpenedDialog(!openedDialog);
      } else {
        run();
      }
    }
  };

  const triggerByHotkey = () => {
    if (openedDialog || (!openedDialog && !additionalSettings.showConfirmationDialog)) {
      targetRef.current?.focus();
    }
    trigger();
  };

  useHotkeys(config.hotkey ? [[config.hotkey, triggerByHotkey]] : []);

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
            onClick={() => setOpenedDialog(false)}
            ref={closeButtonRef}
          />
        </Group>
        <Text size="sm">
          {formatMessage(
            {
              id:
                pageContext.contextType === 'page'
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
      opened={openedDialog}
      onChange={setOpenedDialog}
    >
      <Popover.Target>{childrenFragment}</Popover.Target>
      <Popover.Dropdown px="sm" py="xs">
        {contentFragment}
      </Popover.Dropdown>
    </Popover>
  ) : (
    <>
      <Drawer
        opened={openedDialog}
        onClose={() => setOpenedDialog(false)}
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

// Specification

export const markTool: NativeTool = {
  metadata: {
    id: 'native:mark',
    name: 'tool.native.mark.name',
    iconColor: 'lime',
    iconShape: IconCheck,
    toolVersion: '1.0.0-beta.1',
    settingsVersion: 1,
  },
  config: {
    restriction: {
      allowedWikis: [],
      allowedRights: [],
      allowedTabs: [TabType.DIFF, TabType.MAIN_DIFF, TabType.READ, TabType.MAIN_READ],
    },
    hotkey: 'ctrl+M',
  },
  component: MarkTool,
  additionalSettingsForm: AdditionalSettingsForm,
};
