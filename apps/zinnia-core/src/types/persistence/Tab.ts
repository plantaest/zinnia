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
  FILE = 'FILE',
  MAIN_FILE = 'MAIN_FILE',
  PAGE = 'PAGE',
  USER = 'USER',
}

export interface DiffTabData {
  wikiId: string;
  pageTitle: string;
  fromRevisionId: number;
  toRevisionId: number;
}

export interface ReadTabData {
  wikiId: string;
  pageTitle: string;
  redirect: boolean;
}

export interface FileTabData {
  wikiId: string;
  pageTitle: string;
}

export interface PageTabData {
  wikiId: string;
  pageTitle: string;
}

export interface UserTabData {
  wikiId: string;
  username: number;
}
