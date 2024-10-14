import {
  IconAlignJustified,
  IconFile,
  IconLayoutColumns,
  IconPhoto,
  IconSeeding,
  IconUser,
} from '@tabler/icons-react';
import { TabType } from '@/types/persistence/Tab';
import { TablerIcon } from '@/types/lib/TablerIcon';

export const tabIcons: Record<TabType, TablerIcon> = {
  [TabType.WELCOME]: IconSeeding,
  [TabType.DIFF]: IconLayoutColumns,
  [TabType.MAIN_DIFF]: IconLayoutColumns,
  [TabType.READ]: IconAlignJustified,
  [TabType.MAIN_READ]: IconAlignJustified,
  [TabType.FILE]: IconPhoto,
  [TabType.MAIN_FILE]: IconPhoto,
  [TabType.PAGE]: IconFile,
  [TabType.USER]: IconUser,
};
