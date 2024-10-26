import { OresSupport } from '../type/misc/OresSupport';
import { OresAntiVandalModel } from '../type/misc/OresAntiVandalModel';

export interface WikiSite {
  wikiId: string;
  serverName: string;
  language: string;
  oresSupport: OresSupport;
  oresAntiVandalModel: OresAntiVandalModel | null;
}
