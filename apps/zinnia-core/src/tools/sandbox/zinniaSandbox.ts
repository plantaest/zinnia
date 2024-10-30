import { cloneFactory } from '@/tools/utils/cloneFactory';
import { cloneMwMap } from '@/tools/utils/cloneMwMap';
import { Notice } from '@/utils/Notice';
import { i18n } from '@/i18n';
import { appConfig } from '@/config/appConfig';

interface ZinniaSandbox {
  mw: typeof mediaWiki;
  location: Location;
  $: typeof jQuery;
}

declare global {
  interface Window {
    zinniaSandbox: ZinniaSandbox;
    zsb: ZinniaSandbox;
  }
}

// Modify `mw`
const modifiedMw = {
  ...mw,
  config: cloneMwMap(mw.config),
  Api: cloneFactory(mw.Api),
};

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

// Modify `location`
const modifiedLocation = {
  ...window.location,
  reload: () => Notice.info(i18n.getIntl().formatMessage({ id: 'tool.message.reloadDisabled' })),
};

export const zinniaSandbox: ZinniaSandbox = {
  mw: modifiedMw,
  location: modifiedLocation,
  $: jQuery,
};

window.zinniaSandbox = zinniaSandbox;
window.zsb = zinniaSandbox;
