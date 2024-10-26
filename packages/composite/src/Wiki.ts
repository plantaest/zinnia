import { WikiConfig } from './WikiConfig';
import { InternalUserInfo, UserInfo } from './UserInfo';
import { WikiHelper } from './helper/WikiHelper';
import { InternalSiteInfo, SiteInfo } from './SiteInfo';
import { MwApiWrapper } from './MwApiWrapper';
import { Tag } from './type/Tag';
import { Change } from './type/Change';
import { ApiQueryRecentChangesParams } from 'types-mediawiki/api_params';
import { CompareRevisionsResult } from './type/CompareRevisionsResult';
import { DiffType } from './type/DiffType';
import { InternalPage, Page } from './Page';
import { ApiChangeResponse } from './type/action/ApiChangeResponse';
import { InternalUser, User } from './User';

export abstract class Wiki {
  protected readonly config: WikiConfig;

  protected constructor(config: WikiConfig) {
    this.config = config;
  }

  public static initInternal(config: WikiConfig): Wiki {
    return new InternalWiki(config);
  }

  public getConfig() {
    return this.config;
  }

  public abstract userInfo(): UserInfo;

  public abstract siteInfo(): SiteInfo;

  public abstract getTags(): Promise<Tag[]>;

  public abstract getRecentChanges(
    queryParams: ApiQueryRecentChangesParams,
    options?: {
      hasPatrolRight: boolean;
    }
  ): Promise<Change[]>;

  public abstract compareRevisions(
    fromRevisionId: number,
    toRevisionId: number,
    diffType: DiffType
  ): Promise<CompareRevisionsResult>;

  public abstract page(title: string): Page;

  public abstract user(username: string): User;
}

export class InternalWiki extends Wiki {
  private readonly mwApiInstance: mw.ForeignApi;
  private readonly userInfoInstance: UserInfo;
  private readonly siteInfoInstance: SiteInfo;

  public constructor(config: WikiConfig) {
    super(config);
    this.mwApiInstance =
      typeof mw === 'object'
        ? new mw.ForeignApi(WikiHelper.createActionApiUri(config.serverName))
        : ({} as mw.ForeignApi);
    this.userInfoInstance = new InternalUserInfo(this);
    this.siteInfoInstance = new InternalSiteInfo(this);
  }

  public mwApi(): mw.ForeignApi {
    return this.mwApiInstance;
  }

  public override userInfo(): UserInfo {
    return this.userInfoInstance;
  }

  public override siteInfo(): SiteInfo {
    return this.siteInfoInstance;
  }

  public override async getTags(): Promise<Tag[]> {
    const params = {
      formatversion: 2,
      action: 'query',
      list: 'tags',
      tglimit: 'max',
      tgprop: ['displayname'],
    };

    const response = await MwApiWrapper.of(this.mwApi().get(params)).then();

    return response.query.tags.map((t: any) => ({
      name: t.name,
      displayName: t.displayname || null,
    }));
  }

  public override async getRecentChanges(
    queryParams: ApiQueryRecentChangesParams,
    options: { hasPatrolRight: boolean } = {
      hasPatrolRight: false,
    }
  ): Promise<Change[]> {
    const props = [
      'user',
      'userid',
      'parsedcomment',
      'flags',
      'timestamp',
      'title',
      'ids',
      'sizes',
      'redirect',
      'loginfo',
    ];

    if (options.hasPatrolRight) {
      props.push('patrolled');
    }

    if (this.config.oresSupport === 'integrated') {
      props.push('oresscores');
    }

    const params = {
      formatversion: 2,
      action: 'query',
      list: 'recentchanges',
      rcprop: props,
      ...queryParams,
      rcshow: options.hasPatrolRight
        ? queryParams.rcshow!
        : Array.isArray(queryParams.rcshow)
          ? queryParams.rcshow.filter(
              (i) => !['unpatrolled', 'patrolled', 'autopatrolled'].includes(i)
            )
          : [],
    };

    const response = await MwApiWrapper.of(this.mwApi().get(params)).then();

    return (response.query.recentchanges as ApiChangeResponse[]).map((rawChange) => ({
      wikiId: this.config.wikiId,
      type: rawChange.type,
      title: rawChange.title,
      revisionId: rawChange.revid,
      oldRevisionId: rawChange.old_revid,
      recentChangeId: rawChange.rcid,
      user: rawChange.user,
      anon: rawChange.anon ?? false,
      bot: rawChange.bot,
      new: rawChange.new,
      minor: rawChange.minor,
      oldLength: rawChange.oldlen,
      newLength: rawChange.newlen,
      timestamp: rawChange.timestamp,
      parsedComment: rawChange.parsedcomment,
      redirect: rawChange.redirect,
      patrolled: rawChange.patrolled ?? null,
      unpatrolled: rawChange.unpatrolled ?? null,
      autopatrolled: rawChange.autopatrolled ?? null,
      oresScores:
        rawChange.type === 'edit' || rawChange.type === 'new'
          ? rawChange.oresscores && !Array.isArray(rawChange.oresscores)
            ? rawChange.oresscores
            : null
          : null,
      logId: rawChange.type === 'log' ? rawChange.logid : null,
      logType: rawChange.type === 'log' ? rawChange.logtype : null,
      logAction: rawChange.type === 'log' ? rawChange.logaction : null,
      logParams: rawChange.type === 'log' ? rawChange.logparams : null,
    }));
  }

  public override async compareRevisions(
    fromRevisionId: number,
    toRevisionId: number,
    diffType: DiffType
  ): Promise<CompareRevisionsResult> {
    const params = {
      formatversion: 2,
      action: 'compare',
      fromrev: fromRevisionId,
      torev: toRevisionId,
      prop: ['diff', 'diffsize', 'rel', 'ids', 'title', 'user', 'comment', 'size', 'timestamp'],
      difftype: diffType,
    };

    const response = await MwApiWrapper.of(this.mwApi().get(params)).then();

    return {
      fromId: response.compare.fromid,
      fromRevisionId: response.compare.fromrevid,
      fromNs: response.compare.fromns,
      fromTitle: response.compare.fromtitle,
      fromSize: response.compare.fromsize,
      fromTimestamp: response.compare.fromtimestamp,
      fromUser: response.compare.fromuser,
      fromUserId: response.compare.fromuserid,
      fromComment: response.compare.fromcomment || null,
      fromParsedComment: response.compare.fromparsedcomment || null,
      toId: response.compare.toid,
      toRevisionId: response.compare.torevid,
      toNs: response.compare.tons,
      toTitle: response.compare.totitle,
      toSize: response.compare.tosize,
      toTimestamp: response.compare.totimestamp,
      toUser: response.compare.touser,
      toUserId: response.compare.touserid,
      toComment: response.compare.tocomment || null,
      toParsedComment: response.compare.toparsedcomment || null,
      prev: response.compare.prev,
      next: response.compare.next,
      diffSize: response.compare.diffsize,
      body: response.compare.body,
    };
  }

  public override page(title: string): Page {
    return new InternalPage(this, title);
  }

  public override user(username: string): User {
    return new InternalUser(this, username);
  }
}
