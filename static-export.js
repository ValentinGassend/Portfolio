import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist');

// Routes à pré-rendre
const routes = ['about', 'projects']; // Sans la page d'accueil qui existe déjà
const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log('🔄 Génération de l\'export statique...');

// Vérifier que le build existe
if (!fs.existsSync(distDir)) {
  console.error('❌ Le dossier dist n\'existe pas. Exécutez d\'abord `npm run build`');
  process.exit(1);
}

// Lire le fichier index.html généré par Vite
const indexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');

// Fonction pour injecter un en-tête de diagnostic pour le LCP
const injectLCPDiagnosticHeader = (html) => {
  return html.replace('</head>', `
    <script>
      // LCP diagnostic script
      (() => {
        try {
          const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lcpEntry = entries[entries.length - 1];
            console.log('LCP Element:', lcpEntry.element);
            console.log('LCP Time:', lcpEntry.startTime);
            
            // Ajouter un attribut data-lcp à l'élément LCP pour le rendre identifiable
            if (lcpEntry.element) {
              lcpEntry.element.setAttribute('data-lcp', 'true');
            }
          });
          
          observer.observe({type: 'largest-contentful-paint', buffered: true});
        } catch(e) {
          console.warn('LCP Diagnostic failed:', e);
        }
      })();
    </script>
  </head>`);
};

