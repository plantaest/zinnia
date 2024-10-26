import { InternalWiki } from './Wiki';
import { MwApiWrapper } from './MwApiWrapper';
import { Namespace } from './type/Namespace';

export interface SiteInfo {
  getNamespaces: () => Promise<Namespace[]>;
}

export class InternalSiteInfo implements SiteInfo {
  private readonly wiki: InternalWiki;

  public constructor(wiki: InternalWiki) {
    this.wiki = wiki;
  }

  public async getNamespaces(): Promise<Namespace[]> {
    const params = {
      formatversion: 2,
      action: 'query',
      meta: 'siteinfo',
      siprop: 'namespaces',
    };

    const response = await MwApiWrapper.of(this.wiki.mwApi().get(params)).then();

    return Object.values(response.query.namespaces).map((ns: any) => ({
      id: ns.id,
      name: ns.name,
    }));
  }
}
