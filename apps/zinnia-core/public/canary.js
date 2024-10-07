/*
 * Zinnia (canary)
 * Comprehensive anti-vandalism application for MediaWiki
 *
 * (c) Plantaest and contributors
 * License: GNU Affero General Public License version 3
 *
 * <nowiki>
 */
(function (mw) {
  if (
    // The application will be placed at this page in all wikis: Special:BlankPage/Zinnia@canary
    mw.config.get('wgCanonicalNamespace') === 'Special' &&
    mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
    String(mw.config.get('wgTitle')).endsWith('/Zinnia@canary')
  ) {
    const start = 'https://tools-static.wmflabs.org/zinnia/builds/canary/assets/start.js';
    mw.loader.load(start);
  }
})(mw);
