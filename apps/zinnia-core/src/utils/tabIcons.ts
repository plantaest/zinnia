import {
  IconAlignJustified,
  IconFile,
  IconLayoutColumns,
  IconSeeding,
  IconUser,
  TablerIcon,
} from '@tabler/icons-react';
import { TabType } from '@/types/persistence/Tab';

export const tabIcons: Record<TabType, TablerIcon> = {
  [TabType.WELCOME]: IconSeeding,
  [TabType.DIFF]: IconLayoutColumns,
  [TabType.MAIN_DIFF]: IconLayoutColumns,
  [TabType.READ]: IconAlignJustified,
  [TabType.MAIN_READ]: IconAlignJustified,
  [TabType.PAGE]: IconFile,
  [TabType.USER]: IconUser,
};
