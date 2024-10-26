import dayjs from 'dayjs';
import { ApiQueryRecentChangesParams } from 'types-mediawiki/api_params';
import { Filter } from '@/types/persistence/Filter';
import { LangHelper } from '@/utils/LangHelper';

export namespace FeedHelper {
  export const parseRcQueryParams = (
    filter: Filter,
    wikiIndex: number
  ): ApiQueryRecentChangesParams => {
    const globalWikiConfig = filter.wikis[0].config!;
    const wiki = filter.wikis[wikiIndex];

    const rcstart = filter.feed.invertedDirection
      ? dayjs(filter.feed.timeframe.end).isValid()
        ? filter.feed.timeframe.end
        : (filter.feed.timeframe.start === 'now' ? dayjs() : dayjs(filter.feed.timeframe.start))
            .subtract(dayjs.duration(filter.feed.timeframe.end))
            .toISOString()
      : filter.feed.timeframe.start;

    const rcend = filter.feed.invertedDirection
      ? filter.feed.timeframe.start
      : dayjs(filter.feed.timeframe.end).isValid()
        ? filter.feed.timeframe.end
        : (filter.feed.timeframe.start === 'now' ? dayjs() : dayjs(filter.feed.timeframe.start))
            .subtract(dayjs.duration(filter.feed.timeframe.end))
            .toISOString();

    const rcdir = filter.feed.invertedDirection ? 'newer' : 'older';

    const rcnamespace = wiki.inherited
      ? globalWikiConfig.selectedNamespaces.length > 0
        ? globalWikiConfig.selectedNamespaces.map(Number)
        : undefined
      : wiki.config.selectedNamespaces.length > 0
        ? wiki.config.selectedNamespaces.map(Number)
        : undefined;

    const rcuser = (wiki.inherited ? globalWikiConfig : wiki.config).username ?? undefined;

    const rctag = wiki.inherited
      ? globalWikiConfig.selectedTags.length > 0
        ? globalWikiConfig.selectedTags[0]
        : undefined
      : wiki.config.selectedTags.length > 0
        ? wiki.config.selectedTags[0]
        : undefined;

    const anon = wiki.inherited
      ? {
          anon: globalWikiConfig.unregistered && !globalWikiConfig.registered,
          '!anon': !globalWikiConfig.unregistered && globalWikiConfig.registered,
        }
      : {
          anon: wiki.config.unregistered && !wiki.config.registered,
          '!anon': !wiki.config.unregistered && wiki.config.registered,
        };

    const bot = wiki.inherited
      ? {
          bot: globalWikiConfig.bot && !globalWikiConfig.human,
          '!bot': !globalWikiConfig.bot && globalWikiConfig.human,
        }
      : {
          bot: wiki.config.bot && !wiki.config.human,
          '!bot': !wiki.config.bot && wiki.config.human,
        };

    // The function parseRcQueryParams cannot identify whether the user has patrol right or not.
    // Therefore, Composite (Wiki.getRecentChanges) will handle this issue.
    const patrolled = wiki.inherited
      ? (globalWikiConfig.unpatrolled &&
          globalWikiConfig.patrolled &&
          globalWikiConfig.autopatrolled) ||
        (globalWikiConfig.unpatrolled && globalWikiConfig.patrolled) ||
        (globalWikiConfig.unpatrolled && globalWikiConfig.autopatrolled)
        ? {}
        : {
            unpatrolled: globalWikiConfig.unpatrolled,
            patrolled: globalWikiConfig.patrolled,
            autopatrolled: globalWikiConfig.autopatrolled,
          }
      : (wiki.config.unpatrolled && wiki.config.patrolled && wiki.config.autopatrolled) ||
          (wiki.config.unpatrolled && wiki.config.patrolled) ||
          (wiki.config.unpatrolled && wiki.config.autopatrolled)
        ? {}
        : {
            unpatrolled: wiki.config.unpatrolled,
            patrolled: wiki.config.patrolled,
            autopatrolled: wiki.config.autopatrolled,
          };

    const minor = wiki.inherited
      ? {
          minor: globalWikiConfig.minorEdits && !globalWikiConfig.nonMinorEdits,
          '!minor': !globalWikiConfig.minorEdits && globalWikiConfig.nonMinorEdits,
        }
      : {
          minor: wiki.config.minorEdits && !wiki.config.nonMinorEdits,
          '!minor': !wiki.config.minorEdits && globalWikiConfig.nonMinorEdits,
        };

    const redirect = wiki.inherited
      ? {
          redirect: globalWikiConfig.redirect && !globalWikiConfig.nonRedirect,
          '!redirect': !globalWikiConfig.redirect && globalWikiConfig.nonRedirect,
        }
      : {
          redirect: wiki.config.redirect && !wiki.config.nonRedirect,
          '!redirect': !wiki.config.redirect && globalWikiConfig.nonRedirect,
        };

    const rcshow = Object.keys(
      Object.assign(
        {},
        ...[anon, bot, patrolled, minor, redirect].map(LangHelper.removeFalsyFields)
      )
    ) as (keyof (typeof anon & typeof bot & typeof patrolled & typeof minor))[];

    const changeTypes = wiki.inherited
      ? {
          categorize: globalWikiConfig.categoryChanges,
          edit: globalWikiConfig.pageEdits,
          log: globalWikiConfig.loggedActions,
          new: globalWikiConfig.pageCreations,
          external: globalWikiConfig.wikidataEdits,
        }
      : {
          categorize: wiki.config.categoryChanges,
          edit: wiki.config.pageEdits,
          log: wiki.config.loggedActions,
          new: wiki.config.pageCreations,
          external: wiki.config.wikidataEdits,
        };

    const rctype = Object.keys(
      LangHelper.removeFalsyFields(changeTypes)
    ) as (keyof typeof changeTypes)[];

    const rctoponly = wiki.inherited
      ? globalWikiConfig.latestRevision
        ? true
        : undefined
      : wiki.config.latestRevision
        ? true
        : undefined;

    const rctitle = wiki.inherited
      ? (globalWikiConfig.pageTitle ?? undefined)
      : (wiki.config.pageTitle ?? undefined);

    return {
      rcstart,
      rcend,
      rcdir,
      rcnamespace,
      rcuser,
      rctag,
      rcshow,
      rclimit: filter.feed.limit,
      rctype,
      rctoponly,
      rctitle,
    };
  };
}
