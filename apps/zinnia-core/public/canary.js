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

    const styles = ['assets/document.css'];
    const scripts = ['assets/index.js'];

    function loadStyle(name) {
      mw.loader.load(host + name, 'text/css');
    }

    function loadScript(name) {
      const script = document.createElement('script');
      script.src = host + name;
      script.async = false;
      script.type = 'module';
      document.head.appendChild(script);
    }

    styles.forEach(loadStyle);
    scripts.forEach(loadScript);
  }
})(mw);
