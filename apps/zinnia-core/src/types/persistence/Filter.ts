import { Instant } from '@/types/lang/Instant';
import { Period } from '@/types/lang/Period';
import { WikiId } from '@/types/mw/WikiId';

export interface Filter {
  id: string;
  createdAt: Instant;
  updatedAt: Instant;
  name: string;
  feed: FilterFeedConfig;
  wikis: FilterWiki[];
}

interface FilterFeedConfig {
  liveUpdates: boolean;
  paginated: boolean;
  groupedByPage: boolean;
  invertedDirection: boolean;
  smallWikis: boolean;
  additionalWikis: boolean;
  limit: number;
  interval: number;
  timeframe: {
    start: 'now' | Instant;
    end: Period | Instant;
  };
}

type FilterWiki =
  | {
      wikiId: WikiId;
      inherited: true;
      config: null;
    }
  | {
      wikiId: 'global' | WikiId;
      inherited: false;
      config: FilterWikiConfig;
    };

interface FilterWikiConfig {
  selectedNamespaces: string[];
  selectedTags: string[];
  pageTitle: string | null;
  username: string | null;
  unregistered: boolean;
  registered: boolean;
  bot: boolean;
  human: boolean;
  unpatrolled: boolean;
  patrolled: boolean;
  autopatrolled: boolean;
  minorEdits: boolean;
  nonMinorEdits: boolean;
  redirect: boolean;
  nonRedirect: boolean;
  latestRevision: boolean;
  pageEdits: boolean;
  pageCreations: boolean;
  categoryChanges: boolean;
  loggedActions: boolean;
  wikidataEdits: boolean;
}

export const defaultFilterFeedConfig = Object.freeze<FilterFeedConfig>({
  liveUpdates: false,
  paginated: false,
  groupedByPage: false,
  invertedDirection: false,
  smallWikis: false,
  additionalWikis: false,
  limit: 25,
  interval: 5,
  timeframe: {
    start: 'now',
    end: 'P7D', // 7 days
  },
});

export const defaultFilterGlobalWikiConfig = Object.freeze<FilterWiki>({
  wikiId: 'global',
  inherited: false,
  config: {
    selectedNamespaces: [],
    selectedTags: [],
    pageTitle: null,
    username: null,
    unregistered: true,
    registered: true,
    bot: false,
    human: true,
    unpatrolled: true,
    patrolled: true,
    autopatrolled: true,
    minorEdits: true,
    nonMinorEdits: true,
    redirect: true,
    nonRedirect: true,
    latestRevision: false,
    pageEdits: true,
    pageCreations: true,
    categoryChanges: false,
    loggedActions: false,
    wikidataEdits: false,
  },
});
