import { OresConfig } from '../type/misc/OresConfig';

export interface WikiSite {
  wikiId: string;
  serverName: string;
  language: string;
  ores?: OresConfig;
}
