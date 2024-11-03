import { OresConfig } from './type/misc/OresConfig';

export interface WikiConfig {
  apiUserAgent: string;
  wikiId: string;
  serverName: string;
  language: string;
  ores?: OresConfig;
}
