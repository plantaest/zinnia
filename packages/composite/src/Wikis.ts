import { WikisConfig } from './WikisConfig';
import { Wiki } from './Wiki';
import { WikiSites } from './helper/WikiSites';
import { CompositeError } from './CompositeError';
import { WikiConfig } from './WikiConfig';

export class Wikis {
  private readonly config: WikisConfig;
  private readonly wikis: Map<string, Wiki>;
  private readonly wikiSites: WikiSites;

  private constructor(config: WikisConfig) {
    this.config = config;
    this.wikis = new Map();
    this.wikiSites = new WikiSites(config.wikis);
  }

  public static init(config: WikisConfig): Wikis {
    return new Wikis(config);
  }

  public getWikiSites(): WikiSites {
    return this.wikiSites;
  }

  public getWiki(wikiId: string): Wiki {
    if (!this.wikiSites.getWikiIds().includes(wikiId)) {
      throw new CompositeError('not-supported-wiki', `Wiki ${wikiId} is not supported`);
    }

    if (this.wikis.has(wikiId)) {
      return this.wikis.get(wikiId)!;
    }

    const wikiSite = this.wikiSites.getWikis().get(wikiId)!;

    const wikiConfig: WikiConfig = {
      apiUserAgent: this.config.apiUserAgent,
      wikiId: wikiId,
      serverName: wikiSite.serverName,
      language: wikiSite.language,
      ores: wikiSite.ores,
    };

    // TODO: Expand to ExternalWiki
    const wiki = Wiki.initInternal(wikiConfig);
    this.wikis.set(wikiId, wiki);

    return wiki;
  }
}
