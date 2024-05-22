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
    const host = 'https://tools-static.wmflabs.org/zinnia/builds/canary/';

    mw.loader.load(host + 'assets/document.css', 'text/css');
    mw.loader.load(host + 'assets/index.js');
  }
})(mw);
