(function () {
  const host = 'https://tools-static.wmflabs.org/zinnia/builds/VERSION/';
  const documentStyles = ['assets/document.css'];
  const shadowStyles = ['assets/index.css'];
  const preloadModules = ['assets/react.js', 'assets/mantine.js'];
  const modules = ['assets/index.js'];

  const loadStyleLinkNode = function (name) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = host + name;
    return link;
  };

  const preloadModuleLinkNode = function (name) {
    const link = document.createElement('link');
    link.rel = 'modulepreload';
    link.href = host + name;
    return link;
  };

  const loadModuleScriptNode = function (name) {
    const script = document.createElement('script');
    script.async = false;
    script.type = 'module';
    script.src = host + name;
    return script;
  };

  // (1) Create shadow root & load shadow styles
  const root = document.querySelector('.mw-body');
  root.replaceChildren();
  const shadowRoot = root.attachShadow({ mode: 'open' });

  shadowRoot.prepend(...shadowStyles.map(loadStyleLinkNode));

  window.zinniaShadowRoot = shadowRoot;

  // (2) Preload, load styles, modules
  document.head.append(
    ...documentStyles.map(loadStyleLinkNode),
    ...preloadModules.map(preloadModuleLinkNode),
    ...modules.map(loadModuleScriptNode)
  );
})();
