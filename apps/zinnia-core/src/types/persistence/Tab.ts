import { Instant } from '@/types/lang/Instant';

export type Tab = {
  id: string;
  createdAt: Instant;
  updatedAt: Instant;
  name: string;
} & (
  | {
      type: TabType.WELCOME;
      data: null;
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
      type: TabType.FILE | TabType.MAIN_FILE;
      data: FileTabData;
    }
  | {
      type: TabType.PAGE_HISTORY;
      data: PageHistoryTabData;
    }
  | {
      type: TabType.USER_CONTRIBUTIONS;
      data: UserContributionsTabData;
    }
);

export enum TabType {
  WELCOME = 'WELCOME',
  DIFF = 'DIFF',
  MAIN_DIFF = 'MAIN_DIFF',
  READ = 'READ',
  MAIN_READ = 'MAIN_READ',
  FILE = 'FILE',
  MAIN_FILE = 'MAIN_FILE',
  PAGE_HISTORY = 'PAGE_HISTORY',
  USER_CONTRIBUTIONS = 'USER_CONTRIBUTIONS',
}

export interface DiffTabData {
  wikiId: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export interface ReadTabData {
  wikiId: string;
  pageTitle: string;
  revisionId: number;
  redirect: boolean;
}

export interface FileTabData {
  wikiId: string;
  pageId: number;
}

export interface PageHistoryTabData {
  wikiId: string;
  pageId: number;
}

export interface UserContributionsTabData {
  wikiId: string;
  actorId: number;
}
