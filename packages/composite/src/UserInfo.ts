import { InternalWiki } from './Wiki';
import { MwApiWrapper } from './MwApiWrapper';

export interface UserInfo {
  getOption: (name: string) => Promise<unknown>;
  saveOption: (name: string, value: string | null) => Promise<void>;
  getRights: () => Promise<string[]>;
}

export class InternalUserInfo implements UserInfo {
  private readonly wiki: InternalWiki;

  public constructor(wiki: InternalWiki) {
    this.wiki = wiki;
  }

  public async getOption(name: string): Promise<unknown> {
    const params = {
      formatversion: 2,
      action: 'query',
      meta: 'userinfo',
      uiprop: 'options',
    };

    const response = await MwApiWrapper.of(this.wiki.mwApi().get(params)).then();

    return response.query.userinfo.options[name] ?? null;
  }

  public async saveOption(name: string, value: string | null): Promise<void> {
    await MwApiWrapper.of(this.wiki.mwApi().saveOption(name, value)).then();
  }

  public async getRights(): Promise<string[]> {
    const params = {
      formatversion: 2,
      action: 'query',
      meta: 'userinfo',
      uiprop: 'rights',
    };

    const response = await MwApiWrapper.of(this.wiki.mwApi().get(params)).then();

    return response.query.userinfo.rights;
  }
}
