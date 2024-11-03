import { WikiId } from '@/types/mw/WikiId';
import { WikiServerName } from '@/types/mw/WikiServerName';
import { zmw } from '@/utils/zmw';

export interface PageContext {
  environment: 'zinnia' | 'mediawiki';
  contextType: 'page' | 'revision' | 'diff';
  wikiId: WikiId;
  wikiServerName: WikiServerName;
  pageId: number;
  pageTitle: string;
  revisionId: number;
}

// TODO: Rename to initialPageContext
export const defaultPageContext: PageContext = Object.freeze({
  environment: 'zinnia',
  contextType: 'page',
  wikiId: zmw.config.get('wgDBname'),
  wikiServerName: zmw.config.get('wgServerName'),
  pageId: 0,
  pageTitle: 'N/A',
  revisionId: 0,
});
