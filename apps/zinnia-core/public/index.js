/*
 * Zinnia
 * Comprehensive anti-vandalism application for MediaWiki
 *
 * (c) Plantaest and contributors
 * License: GNU Affero General Public License version 3
 *
 * <nowiki>
 */
(function (mw) {
  if (
    // The application will be placed at this page in all wikis: Special:BlankPage/Zinnia
    mw.config.get('wgCanonicalNamespace') === 'Special' &&
    mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
    String(mw.config.get('wgTitle')).endsWith('/Zinnia')
  ) {
    const version = '0.1.0-alpha.1';
    const host = 'https://tools-static.wmflabs.org/zinnia/builds/' + version + '/';

    const styles = ['assets/document.css'];
    const preloadStyles = ['assets/index.css', 'assets/mantine.css'];
    const preloadModules = ['assets/vendor.js', 'assets/mantine.js'];
    const scripts = ['assets/index.js'];

    const loadStyle = function (name) {
      mw.loader.load(host + name, 'text/css');
    };

    const preloadStyle = function (name) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = host + name;
      document.head.appendChild(link);
    };

    const preloadModule = function (name) {
      const link = document.createElement('link');
      link.rel = 'modulepreload';
      link.href = host + name;
      document.head.appendChild(link);
    };

    const loadScript = function (name) {
      const script = document.createElement('script');
      script.async = false;
      script.type = 'module';
      script.src = host + name;
      document.head.appendChild(script);
    };

    styles.forEach(loadStyle);
    preloadStyles.forEach(preloadStyle);
    preloadModules.forEach(preloadModule);
    scripts.forEach(loadScript);
  }
})(mw);
