(function (mw) {
  if (
    // The application will be placed at this page in all wikis: Special:BlankPage/Zinnia
    mw.config.get('wgCanonicalNamespace') === 'Special' &&
    mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
    String(mw.config.get('wgTitle')).endsWith('/Zinnia')
  ) {
    const host = 'http://localhost:8050/';

    const styles = ['assets/document.css'];
    const modules = ['inject-react-refresh.js', '@vite/client', 'src/main.tsx'];

    function createStyleLinkNode(name) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = host + name;
      document.head.appendChild(link);
    }

    function createScriptNode(module) {
      const script = document.createElement('script');
      script.src = host + module;
      script.async = false;
      script.type = 'module';
      document.head.appendChild(script);
    }

    styles.forEach(createStyleLinkNode);
    modules.forEach(createScriptNode);
  }
})(mediaWiki);
