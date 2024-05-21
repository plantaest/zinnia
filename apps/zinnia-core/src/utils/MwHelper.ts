import { underscoreTitle } from '@/utils/underscoreTitle';

export namespace MwHelper {
  export const createPageUri = (serverName: string, pageTitle: string) =>
    `//${serverName}/wiki/${underscoreTitle(pageTitle)}`;

  export const createLogPageUri = (serverName: string, pageTitle: string) =>
    `//${serverName}/wiki/Special:Log?page=${underscoreTitle(pageTitle)}`;

  export const createLogUserUri = (serverName: string, pageTitle: string) =>
    `//${serverName}/wiki/Special:Log?user=${underscoreTitle(pageTitle)}`;

  export const createUserContribUri = (serverName: string, username: string) =>
    `//${serverName}/wiki/Special:Contributions/${underscoreTitle(username)}`;

  export const createWikidataItemUri = (wikiId: string, pageTitle: string) =>
    `//www.wikidata.org/wiki/Special:ItemByTitle?site=${wikiId}&page=${underscoreTitle(pageTitle)}`;

  export const createWikidataUserContribUri = (username: string) =>
    `//www.wikidata.org/wiki/Special:Contributions/${underscoreTitle(MwHelper.normalizeUsername(username))}`;

  export const createRedirectUri = (serverName: string, pageTitle: string) =>
    `//${serverName}/w/index.php?title=${underscoreTitle(pageTitle)}&redirect=no`;

  export const createDiffUri = (
    serverName: string,
    pageTitle: string,
    fromRevisionId: number,
    toRevisionId: number
  ) =>
    `//${serverName}/w/index.php?title=${underscoreTitle(pageTitle)}&oldid=${fromRevisionId}&diff=${toRevisionId}`;

  export const correctParsedComment = (serverName: string, parsedComment: string) =>
    parsedComment
      .replaceAll('href="/wiki/', `target="_blank" href="//${serverName}/wiki/`)
      .replaceAll('href="/w/index.php', `target="_blank" href="//${serverName}/w/index.php`);

  export const normalizeUsername = (username: string) => {
    if (username.includes('>')) {
      return username.slice(username.indexOf('>') + 1);
    }

    return username;
  };

  // Ref: https://www.mediawiki.org/wiki/API:RecentChanges#Possible_errors
  export const hasPatrolRight = (rights: string[]) =>
    rights.includes('patrol') || rights.includes('patrolmarks');
}
