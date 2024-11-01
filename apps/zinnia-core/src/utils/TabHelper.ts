import {
  IconAlignJustified,
  IconFile,
  IconLayoutColumns,
  IconSeeding,
  IconUser,
  TablerIcon,
} from '@tabler/icons-react';
import { Tab, TabType } from '@/types/persistence/Tab';

export namespace TabHelper {
  export const icons: Record<TabType, TablerIcon> = {
    [TabType.WELCOME]: IconSeeding,
    [TabType.DIFF]: IconLayoutColumns,
    [TabType.MAIN_DIFF]: IconLayoutColumns,
    [TabType.READ]: IconAlignJustified,
    [TabType.MAIN_READ]: IconAlignJustified,
    [TabType.PAGE]: IconFile,
    [TabType.USER]: IconUser,
  };

  export const isWelcome = (tab: Tab | null): tab is Tab & { type: TabType.WELCOME } =>
    !!tab && tab.type === TabType.WELCOME;

  export const isDiff = (tab: Tab | null): tab is Tab & { type: TabType.DIFF } =>
    !!tab && tab.type === TabType.DIFF;

  export const isMainDiff = (tab: Tab | null): tab is Tab & { type: TabType.MAIN_DIFF } =>
    !!tab && tab.type === TabType.MAIN_DIFF;

  export const isDiffs = (
    tab: Tab | null
  ): tab is Tab & { type: TabType.DIFF | TabType.MAIN_DIFF } =>
    !!tab && (tab.type === TabType.DIFF || tab.type === TabType.MAIN_DIFF);

  export const isRead = (tab: Tab | null): tab is Tab & { type: TabType.READ } =>
    !!tab && tab.type === TabType.READ;

  export const isMainRead = (tab: Tab | null): tab is Tab & { type: TabType.MAIN_READ } =>
    !!tab && tab.type === TabType.MAIN_READ;

  export const isReads = (
    tab: Tab | null
  ): tab is Tab & { type: TabType.READ | TabType.MAIN_READ } =>
    !!tab && (tab.type === TabType.READ || tab.type === TabType.MAIN_READ);

  export const isPage = (tab: Tab | null): tab is Tab & { type: TabType.PAGE } =>
    !!tab && tab.type === TabType.PAGE;

  export const isUser = (tab: Tab | null): tab is Tab & { type: TabType.USER } =>
    !!tab && tab.type === TabType.USER;
}
