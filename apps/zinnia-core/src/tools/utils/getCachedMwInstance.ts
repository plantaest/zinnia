import { WikiServerName } from '@/types/mw/WikiServerName';
import { createModifiedMw } from '@/tools/sandbox/createModifiedMw';

export function getCachedMwInstance(serverName: WikiServerName) {
  const cachedMwInstances = window.zinniaSandbox.cachedMwInstances;

  let mwInstance;

  if (cachedMwInstances.has(serverName)) {
    mwInstance = cachedMwInstances.get(serverName)!;
  } else {
    cachedMwInstances.set(serverName, createModifiedMw({ serverName: serverName }));
    mwInstance = cachedMwInstances.get(serverName)!;
  }

  return mwInstance;
}
