import { PageHtmlResult } from './type/PageHtmlResult';
import { InternalWiki } from './Wiki';
import { AsterError } from './AsterError';
import { RestGetPageWithHtmlResponse } from './type/rest/RestGetPageWithHtmlResponse';
import { RestErrorResponse } from './type/rest/RestErrorResponse';

export interface Page {
  title: () => string;
  html: () => Promise<PageHtmlResult>;
}

export class InternalPage implements Page {
  private readonly wiki: InternalWiki;
  private readonly _title: string;

  public constructor(wiki: InternalWiki, title: string) {
    this.wiki = wiki;
    this._title = title;
  }

  public title(): string {
    return this._title;
  }

  public async html(): Promise<PageHtmlResult> {
    // Ref: https://www.mediawiki.org/wiki/API:REST_API/Reference#Get_page_offline
    const url = `//${this.wiki.getConfig().serverName}/w/rest.php/v1/page/${encodeURIComponent(this.title())}/with_html?redirect=no`;

    const response = await fetch(url);

    if (!response.ok) {
      const error: RestErrorResponse = await response.json();
      throw new AsterError(error.errorKey ?? error.httpReason, JSON.stringify(error));
    }

    const result: RestGetPageWithHtmlResponse = await response.json();

    return {
      title: result.title,
      pageId: result.id,
      revisionId: result.latest.id,
      html: result.html,
    };
  }
}
