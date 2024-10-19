import { useIntl } from 'react-intl';
import {
  ActionIcon,
  Button,
  CloseButton,
  Flex,
  Group,
  Popover,
  Select,
  Stack,
  Switch,
  Text,
  useComputedColorScheme,
  useDirection,
  useMantineColorScheme,
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useSelector } from '@legendapp/state/react';
import * as v from 'valibot';
import { valibotResolver } from 'mantine-form-valibot-resolver';
import { modals } from '@mantine/modals';
import { appState } from '@/states/appState';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';
import { i18n } from '@/i18n';
import { useLargerThan } from '@/hooks/useLargerThan';

const formSchema = v.object({
  theme: v.picklist(['auto', 'light', 'dark']),
  language: v.string(),
  locale: v.string(),
  rtl: v.boolean(),
  advancedMode: v.boolean(),
});

type FormValues = v.InferInput<typeof formSchema>;

const themeSelects = [
  {
    value: 'auto',
    label: 'ui.settingPanel.theme.auto',
  },
  {
    value: 'light',
    label: 'ui.settingPanel.theme.light',
  },
  {
    value: 'dark',
    label: 'ui.settingPanel.theme.dark',
  },
];

const languageSelects = ['en', 'vi'];

const localeSelects = ['en', 'vi'];

function SettingPanelContent() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();
  const { formatMessage } = useIntl();
  const { setDirection } = useDirection();
  const userConfig = useSelector(appState.userConfig);
  const largerThanMd = useLargerThan('md');

  const initialFormValues: FormValues = {
    theme: userConfig.colorScheme,
    language: userConfig.language,
    locale: userConfig.locale,
    rtl: userConfig.dir === 'rtl',
    advancedMode: userConfig.advancedMode,
  };

  const form = useForm({
    initialValues: initialFormValues,
    validate: valibotResolver(formSchema),
  });

  const saveOptionApi = useSaveOption();

  const isDisabledSubmitButton = !form.isDirty();

  const handleFormSubmit = form.onSubmit((formValues) => {
    const clonedUserConfig = structuredClone(userConfig);

    clonedUserConfig.colorScheme = formValues.theme;
    clonedUserConfig.language = formValues.language;
    clonedUserConfig.locale = formValues.locale;
    clonedUserConfig.dir = formValues.rtl ? 'rtl' : 'ltr';
    clonedUserConfig.advancedMode = formValues.advancedMode;

    saveOptionApi.mutate(
      {
        name: appConfig.USER_CONFIG_OPTION_KEY,
        value: JSON.stringify(clonedUserConfig),
      },
      {
        onSuccess: async () => {
          form.resetDirty();
          appState.userConfig.set(clonedUserConfig);
          setColorScheme(clonedUserConfig.colorScheme);
          setDirection(clonedUserConfig.dir);

          if (!clonedUserConfig.advancedMode) {
            appState.ui.preview.set(false);
          }

          await i18n.changeLanguage(clonedUserConfig.language);
          Notify.success(
            i18n.intl.formatMessage({ id: 'hook.useSaveOption.success.updateSettings' })
          );
        },
      }
    );
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack gap="xs">
        <Group gap="xs">
          {!largerThanMd && (
            <CloseButton
              onClick={modals.closeAll}
              variant="subtle"
              aria-label={formatMessage({ id: 'common.close' })}
            />
          )}
          <Text fw={500}>{formatMessage({ id: 'ui.settingPanel.title' })}</Text>
        </Group>

        <Stack
          gap="xs"
          px="sm"
          py="xs"
          style={{
            borderRadius: 'var(--mantine-radius-sm)',
            backgroundColor:
              computedColorScheme === 'dark'
                ? 'var(--mantine-color-dark-5)'
                : 'var(--mantine-color-gray-1)',
          }}
        >
          <Flex
            gap={5}
            justify="space-between"
            align={{ xs: 'center' }}
            direction={{ base: 'column', xs: 'row' }}
          >
            <Text size="sm" fw={500}>
              {formatMessage({ id: 'ui.settingPanel.theme.label' })}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={themeSelects.map((select) => ({
                value: select.value,
                label: formatMessage({ id: select.label }),
              }))}
              {...form.getInputProps('theme')}
            />
          </Flex>

          <Flex
            gap={5}
            justify="space-between"
            align={{ xs: 'center' }}
            direction={{ base: 'column', xs: 'row' }}
          >
            <Text size="sm" fw={500}>
              {formatMessage({ id: 'ui.settingPanel.language.label' })}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={languageSelects}
              {...form.getInputProps('language')}
            />
          </Flex>

          <Flex
            gap={5}
            justify="space-between"
            align={{ xs: 'center' }}
            direction={{ base: 'column', xs: 'row' }}
          >
            <Text size="sm" fw={500}>
              {formatMessage({ id: 'ui.settingPanel.locale.label' })}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={localeSelects}
              {...form.getInputProps('locale')}
            />
          </Flex>

          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500} flex={1}>
              {formatMessage({ id: 'ui.settingPanel.rtl.label' })}
            </Text>
            <Switch {...form.getInputProps('rtl', { type: 'checkbox' })} />
          </Group>

          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500} flex={1}>
              {formatMessage({ id: 'ui.settingPanel.advancedMode.label' })}
            </Text>
            <Switch {...form.getInputProps('advancedMode', { type: 'checkbox' })} />
          </Group>
        </Stack>

        <Group gap="xs">
          <Button variant="light" disabled={isDisabledSubmitButton} onClick={form.reset} flex={1}>
            {formatMessage({ id: 'common.reset' })}
          </Button>
          <Button
            type="submit"
            variant="light"
            disabled={isDisabledSubmitButton}
            loading={saveOptionApi.isPending}
            flex={1}
          >
            {formatMessage({ id: 'common.save' })}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function SettingPanel() {
  const { formatMessage } = useIntl();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();
  const largerThanMd = useLargerThan('md');

  const handleClickSettingsButton = () =>
    modals.open({
      padding: 'xs',
      fullScreen: true,
      withCloseButton: false,
      withOverlay: false,
      children: <SettingPanelContent />,
    });

  return largerThanMd ? (
    <Popover
      width={350}
      position="top-end"
      shadow="lg"
      radius="md"
      transitionProps={{ transition: dir === 'rtl' ? 'pop-bottom-left' : 'pop-bottom-right' }}
    >
      <Popover.Target>
        <ActionIcon
          variant="subtle"
          size="lg"
          title={formatMessage({ id: 'ui.settingPanel.title' })}
          aria-label={formatMessage({ id: 'ui.settingPanel.title' })}
        >
          <IconSettings size="1.5rem" />
        </ActionIcon>
      </Popover.Target>

      <Popover.Dropdown
        py="xs"
        px="sm"
        style={{
          backgroundColor:
            computedColorScheme === 'dark'
              ? 'var(--mantine-color-dark-7)'
              : 'var(--mantine-color-white)',
        }}
      >
        <SettingPanelContent />
      </Popover.Dropdown>
    </Popover>
  ) : (
    <ActionIcon
      variant="subtle"
      size="lg"
      title={formatMessage({ id: 'ui.settingPanel.title' })}
      aria-label={formatMessage({ id: 'ui.settingPanel.title' })}
      onClick={handleClickSettingsButton}
    >
      <IconSettings size="1.5rem" />
    </ActionIcon>
  );
}
