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

  return html;
}

// Créer des dossiers pour chaque route et y mettre un HTML personnalisé
for (const route of routes) {
  const routeDir = path.join(distDir, route);

  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const customHtml = customizeHtml(route, 'page');
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

  const customHtml = customizeHtml(null, 'project', id);
  fs.writeFileSync(path.join(idDir, 'index.html'), customHtml);
  console.log(`✅ Créé page statique pour /project/${id}`);
}

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

  // Vérifier si le sitemap existe dans public, sinon le générer
  const sitemapPublicPath = path.join(publicDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPublicPath)) {
    console.log('ℹ️ Sitemap non trouvé dans /public, génération en cours...');
    // Importer et exécuter le générateur de sitemap
    const generateSitemap = (await import('./generateSitemap.js')).default;
    generateSitemap();
  }

  // Copier le sitemap vers dist
  fs.copyFileSync(path.join(publicDir, 'sitemap.xml'), path.join(distDir, 'sitemap.xml'));
  console.log('✅ sitemap.xml copié dans dist/');
} catch (error) {
  console.warn('⚠️ Erreur lors de la gestion du sitemap:', error);
  console.warn('⚠️ Assurez-vous que generateSitemap.js est correctement configuré');
}

console.log('🎉 Export statique terminé ! Votre site est prêt à être déployé.');