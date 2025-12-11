import { WikiHelper } from '@plantaest/composite';
import { cloneMwMap } from '@/tools/utils/cloneMwMap';
import { cloneMwApi } from '@/tools/utils/cloneMwApi';
import { appConfig } from '@/config/appConfig';
import { zmw } from '@/utils/zmw';
import { WikiId } from '@/types/mw/WikiId';
import { WikiServerName } from '@/types/mw/WikiServerName';

interface Options {
  wikiId: WikiId;
  serverName: WikiServerName;
}

const addMark = (comment: unknown) =>
  comment ? [comment, appConfig.COMMENT_MARK].join(' ') : appConfig.COMMENT_MARK;

export function createModifiedMw(options: Options): typeof mediaWiki {
  const modifiedMw: typeof mediaWiki = {
    ...zmw,
    // @ts-ignore
    config: cloneMwMap(zmw.config),
    Api: cloneMwApi(zmw.ForeignApi, WikiHelper.createActionApiUri(options.serverName)),
    util: { ...zmw.util },
  };

  // TODO: Refactor: Fetch wiki info on demand
  // Reset mw.config
  modifiedMw.config.set('wgWikiID', options.wikiId);
  modifiedMw.config.set('wgDBname', options.wikiId);
  modifiedMw.config.set('wgServerName', options.serverName);

  // Override `mw.util.addPortletLink`
  // Ref: https://doc.wikimedia.org/mediawiki-core/REL1_29/js/#!/api/mw.util-method-addPortletLink
  const originalAddPortletLink = modifiedMw.util.addPortletLink;
  modifiedMw.util.addPortletLink = (...args) => {
    const [portletId, href, text, id, ...rest] = args;
    const newPortletId = `zsb-${portletId}`;
    const newId = id || text; // Some user-scripts don't have an id !?
    return originalAddPortletLink(newPortletId, href, text, newId, ...rest);
  };

  // Override `mw.Api.postWithToken`
  // Ref: https://doc.wikimedia.org/mediawiki-core/REL1_29/js/#!/api/mw.Api-method-postWithToken
  const originalPostWithToken = modifiedMw.Api.prototype.postWithToken;
  modifiedMw.Api.prototype.postWithToken = function postWithToken(...args) {
    const [, params] = args;

    if (params.action === 'edit') {
      params.summary = addMark(params.summary);
    }

    if (params.action === 'delete') {
      params.reason = addMark(params.reason);
    }

    return originalPostWithToken.apply(this, args);
  };

  return modifiedMw;
}
