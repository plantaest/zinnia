import { UserContribution } from './type/UserContribution';
import { InternalWiki } from './Wiki';
import { MwApiWrapper } from './MwApiWrapper';

export interface User {
  username: () => string;
  contribs: (limit: number) => Promise<UserContribution[]>;
}

export class InternalUser implements User {
  private readonly wiki: InternalWiki;
  private readonly _username: string;

  public constructor(wiki: InternalWiki, username: string) {
    this.wiki = wiki;
    this._username = username;
  }

  public username(): string {
    return this._username;
  }

  public async contribs(limit: number): Promise<UserContribution[]> {
    const params = {
      formatversion: 2,
      action: 'query',
      list: 'usercontribs',
      ucuser: this._username,
      uclimit: limit,
      ucprop: 'ids|title|timestamp|comment|parsedcomment|size|sizediff|flags|tags',
    };

    const response = await MwApiWrapper.of(this.wiki.mwApi().get(params)).then();

    return response.query.usercontribs.map(
      (uc: any) =>
        ({
          userId: uc.userid,
          user: uc.user,
          pageId: uc.pageid,
          revisionId: uc.revid,
          parentId: uc.parentid,
          namespace: uc.ns,
          title: uc.title,
          timestamp: uc.timestamp,
          new: uc.new,
          minor: uc.minor,
          top: uc.top,
          comment: uc.comment,
          parsedComment: uc.parsedcomment,
          size: uc.size,
          sizeDiff: uc.sizediff,
          tags: uc.tags,
        }) as UserContribution
    );
  }
}
