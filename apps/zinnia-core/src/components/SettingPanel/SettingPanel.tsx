import { useTranslation } from 'react-i18next';
import {
  ActionIcon,
  Button,
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
import { appState } from '@/states/appState';
import { useSaveOption } from '@/queries/useSaveOption';
import { appConfig } from '@/config/appConfig';
import { Notify } from '@/utils/Notify';

const formSchema = v.object({
  theme: v.picklist(['auto', 'light', 'dark']),
  language: v.string(),
  locale: v.string(),
  rtl: v.boolean(),
});

type FormValues = v.InferInput<typeof formSchema>;

const themeSelects = [
  {
    value: 'auto',
    label: 'core:ui.settingPanel.theme.auto',
  },
  {
    value: 'light',
    label: 'core:ui.settingPanel.theme.light',
  },
  {
    value: 'dark',
    label: 'core:ui.settingPanel.theme.dark',
  },
];

const languageSelects = ['en', 'vi'];

const localeSelects = ['en', 'vi'];

function SettingPanelContent() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme();
  const { t, i18n } = useTranslation();
  const { setDirection } = useDirection();
  const userConfig = useSelector(appState.userConfig);

  const initialFormValues: FormValues = {
    theme: userConfig.colorScheme,
    language: userConfig.language,
    locale: userConfig.locale,
    rtl: userConfig.dir === 'rtl',
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
          await i18n.changeLanguage(clonedUserConfig.language);
          Notify.success(t('core:hook.useSaveOption.success.updateSettings'));
        },
      }
    );
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack gap="xs">
        <Text fw={500}>{t('core:ui.settingPanel.title')}</Text>

        <Stack
          gap={8}
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
          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500}>
              {t('core:ui.settingPanel.theme.label')}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={themeSelects.map((select) => ({
                value: select.value,
                label: t(select.label),
              }))}
              {...form.getInputProps('theme')}
            />
          </Group>

          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500}>
              {t('core:ui.settingPanel.language.label')}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={languageSelects}
              {...form.getInputProps('language')}
            />
          </Group>

          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500}>
              {t('core:ui.settingPanel.locale.label')}
            </Text>
            <Select
              size="xs"
              allowDeselect={false}
              comboboxProps={{ withinPortal: false }}
              data={localeSelects}
              {...form.getInputProps('locale')}
            />
          </Group>

          <Group gap="xs" justify="space-between" wrap="nowrap">
            <Text size="sm" fw={500} flex={1}>
              {t('core:ui.settingPanel.rtl.label')}
            </Text>
            <Switch {...form.getInputProps('rtl', { type: 'checkbox' })} />
          </Group>
        </Stack>

        <Group gap="xs">
          <Button variant="light" disabled={isDisabledSubmitButton} onClick={form.reset} flex={1}>
            {t('core:common.reset')}
          </Button>
          <Button
            type="submit"
            variant="light"
            disabled={isDisabledSubmitButton}
            loading={saveOptionApi.isPending}
            flex={1}
          >
            {t('core:common.save')}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export function SettingPanel() {
  const { t } = useTranslation();
  const computedColorScheme = useComputedColorScheme();
  const { dir } = useDirection();

  return (
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
          title={t('core:ui.settingPanel.title')}
          aria-label={t('core:ui.settingPanel.title')}
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
  );
}
