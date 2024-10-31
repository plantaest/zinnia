import {
  ActionIcon,
  Button,
  ComboboxData,
  Divider,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { IconArrowLeft, IconWind } from '@tabler/icons-react';
import { useIntl } from 'react-intl';
import { useSelector } from '@legendapp/state/react';
import * as v from 'valibot';
import { useForm } from '@mantine/form';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useState } from 'react';
import dayjs from 'dayjs';
import { ToolboxLayer } from '@/components/ToolboxPanel/ToolboxPanel';
import classes from '@/components/ToolboxPanel/ToolboxSettings.module.css';
import { appState } from '@/states/appState';
import { nativeToolsDict } from '@/tools/nativeTools';
import { extendedToolsDict } from '@/tools/extendedTools';
import { toolIconColors } from '@/tools/types/ZinniaTool';
import { UserExtendedTool, UserNativeTool } from '@/types/persistence/Tool';
import { useUpdateTools } from '@/queries/useUpdateTools';
import { UserConfig } from '@/types/persistence/UserConfig';
import { DefaultNativeToolAdditionalSettingsForm } from '@/tools/utils/DefaultNativeToolAdditionalSettingsForm';

const formSchema = v.object({
  native: v.array(
    v.object({
      settings: v.object({
        general: v.object({
          dock: v.boolean(),
        }),
        additional: v.object({
          data: v.record(v.string(), v.any()),
        }),
      }),
    })
  ),
  extended: v.array(
    v.object({
      settings: v.object({
        general: v.object({
          dock: v.boolean(),
          iconColor: v.picklist(toolIconColors),
        }),
      }),
    })
  ),
});

export type ToolboxSettingsFormValues = v.InferInput<typeof formSchema>;

interface ToolboxSettingsProps {
  onChangeLayer: (layer: ToolboxLayer) => void;
}

type SelectedTool = {
  type: 'native' | 'extended';
  index: number;
  id: string;
  name: string;
};

const getInitialFormValues = (tools: UserConfig['tools']): ToolboxSettingsFormValues => ({
  native: tools.native.map((nativeTool) => ({
    settings: {
      general: {
        dock: nativeTool.settings.general.dock,
      },
      additional: {
        data: nativeTool.settings.additional.data,
      },
    },
  })),
  extended: tools.extended.map((extendedTool) => ({
    settings: {
      general: {
        dock: extendedTool.settings.general.dock,
        iconColor: extendedTool.settings.general.iconColor,
      },
    },
  })),
});

