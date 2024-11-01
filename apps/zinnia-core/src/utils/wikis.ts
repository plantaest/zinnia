import { Wikis, WikisConfig, WikiSite } from '@plantaest/composite';
import { appConfig } from '@/config/appConfig';

// Ref: https://wikitech.wikimedia.org/wiki/Machine_Learning/LiftWing#Current_Inference_Services
export const wikiSites: WikiSite[] = [
  {
    wikiId: 'enwiki',
    serverName: 'en.wikipedia.org',
    language: 'en',
    oresSupport: 'integrated',
    oresAntiVandalModel: 'damaging',
  },
  {
    wikiId: 'viwiki',
    serverName: 'vi.wikipedia.org',
    language: 'vi',
    oresSupport: 'basic',
    oresAntiVandalModel: 'reverted',
  },
  {
    wikiId: 'viwiktionary',
    serverName: 'vi.wiktionary.org',
    language: 'vi',
    oresSupport: 'none',
    oresAntiVandalModel: null,
  },
  {
    wikiId: 'frwiki',
    serverName: 'fr.wikipedia.org',
    language: 'fr',
    oresSupport: 'integrated',
    oresAntiVandalModel: 'damaging',
  },
  {
    wikiId: 'jawiki',
    serverName: 'ja.wikipedia.org',
    language: 'ja',
    oresSupport: 'basic',
    oresAntiVandalModel: 'damaging',
  },
  {
    wikiId: 'hewiki',
    serverName: 'he.wikipedia.org',
    language: 'he',
    oresSupport: 'integrated',
    oresAntiVandalModel: 'damaging',
  },
  {
    wikiId: 'metawiki',
    serverName: 'meta.wikimedia.org',
    language: 'en',
    oresSupport: 'none',
    oresAntiVandalModel: null,
  },
  {
    wikiId: 'commonswiki',
    serverName: 'commons.wikimedia.org',
    language: 'en',
    oresSupport: 'none',
    oresAntiVandalModel: null,
  },
];

export const wikiSiteIds = wikiSites.map((wikiSite) => wikiSite.wikiId);

const wikisConfig: WikisConfig = {
  apiUserAgent: appConfig.API_USER_AGENT,
  wikis: wikiSites,
};

export const wikis = Wikis.init(wikisConfig);

export const metaWiki = wikis.getWiki('metawiki');