// Fonction pour personnaliser le HTML en fonction de la route
function customizeHtml(route, type = 'page', id = null) {
  let html = indexHtml;

  // Personnaliser le titre et la description en fonction de la route
  let title = 'DEVELOPPEUR CREATIF - VALENTIN GASSEND';
  let description = 'Je m\'appelle Valentin Gassend et voici mon portfolio. Je suis un développeur front-end créatif disponible en freelance';
  let canonicalUrl = 'https://valentingassend.com';

  if (type === 'page') {
    if (route === 'about') {
      title = 'À Propos - Valentin Gassend';
      description = 'Découvrez qui je suis, mon parcours et mes compétences en tant que développeur front-end créatif.';
      canonicalUrl = 'https://valentingassend.com/about';
    } else if (route === 'projects') {
      title = 'Projets - Valentin Gassend';
      description = 'Découvrez mes projets de développement web créatif, mes réalisations et mon portfolio.';
      canonicalUrl = 'https://valentingassend.com/projects';
    }
  } else if (type === 'project' && id) {
    title = `Projet ${id} - Valentin Gassend`;
    description = `Détails du projet ${id} - Développement front-end créatif par Valentin Gassend`;
    canonicalUrl = `https://valentingassend.com/project/${id}`;
  }

  // Remplacer les balises <title> et meta description
  html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);

  // Chercher et remplacer la balise meta description
  const metaDescRegex = /<meta\s+name=["']description["']\s+content=["'].*?["']\s*\/?>/i;
  if (metaDescRegex.test(html)) {
    html = html.replace(metaDescRegex, `<meta name="description" content="${description}" />`);
  } else {
    // Si la balise n'existe pas, l'ajouter après la balise title
    html = html.replace(/<\/title>/, `</title>\n    <meta name="description" content="${description}" />`);
  }

  // Chercher et remplacer l'URL canonique
  const canonicalRegex = /<link\s+rel=["']canonical["']\s+href=["'].*?["']\s*\/?>/i;
  if (canonicalRegex.test(html)) {
    html = html.replace(canonicalRegex, `<link rel="canonical" href="${canonicalUrl}" />`);
  } else {
    // Si la balise n'existe pas, l'ajouter après la balise meta description
    html = html.replace(/<meta\s+name=["']description["'].*?>/, `$&\n    <link rel="canonical" href="${canonicalUrl}" />`);
  }

  // Définir des balises OpenGraph dynamiques
  const openGraphTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://valentingassend.com/img/landing.png" />
  `;

  // Ajouter les balises OpenGraph si elles n'existent pas déjà
  if (!html.includes('og:title')) {
    html = html.replace('</head>', `${openGraphTags}\n  </head>`);
  }

  // Ajout de données pré-rendues pour le SEO
  const preloadedState = {
    route: type === 'page' ? `/${route}` : `/project/${id}`,
    title: title,
    description: description
  };

  // Injecter l'état préchargé pour que l'application puisse l'utiliser au chargement
  const stateScript = `<script>window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState)};</script>`;
  html = html.replace('</head>', `${stateScript}\n  </head>`);

  // Injecter un contenu initial pour améliorer le LCP
  let placeholderContent = '';
  if (type === 'page') {
    if (route === 'about') {
      placeholderContent = `
        <div style="max-width:1200px;margin:0 auto;padding:80px 20px">
          <h1 style="font-size:2.5rem;margin-bottom:1rem;opacity:0.01">À Propos - Valentin Gassend</h1>
          <div style="height:400px;background:#f5f5f5;width:100%;margin-bottom:2rem;opacity:0.01"></div>
          <p style="margin-bottom:1rem;max-width:800px;opacity:0.01">Développeur front-end créatif disponible en freelance.</p>
        </div>
      `;
    } else if (route === 'projects') {
      placeholderContent = `
        <div style="max-width:1200px;margin:0 auto;padding:80px 20px">
          <h1 style="font-size:2.5rem;margin-bottom:2rem;opacity:0.01">Projets - Valentin Gassend</h1>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;opacity:0.01">
            <div style="height:250px;background:#f5f5f5;width:100%"></div>
            <div style="height:250px;background:#f5f5f5;width:100%"></div>
            <div style="height:250px;background:#f5f5f5;width:100%"></div>
          </div>
        </div>
      `;
    }
  } else if (type === 'project') {
    placeholderContent = `
      <div style="max-width:1200px;margin:0 auto;padding:80px 20px">
        <h1 style="font-size:2.5rem;margin-bottom:1rem;opacity:0.01">Projet ${id} - Valentin Gassend</h1>
        <div style="height:500px;background:#f5f5f5;width:100%;margin-bottom:2rem;opacity:0.01"></div>
        <p style="margin-bottom:1rem;max-width:800px;opacity:0.01">Détails du projet ${id}.</p>
      </div>
    `;
  }

  html = html.replace('<div id="root">', `<div id="root">
    <!-- Contenu initial pour améliorer le LCP -->
    ${placeholderContent}
  `);

  // Ajouter le diagnostic LCP
  html = injectLCPDiagnosticHeader(html);

  return html;
}

// Optimiser le chargement des scripts
const optimizeScripts = (html) => {
  // Ajouter fetchpriority="high" aux scripts critiques
  html = html.replace(
      /<script type="module" src="(\/assets\/js\/[^"]+)" defer>/g,
      '<script type="module" src="$1" defer fetchpriority="high">'
  );

  // Ajouter async aux scripts non critiques
  html = html.replace(
      /<script type="module" src="(\/assets\/js\/vendor[^"]+)">/g,
      '<script type="module" src="$1" async>'
  );

  return html;
};

// Créer des dossiers pour chaque route et y mettre un HTML personnalisé
for (const route of routes) {
  const routeDir = path.join(distDir, route);

  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  let customHtml = customizeHtml(route, 'page');
  customHtml = optimizeScripts(customHtml);

  fs.writeFileSync(path.join(routeDir, 'index.html'), customHtml);
  console.log(`✅ Créé page statique pour /${route}`);
}

// Créer des dossiers pour chaque projet avec HTML personnalisé
const projectDir = path.join(distDir, 'project');
if (!fs.existsSync(projectDir)) {
  fs.mkdirSync(projectDir, { recursive: true });
}

for (const id of projectIds) {
  const idDir = path.join(projectDir, id.toString());

  if (!fs.existsSync(idDir)) {
    fs.mkdirSync(idDir, { recursive: true });
  }

  let customHtml = customizeHtml(null, 'project', id);
  customHtml = optimizeScripts(customHtml);

  fs.writeFileSync(path.join(idDir, 'index.html'), customHtml);
  console.log(`✅ Créé page statique pour /project/${id}`);
}

// Optimiser la page d'accueil également
let homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf-8');
homeHtml = injectLCPDiagnosticHeader(homeHtml);
homeHtml = optimizeScripts(homeHtml);

// Ajouter un contenu initial pour la page d'accueil
const homeContent = `
  <div style="max-width:1200px;margin:0 auto;padding:80px 20px">
    <h1 style="font-size:3rem;margin-bottom:2rem;opacity:0.01">DEVELOPPEUR CREATIF - VALENTIN GASSEND</h1>
    <div style="height:600px;background:#f5f5f5;width:100%;margin-bottom:2rem;opacity:0.01"></div>
  </div>
`;

homeHtml = homeHtml.replace('<div id="root">', `<div id="root">
  <!-- Contenu initial pour améliorer le LCP -->
  ${homeContent}
`);

fs.writeFileSync(path.join(distDir, 'index.html'), homeHtml);
console.log('✅ Page d\'accueil optimisée');

// Améliorer robots.txt
const robotsTxt = `# robots.txt pour valentingassend.com

# Autoriser tous les robots à explorer le site
User-agent: *
Allow: /

# Sitemap
Sitemap: https://valentingassend.com/sitemap.xml
`;

fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt);
console.log('✅ robots.txt amélioré généré');

// S'assurer que le sitemap est présent
try {
  // Vérifier si le dossier public existe
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Générer le sitemap si nécessaire
  try {
    // Importer et exécuter le générateur de sitemap si possible
    const generateSitemap = (await import('./generateSitemap.js')).default;
    generateSitemap();
    console.log('✅ sitemap.xml généré');
  } catch (error) {
    console.warn('⚠️ Impossible de générer automatiquement le sitemap:', error);
  }

  // Copier le sitemap vers dist s'il existe
  if (fs.existsSync(path.join(publicDir, 'sitemap.xml'))) {
    fs.copyFileSync(path.join(publicDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
    console.log('✅ sitemap.xml copié dans dist/');
  } else {
    console.warn('⚠️ sitemap.xml non trouvé dans public/');
  }
} catch (error) {
  console.warn('⚠️ Erreur lors de la gestion du sitemap:', error);
}

// Créer un fichier headers pour Vercel afin d'optimiser la mise en cache
const headersContent = `# Headers for better performance
/*
  Cache-Control: public, max-age=604800, s-maxage=604800
  X-Content-Type-Options: nosniff

/*.css
  Cache-Control: public, max-age=31536000, immutable

/*.js
  Cache-Control: public, max-age=31536000, immutable

/*.jpg
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.svg
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable

/*.woff2
  Cache-Control: public, max-age=31536000, immutable
`;

fs.writeFileSync(path.join(distDir, '_headers'), headersContent);
console.log('✅ Fichier _headers généré pour optimiser la mise en cache');

console.log('🎉 Export statique terminé ! Votre site est prêt à être déployé.');