export function ToolboxSettings({ onChangeLayer }: ToolboxSettingsProps) {
  const { formatMessage } = useIntl();
  const tools = useSelector(appState.userConfig.tools);
  const [selectedTool, setSelectedTool] = useState<SelectedTool>({
    type: tools.native.length > 0 ? 'native' : 'extended',
    index: 0,
    id:
      tools.native.length > 0
        ? tools.native[0].toolId
        : tools.extended.length > 0
          ? tools.extended[0].toolId
          : 'N/A',
    name:
      tools.native.length > 0
        ? formatMessage({ id: nativeToolsDict[tools.native[0].toolId].metadata.name })
        : tools.extended.length > 0
          ? extendedToolsDict[tools.extended[0].toolId].metadata.name
          : 'N/A',
  });
  const updateToolsApi = useUpdateTools();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: getInitialFormValues(tools),
    validate: valibotResolver(formSchema),
  });

  const handleClickBackButton = () => {
    onChangeLayer('main');
  };

  const handleClickToolButton = (payload: SelectedTool) => {
    setSelectedTool(payload);
  };

  const handleClickSaveButton = () => {
    const formValues = form.getValues();
    const now = dayjs().toISOString();
    const nativeTools: UserNativeTool[] = [];
    const extendedTools: UserExtendedTool[] = [];

    for (let i = 0; i < tools.native.length; i += 1) {
      if (form.isDirty(`native.${i}`)) {
        const nativeTool: UserNativeTool = {
          toolId: tools.native[i].toolId,
          createdAt: tools.native[i].createdAt,
          updatedAt: now,
          settings: {
            general: {
              dock: formValues.native[i].settings.general.dock,
            },
            additional: {
              version: tools.native[i].settings.additional.version,
              data: formValues.native[i].settings.additional.data,
            },
          },
        };
        nativeTools.push(nativeTool);
      } else {
        nativeTools.push(tools.native[i]);
      }
    }

    for (let i = 0; i < tools.extended.length; i += 1) {
      if (form.isDirty(`extended.${i}`)) {
        const extendedTool: UserExtendedTool = {
          toolId: tools.extended[i].toolId,
          createdAt: tools.extended[i].createdAt,
          updatedAt: now,
          settings: {
            general: {
              dock: formValues.extended[i].settings.general.dock,
              iconColor: formValues.extended[i].settings.general.iconColor,
            },
          },
        };
        extendedTools.push(extendedTool);
      } else {
        extendedTools.push(tools.extended[i]);
      }
    }

    updateToolsApi.mutate(
      { native: nativeTools, extended: extendedTools },
      {
        onSuccess: () => {
          form.resetDirty();
        },
      }
    );
  };

  const isEmpty = tools.native.length === 0 && tools.extended.length === 0;
  const isDisabledSaveButton = isEmpty || !form.isDirty();
  const toolIconColorSelects: ComboboxData = toolIconColors.map((color) => ({
    value: color,
    label: formatMessage({ id: `color.${color}` }),
  }));
  const NativeToolAdditionalForm = nativeToolsDict[selectedTool.id]
    ? nativeToolsDict[selectedTool.id].additionalSettingsForm
    : DefaultNativeToolAdditionalSettingsForm;

  return (
    <Stack gap="xs">
      <Group gap="xs" justify="space-between">
        <Text fw={500}>{formatMessage({ id: 'ui.toolboxPanel.settings.title' })}</Text>

        <Group gap="xs">
          <Button
            size="compact-xs"
            disabled={isDisabledSaveButton}
            loading={updateToolsApi.isPending}
            onClick={handleClickSaveButton}
          >
            {formatMessage({ id: 'common.save' })}
          </Button>
          <ActionIcon
            variant="transparent"
            color="gray"
            title={formatMessage({ id: 'common.back' })}
            aria-label={formatMessage({ id: 'common.back' })}
            onClick={handleClickBackButton}
          >
            <IconArrowLeft size="1.25rem" />
          </ActionIcon>
        </Group>
      </Group>

      {isEmpty ? (
        <Stack align="center" py="lg">
          <IconWind size="2rem" stroke={1.5} color="var(--mantine-color-gray-5)" />
          <Text size="xs" c="dimmed">
            {formatMessage({ id: 'ui.toolboxPanel.noTools' })}
          </Text>
        </Stack>
      ) : (
        <Group gap="xs" wrap="nowrap" align="start" style={{ wordBreak: 'break-word' }}>
          <Stack gap={6} flex={{ xs: 1 }}>
            {tools.native.map((tool, index) => {
              const nativeTool = nativeToolsDict[tool.toolId];
              return (
                <UnstyledButton
                  key={nativeTool.metadata.id}
                  className={classes.tool}
                  data-selected={selectedTool.type === 'native' && selectedTool.index === index}
                  onClick={() =>
                    handleClickToolButton({
                      type: 'native',
                      index: index,
                      id: nativeTool.metadata.id,
                      name: formatMessage({ id: nativeTool.metadata.name }),
                    })
                  }
                >
                  <Group gap={8}>
                    <ThemeIcon color={nativeTool.metadata.iconColor} size="sm">
                      <nativeTool.metadata.iconShape size="1rem" />
                    </ThemeIcon>
                    <Text size="xs" visibleFrom="xs">
                      {formatMessage({ id: nativeTool.metadata.name })}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}

            {tools.extended.map((tool, index) => {
              const extendedTool = extendedToolsDict[tool.toolId];
              return (
                <UnstyledButton
                  key={extendedTool.metadata.id}
                  className={classes.tool}
                  data-selected={selectedTool.type === 'extended' && selectedTool.index === index}
                  onClick={() =>
                    handleClickToolButton({
                      type: 'extended',
                      index: index,
                      id: extendedTool.metadata.id,
                      name: extendedTool.metadata.name,
                    })
                  }
                >
                  <Group gap={8}>
                    <ThemeIcon color={tool.settings.general.iconColor} size="sm">
                      <Text ff="var(--zinnia-font-monospace)" fz={10}>
                        {extendedTool.metadata.iconLabel}
                      </Text>
                    </ThemeIcon>
                    <Text size="xs" visibleFrom="xs">
                      {extendedTool.metadata.name}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}
          </Stack>

          <Stack gap="xs" flex={2} className={classes.settings}>
            <Text fw={600} size="xs">
              {selectedTool.name}
            </Text>
            <Divider
              label={formatMessage({ id: 'ui.toolboxPanel.settings.general' })}
              labelPosition="left"
            />
            <Stack gap="xs">
              <Group gap="xs" justify="space-between" wrap="nowrap">
                <Text size="xs">
                  {formatMessage({ id: 'ui.toolboxPanel.settings.displayOnDock' })}
                </Text>
                <Switch
                  size="xs"
                  key={form.key(`${selectedTool.type}.${selectedTool.index}.settings.general.dock`)}
                  {...form.getInputProps(
                    `${selectedTool.type}.${selectedTool.index}.settings.general.dock`,
                    { type: 'checkbox' }
                  )}
                />
              </Group>

              {selectedTool.type === 'extended' && (
                <Group gap="xs" justify="space-between" wrap="nowrap">
                  <Text size="xs">
                    {formatMessage({ id: 'ui.toolboxPanel.settings.iconColor' })}
                  </Text>
                  <Select
                    variant="filled"
                    size="xs"
                    w={{ base: 125, xs: 150 }}
                    maxDropdownHeight={159.5}
                    allowDeselect={false}
                    data={toolIconColorSelects}
                    comboboxProps={{ withinPortal: false }}
                    key={form.key(`extended.${selectedTool.index}.settings.general.iconColor`)}
                    {...form.getInputProps(
                      `extended.${selectedTool.index}.settings.general.iconColor`
                    )}
                  />
                </Group>
              )}
            </Stack>

            {selectedTool.type === 'native' && (
              <>
                <Divider
                  label={formatMessage({ id: 'ui.toolboxPanel.settings.additional' })}
                  labelPosition="left"
                />
                <NativeToolAdditionalForm
                  parentForm={form}
                  toolIndex={selectedTool.index}
                  userAdditionalSettings={tools.native[selectedTool.index].settings.additional.data}
                />
              </>
            )}
          </Stack>
        </Group>
      )}
    </Stack>
  );
}
