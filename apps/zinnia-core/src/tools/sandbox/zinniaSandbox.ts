import { ToolId } from '@/tools/types/ToolId';
import { createModifiedLocation } from '@/tools/sandbox/createModifiedLocation';
import { getCachedMwInstance } from '@/tools/utils/getCachedMwInstance';
import { WikiServerName } from '@/types/mw/WikiServerName';
import { zmw } from '@/utils/zmw';
import { createModifiedWindow } from '@/tools/sandbox/createModifiedWindow';

interface ZinniaSandbox {
  globals: Map<ToolId, SandboxGlobals>;
  cachedMwInstances: Map<WikiServerName, typeof mediaWiki>;
}

interface SandboxGlobals {
  mw: typeof mediaWiki;
  location: Location;
  $: typeof jQuery;
  window: Window;
}

export const zinniaSandbox: ZinniaSandbox = {
  globals: new Map(),
  cachedMwInstances: new Map(),
};

window.zinniaSandbox = zinniaSandbox;
window.zsb = zinniaSandbox;

export const defaultSandboxGlobals: SandboxGlobals = {
  mw: getCachedMwInstance(zmw.config.get('wgServerName')),
  location: createModifiedLocation(),
  $: jQuery,
  window: createModifiedWindow(),
};
