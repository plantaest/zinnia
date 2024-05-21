import { Filter } from '@/types/persistence/Filter';
import { Tab } from '@/types/persistence/Tab';
import { Instant } from '@/types/lang/Instant';

export interface Workspace {
  id: string;
  createdAt: Instant;
  updatedAt: Instant;
  name: string;
  filters: Filter[];
  activeFilterId: string | null;
  tabs: Tab[];
  activeTabId: string | null;
}
