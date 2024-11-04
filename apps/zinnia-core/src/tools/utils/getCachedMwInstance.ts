import { createModifiedMw } from '@/tools/sandbox/createModifiedMw';
import { WikiId } from '@/types/mw/WikiId';
import { wikis } from '@/utils/wikis';
import { zinniaSandbox } from '@/tools/sandbox/zinniaSandbox';

export function getCachedMwInstance(wikiId: WikiId) {
  const cachedMwInstances = zinniaSandbox.cachedMwInstances;
  // TODO: Refactor
  const serverName = wikis.getWiki(wikiId).getConfig().serverName;

  let mwInstance;

  if (cachedMwInstances.has(wikiId)) {
    mwInstance = cachedMwInstances.get(wikiId)!;
  } else {
    cachedMwInstances.set(wikiId, createModifiedMw({ wikiId, serverName }));
    mwInstance = cachedMwInstances.get(wikiId)!;
  }

  return mwInstance;
}
