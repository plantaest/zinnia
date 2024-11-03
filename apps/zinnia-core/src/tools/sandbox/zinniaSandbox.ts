import { ToolId } from '@/tools/types/ToolId';
import { createModifiedLocation } from '@/tools/sandbox/createModifiedLocation';
import { getCachedMwInstance } from '@/tools/utils/getCachedMwInstance';
import { zmw } from '@/utils/zmw';
import { WikiId } from '@/types/mw/WikiId';
import { wikiSiteIds } from '@/utils/wikis';

interface ZinniaSandbox {
  globals: Map<ToolId, SandboxGlobals>;
  cachedMwInstances: Map<WikiId, typeof mediaWiki>;
}

interface SandboxGlobals {
  mw: typeof mediaWiki;
  location: Location;
  $: typeof jQuery;
}

export const zinniaSandbox: ZinniaSandbox = {
  globals: new Map(),
  cachedMwInstances: new Map(),
};

window.zinniaSandbox = zinniaSandbox;
window.zsb = zinniaSandbox;

const currentWikiId = zmw.config.get('wgWikiID');
const initialWikiId = wikiSiteIds.includes(currentWikiId) ? currentWikiId : 'metawiki';

export const defaultSandboxGlobals: SandboxGlobals = {
  mw: getCachedMwInstance(initialWikiId),
  location: createModifiedLocation(),
  $: jQuery,
};
