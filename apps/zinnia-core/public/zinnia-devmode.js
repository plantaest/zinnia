(function (mw) {
  if (
    // The application will be placed at this page in all wikis: Special:BlankPage/Zinnia@dev
    mw.config.get('wgCanonicalNamespace') === 'Special' &&
    mw.config.get('wgCanonicalSpecialPageName') === 'Blankpage' &&
    String(mw.config.get('wgTitle')).endsWith('/Zinnia@dev')
  ) {
    const host = 'http://localhost:8050/';

    const modules = ['inject-react-refresh.js', '@vite/client', 'src/main.tsx'];

    function createScriptNode(module) {
      const script = document.createElement('script');
      script.src = host + module;
      script.async = false;
      script.type = 'module';
      document.head.appendChild(script);
    }

    modules.forEach(createScriptNode);
  }
})(mediaWiki);
