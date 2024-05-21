# Zinnia

Comprehensive anti-vandalism application for MediaWiki

Home page: [User:Plantaest/Zinnia](https://en.wikipedia.org/wiki/User:Plantaest/Zinnia) on English Wikipedia

## Usage

Step 1: Add the following code to `global.js` on Meta

```js
mw.loader.load('https://meta.wikimedia.org/wiki/User:Plantaest/Zinnia/.js?action=raw&ctype=text/javascript');
// Backlink: [[User:Plantaest/Zinnia/.js]]
```

Step 2: Open `Special:BlankPage/Zinnia` on any wiki

## Developing

Step 1:

```
pnpm i
```

Step 2:

```
pnpm dev
```

Step 3: Add the following code to `global.js` on Meta

```js
mw.loader.load('http://localhost:8050/zinnia-devmode.js');
```

Step 4: Open `Special:BlankPage/Zinnia` on any wiki

## Licensing

```
(c) Plantaest and contributors

License:
* GNU Affero General Public License version 3 for Zinnia application
* Apache License version 2 for Aster library
```
