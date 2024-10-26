import { PageHtmlResult } from './type/PageHtmlResult';
import { InternalWiki } from './Wiki';
import { CompositeError } from './CompositeError';
import { RestGetPageWithHtmlResponse } from './type/rest/RestGetPageWithHtmlResponse';
import { RestErrorResponse } from './type/rest/RestErrorResponse';
import { Revision } from './type/Revision';
import { MwApiWrapper } from './MwApiWrapper';

export interface Page {
  title: () => string;
  html: () => Promise<PageHtmlResult>;
  revisions: (limit: number) => Promise<Revision[]>;
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
      throw new CompositeError(error.errorKey ?? error.httpReason, JSON.stringify(error));
    }

    const result: RestGetPageWithHtmlResponse = await response.json();

    return {
      title: result.title,
      pageId: result.id,
      revisionId: result.latest.id,
      html: result.html,
    };
  }

  public async revisions(limit: number): Promise<Revision[]> {
    const params = {
      formatversion: 2,
      action: 'query',
      prop: 'revisions',
      titles: this._title,
      rvprop: 'ids|flags|timestamp|user|size|sha1|comment|parsedcomment|tags',
      rvlimit: limit + 1,
    };

    const response = await MwApiWrapper.of(this.wiki.mwApi().get(params)).then();
    const pages = response.query.pages;

    // When the page was deleted:
    // [
    //   {
    //     "ns": 0,
    //     "title": "S.T Sơn Thạch",
    //     "missing": true
    //   }
    // ]
    if (pages.length === 1 && 'revisions' in response.query.pages[0]) {
      const revisions: Revision[] = response.query.pages[0].revisions.map(
        (r: any) =>
          ({
            revisionId: r.revid,
            parentId: r.parentid,
            minor: r.minor,
            userHidden: r.userhidden ?? false,
            user: r.user,
            anon: r.anon ?? false,
            timestamp: r.timestamp,
            size: r.size,
            parentSize: -1,
            sha1Hidden: r.sha1hidden ?? false,
            sha1: r.sha1,
            commentHidden: r.commenthidden ?? false,
            comment: r.comment,
            parsedComment: r.parsedcomment,
            tags: r.tags,
          }) as Revision
      );

      // Ref: https://en.wikipedia.org/wiki/User:Ingenuity/AntiVandal.js#L-1501
      for (let i = 0; i < Math.min(limit, revisions.length); i++) {
        if (i + 1 < revisions.length) {
          revisions[i].parentSize = revisions[i + 1].size;
        } else {
          // New page
          revisions[i].parentSize = 0;
        }
      }

      return revisions.slice(0, limit);
    }

    return [];
  }
}
