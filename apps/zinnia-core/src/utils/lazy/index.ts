export const loadDomAnimationFeatures = () =>
  import('./domAnimation').then((response) => response.domAnimation);
