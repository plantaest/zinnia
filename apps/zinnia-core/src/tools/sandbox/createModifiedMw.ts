import { cloneMwMap } from '@/tools/utils/cloneMwMap';
import { cloneMwApi } from '@/tools/utils/cloneMwApi';
import { appConfig } from '@/config/appConfig';

interface Options {
  serverName: string;
}

export function createModifiedMw(options: Options): typeof mediaWiki {
  // Ignore warning on Console: Use of "jqueryMsg" is deprecated. mw.jqueryMsg is a @private library.
  // @ts-ignore
  delete mw.jqueryMsg;

  const modifiedMw: typeof mediaWiki = {
    ...mw,
    config: cloneMwMap(mw.config),
    Api: cloneMwApi(mw.ForeignApi, options.serverName),
    util: { ...mw.util },
  };

  // Override `mw.util.addPortletLink`
  // Ref: https://doc.wikimedia.org/mediawiki-core/REL1_29/js/#!/api/mw.util-method-addPortletLink
  const originalAddPortletLink = modifiedMw.util.addPortletLink;
  modifiedMw.util.addPortletLink = (...args) => {
    const [portletId, ...rest] = args;
    const newPortletId = `zsb-${portletId}`;
    return originalAddPortletLink(newPortletId, ...rest);
  };

  // Override `mw.Api.postWithToken`
  // Ref: https://doc.wikimedia.org/mediawiki-core/REL1_29/js/#!/api/mw.Api-method-postWithToken
  const originalPostWithToken = modifiedMw.Api.prototype.postWithToken;
  modifiedMw.Api.prototype.postWithToken = function postWithToken(...args) {
    const [, params] = args;

    if (params.action === 'edit') {
      params.summary = params.summary
        ? [params.summary, appConfig.SUMMARY_MARK].join(' ')
        : appConfig.SUMMARY_MARK;
    }

    return originalPostWithToken.apply(this, args);
  };

  return modifiedMw;
}
