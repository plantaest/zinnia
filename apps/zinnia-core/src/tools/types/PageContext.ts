import { WikiId } from '@/types/mw/WikiId';

export interface PageContext {
  environment: 'zinnia' | 'mediawiki';
  contextType: 'page' | 'revision' | 'diff';
  wikiId: WikiId;
  pageId: number;
  pageTitle: string;
  revisionId: number;
}

export const defaultPageContext: PageContext = Object.freeze({
  environment: 'zinnia',
  contextType: 'page',
  wikiId: 'N/A',
  pageId: 0,
  pageTitle: 'N/A',
  revisionId: 0,
});
