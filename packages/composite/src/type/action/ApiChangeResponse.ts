export type ApiChangeResponse =
  | ApiEditChangeResponse
  | ApiNewPageChangeResponse
  | ApiCategoryChangeResponse
  | ApiLogActionChangeResponse
  | ApiExternalChangeResponse;

interface ApiEditChangeResponse {
  type: 'edit';
  ns: number;
  title: string;
  pageid: number;
  revid: number;
  old_revid: number;
  rcid: number;
  user: string;
  userid: number;
  anon?: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldlen: number;
  newlen: number;
  timestamp: string;
  parsedcomment: string;
  redirect: boolean;
  patrolled?: boolean;
  unpatrolled?: boolean;
  autopatrolled?: boolean;
  oresscores?: [] | OresScores;
}

interface ApiNewPageChangeResponse {
  type: 'new';
  ns: number;
  title: string;
  pageid: number;
  revid: number;
  old_revid: 0;
  rcid: number;
  user: string;
  userid: number;
  anon?: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldlen: number;
  newlen: number;
  timestamp: string;
  parsedcomment: string;
  redirect: boolean;
  patrolled?: boolean;
  unpatrolled?: boolean;
  autopatrolled?: boolean;
  oresscores?: [] | OresScores;
}

interface ApiCategoryChangeResponse {
  type: 'categorize';
  ns: number;
  title: string;
  pageid: number;
  revid: number;
  old_revid: number;
  rcid: number;
  user: string;
  userid: number;
  anon?: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldlen: number;
  newlen: number;
  timestamp: string;
  parsedcomment: string;
  redirect: boolean;
  patrolled?: boolean;
  unpatrolled?: boolean;
  autopatrolled?: boolean;
}

interface ApiLogActionChangeResponse {
  type: 'log';
  ns: number;
  title: string;
  pageid: number;
  revid: number;
  old_revid: number;
  rcid: number;
  user: string;
  userid: number;
  anon?: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldlen: number;
  newlen: number;
  timestamp: string;
  parsedcomment: string;
  redirect: boolean;
  patrolled?: boolean;
  unpatrolled?: boolean;
  autopatrolled?: boolean;
  logid: number;
  logtype: string;
  logaction: string;
  logparams: Record<string, any>;
}

interface ApiExternalChangeResponse {
  type: 'external';
  ns: number;
  title: string;
  pageid: number;
  revid: number;
  old_revid: number;
  rcid: number;
  user: string;
  userid: number;
  anon?: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldlen: number;
  newlen: number;
  timestamp: string;
  parsedcomment: string;
  redirect: boolean;
  patrolled?: boolean;
  unpatrolled?: boolean;
  autopatrolled?: boolean;
}

export type OresScores = Record<OresModelName, Record<OresModelClass, number>>;

type OresModelName =
  | 'reverted'
  | 'damaging'
  | 'goodfaith'
  | 'articlequality'
  | 'draftquality'
  | 'articletopic'
  | 'drafttopic';

type OresModelClass = 'true' | 'false' | string;
