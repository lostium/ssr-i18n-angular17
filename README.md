# SsrI18nAngular17

- [SsrI18nAngular17](#ssri18nangular17)
  - [Introduction](#introduction)
  - [angular.json](#angularjson)
    - [Language Configuration](#language-configuration)
    - [Development Server Configuration](#development-server-configuration)
    - [ng-extract-i18n-merge](#ng-extract-i18n-merge)
  - [server.ts](#serverts)
  - [proxy-server.mjs](#proxy-servermjs)
  - [Build and Production Execution](#build-and-production-execution)

## Introduction

This project is a basic example of how to use Server Side Rendering with multi-language (i18n) websites using Angular 17. [You can read the article in lostium.com](https://lostium.com/en/blog/1392/building-multi-language-applications-with-server-side-rendering-in-angular-17/).

The project has been created using the Angular CLI with Server-Side Rendering (SSR) enabled by default.

```txt
Do you want to enable Server-Side Rendering (SSR) and Static Site Generation (SSG/Prerendering)? (y/N)
```

In this example, internationalization has been done in English, Spanish, German, and French. Each language is accessed from the corresponding path: /en/, /es/, /de/, and /fr/.

## angular.json

The [angular.json](angular.json) file has been modified as follows:

### Language Configuration

```json
"i18n": {
    "sourceLocale": {
        "code": "en"
    },
    "locales": {
        "es": {
            "translation": "src/locale/messages.es.xlf",
            "baseHref": "/es/"
        },
        "fr": {
            "translation": "src/locale/messages.fr.xlf",
            "baseHref": "/fr/"
        },
        "de": {
            "translation": "src/locale/messages.de.xlf",
            "baseHref": "/de/"
        }
    }
},
```

### Development Server Configuration

The development server only supports one language. In this case, we configure it to use English and set the *baseHref* to **/en/**. If you change the default language, make sure to modify both attributes accordingly.

```json
"development": {
    "optimization": false,
    "extractLicenses": false,
    "sourceMap": true,
    "localize": [
        "en"
    ],
    "baseHref": "/en/"
}
```

### ng-extract-i18n-merge

Additionally, we use [ng-extract-i18n-merge](https://github.com/daniel-sc/ng-extract-i18n-merge), a tool that synchronizes translations between languages. Here is our configuration:

```json
  "extract-i18n": {
    "builder": "ng-extract-i18n-merge:ng-extract-i18n-merge",
    "options": {
    "browserTarget": "ssr-i18n-angular17:build",
    "format": "xlf2",
    "outputPath": "src/locale",
    "targetFiles": [
        "messages.es.xlf",
        "messages.fr.xlf",
        "messages.de.xlf"
        ]
    }
},
```

## server.ts

Angular provides a server for Server-Side Rendering (SSR) in [server.ts](server.ts), which we need to edit to serve each language at the appropriate path.

The most relevant changes are:

- Determine the language and path for each language.

```typescript
 /**
   * Get the language from the corresponding folder
   */
  const lang = basename(serverDistFolder);
  /**
   * Set the route for static content and APP_BASE_HREF
   */
  const langPath = `/${lang}/`;
  /**
   * Note that the 'browser' folder is located two directories above 'server/{lang}/'
   */
  const browserDistFolder = resolve(serverDistFolder, `../../browser/${lang}`);

```

- Adjust the route for static content by concatenating the language.

```typescript
 // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  // Complete the route for static content by concatenating the language.
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );
```

- Provide APP_BASE_HREF and LOCALE_ID along with RESPONSE and REQUEST from express (declared in [express-tokens.ts](src/express.tokens.ts)).

```typescript
 // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    /**
     * Discard baseUrl as we will provide it with langPath
     */
    const { protocol, originalUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: resolve(serverDistFolder, `../../browser/`), // publicPath does not need to concatenate the language.
        providers: [
          { provide: APP_BASE_HREF, useValue: langPath },
          { provide: LOCALE_ID, useValue: lang },
          { provide: RESPONSE, useValue: res },
          { provide: REQUEST, useValue: req },
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });
```

- Finally, comment or remove the `run()` function and its call, as proxy-server.mjs will handle it.

## proxy-server.mjs

The server Express is started by [proxy-server.mjs](src/proxy-server.mjs). It simply imports each of the app() functions and associates them with the corresponding path.

In our case, we will copy the proxy to the dist/ssr-i18n-angular17 folder. If you modify its destination, you will also need to modify the import paths.

```javascript
import { app as serverEn } from './server/en/server.mjs';
import { app as serverEs } from './server/es/server.mjs';
import { app as serverFr } from './server/fr/server.mjs';
import { app as serverDe } from './server/de/server.mjs';

const express = require('express');

function run() {
  const port = process.env.PORT || 4000;
  const server = express();

  server.use('/fr', serverFr());
  server.use('/de', serverDe());
  server.use('/es', serverEs());
  server.use('/en', serverEn());
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
```

## Build and Production Execution

At the end of the build, we will copy proxy-server.mjs to the destination folder. To do this, we have added a node script to the project [copy-proxy-server.js](copy-proxy-server.js), which you can adapt or copy in a different way.

Additionally, we modify package.json to include the copy of the proxy in the **build** script. We also adapt the **serve:ssr:ssr-i18n-angular17** script to run the proxy-server.

```json
  "scripts": {
    "ng": "ng",
    "start":

 "ng serve",
    "build": "ng build && node copy-proxy-server.js",
    "watch": "ng build --watch --configuration development",
    "test": "ng test",
    "serve:ssr:ssr-i18n-angular17": "node dist/ssr-i18n-angular17/proxy-server.mjs"
  },
```

To compile and run (we use pnpm):

```bash
pnpm build
pnpm serve:ssr:ssr-i18n-angular17
```
