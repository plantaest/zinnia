const mwBody = document.querySelector('.mw-body')!;

export const zinniaSandboxRoot = document.createElement('div');
zinniaSandboxRoot.className = 'zinnia-sandbox-root';

mwBody.insertAdjacentElement('afterend', zinniaSandboxRoot);
