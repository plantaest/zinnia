import { Instant } from '@/types/lang/Instant';

export type Tab = {
  id: string;
  createdAt: Instant;
  updatedAt: Instant;
  name: string;
} & (
  | {
      type: TabType.WELCOME;
    }
  | {
      type: TabType.DIFF | TabType.MAIN_DIFF;
      data: DiffTabData;
    }
  | {
      type: TabType.READ | TabType.MAIN_READ;
      data: ReadTabData;
    }
  | {
      type: TabType.PAGE;
      data: PageTabData;
    }
  | {
      type: TabType.USER;
      data: UserTabData;
    }
);

export enum TabType {
  WELCOME = 'WELCOME',
  DIFF = 'DIFF',
  MAIN_DIFF = 'MAIN_DIFF',
  READ = 'READ',
  MAIN_READ = 'MAIN_READ',
  PAGE = 'PAGE',
  USER = 'USER',
}

export const tabTypeMessages: Record<TabType, string> = {
  [TabType.WELCOME]: 'tab.welcome',
  [TabType.DIFF]: 'tab.diff',
  [TabType.MAIN_DIFF]: 'tab.mainDiff',
  [TabType.READ]: 'tab.read',
  [TabType.MAIN_READ]: 'tab.mainRead',
  [TabType.PAGE]: 'tab.page',
  [TabType.USER]: 'tab.user',
};

export interface DiffTabData {
  wikiId: string;
  pageTitle: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export interface ReadTabData {
  wikiId: string;
  pageTitle: string;
  revisionId: number | null;
  redirect: boolean;
}

export interface PageTabData {
  wikiId: string;
  pageTitle: string;
}

export interface UserTabData {
  wikiId: string;
  username: number;
}
