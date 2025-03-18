// ssr.js - fichier d'entrée pour le SSR
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './src/App';
import { Helmet } from 'react-helmet';

export async function render(url, context) {
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={url}>
      <App />
    </StaticRouter>
  );

  // Récupération des données du casque (Helmet)
  const helmet = Helmet.renderStatic();

  // Retour du HTML complet
  return {
    html: `<!DOCTYPE html>
      <html lang="fr">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="preconnect" href="https://assets.lummi.ai">
          <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
          <link rel="dns-prefetch" href="https://fonts.googleapis.com">
          ${helmet.title.toString()}
          ${helmet.meta.toString()}
          ${helmet.link.toString()}
          <meta name="theme-color" content="#ffffff">
          <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Valentin Gassend",
              "jobTitle": "Développeur Front-End",
              "description": "Développeur front-end créatif disponible en freelance.",
              "url": "https://valentingassend.com",
              "sameAs": [
                "https://www.linkedin.com/in/valentin-gassend/",
                "https://github.com/ValentinGassend"
              ]
            }
          </script>
        </head>
        <body>
          <div id="root">${appHtml}</div>
          <script type="module" src="/src/main.jsx"></script>
        </body>
      </html>`,
    context: {}
  };
}
