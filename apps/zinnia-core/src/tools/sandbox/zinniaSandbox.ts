import { createModifiedLocation } from '@/tools/sandbox/createModifiedLocation';
import { createModifiedMw } from '@/tools/sandbox/createModifiedMw';

declare global {
  interface Window {
    zinniaSandbox: ZinniaSandbox;
    zsb: ZinniaSandbox;
  }
}

interface ZinniaSandbox {
  mw: typeof mediaWiki;
  location: Location;
  $: typeof jQuery;
}

export const zinniaSandbox: ZinniaSandbox = {
  mw: createModifiedMw({ serverName: mw.config.get('wgServerName') }),
  location: createModifiedLocation(),
  $: jQuery,
};

window.zinniaSandbox = zinniaSandbox;
window.zsb = zinniaSandbox;
