import { OresScores } from './action/ApiChangeResponse';

export interface Change {
  wikiId: string;
  type: 'edit' | 'new' | 'categorize' | 'log' | 'external';
  title: string;
  revisionId: number;
  oldRevisionId: number;
  recentChangeId: number;
  user: string;
  anon: boolean;
  bot: boolean;
  new: boolean;
  minor: boolean;
  oldLength: number;
  newLength: number;
  timestamp: string;
  parsedComment: string;
  redirect: boolean;
  patrolled: boolean | null;
  unpatrolled: boolean | null;
  autopatrolled: boolean | null;
  oresScores: OresScores | null;
  logId: number | null;
  logType: string | null;
  logAction: string | null;
  logParams: Record<string, any> | null;
}
