import { WikiSite } from './WikiSite';

export class WikiSites {
  private readonly wikiIds: string[];
  private readonly wikis: Map<string, WikiSite>;

  public constructor(wikis: WikiSite[]) {
    this.wikiIds = wikis.map((wiki) => wiki.wikiId);
    this.wikis = new Map(wikis.map((wiki) => [wiki.wikiId, wiki]));
  }

  public getWikiIds(): string[] {
    return this.wikiIds;
  }

  public getWikis(): Map<string, WikiSite> {
    return this.wikis;
  }
}
