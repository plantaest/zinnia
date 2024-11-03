import { Wikis, WikisConfig, WikiSite } from '@plantaest/composite';
import { appConfig } from '@/config/appConfig';

// Ref: https://wikitech.wikimedia.org/wiki/Machine_Learning/LiftWing#Current_Inference_Services
export const wikiSites: WikiSite[] = [
  {
    wikiId: 'enwiki',
    serverName: 'en.wikipedia.org',
    language: 'en',
    ores: {
      support: 'integrated',
      model: 'damaging',
    },
  },
  {
    wikiId: 'viwiki',
    serverName: 'vi.wikipedia.org',
    language: 'vi',
    ores: {
      support: 'basic',
      model: 'reverted',
    },
  },
  {
    wikiId: 'viwiktionary',
    serverName: 'vi.wiktionary.org',
    language: 'vi',
  },
  {
    wikiId: 'frwiki',
    serverName: 'fr.wikipedia.org',
    language: 'fr',
    ores: {
      support: 'integrated',
      model: 'damaging',
    },
  },
  {
    wikiId: 'jawiki',
    serverName: 'ja.wikipedia.org',
    language: 'ja',
    ores: {
      support: 'basic',
      model: 'damaging',
    },
  },
  {
    wikiId: 'hewiki',
    serverName: 'he.wikipedia.org',
    language: 'he',
    ores: {
      support: 'integrated',
      model: 'damaging',
    },
  },
  {
    wikiId: 'metawiki',
    serverName: 'meta.wikimedia.org',
    language: 'en',
  },
  {
    wikiId: 'commonswiki',
    serverName: 'commons.wikimedia.org',
    language: 'en',
  },
];

export const wikiSiteIds = wikiSites.map((wikiSite) => wikiSite.wikiId);

const wikisConfig: WikisConfig = {
  apiUserAgent: appConfig.API_USER_AGENT,
  wikis: wikiSites,
};

export const wikis = Wikis.init(wikisConfig);

export const metaWiki = wikis.getWiki('metawiki');
