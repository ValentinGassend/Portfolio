#!/usr/bin/env node

// deploy.js - Script de déploiement automatisé inspiré de Vercel
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration
const CONFIG = {
  buildDir: 'dist',
  baseUrl: 'https://valentingassend.com', // À adapter
  routes: ['about', 'projects'],
  projectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, description) {
  log(`⚡ ${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    log(`✅ ${description} terminé`, 'green');
  } catch (error) {
    log(`❌ Erreur lors de: ${description}`, 'red');
    throw error;
  }
}

// Fonction pour générer le .htaccess optimisé
function generateHtaccess() {
  const htaccess = `# .htaccess optimisé pour React Router (inspiré de Vercel)

# Activer la réécriture d'URL
RewriteEngine On

# Gérer les routes React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optimisations de cache (comme Vercel)
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache long pour les assets avec hash
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    
    # Cache court pour le HTML
    ExpiresByType text/html "access plus 1 hour"
    
    # Cache pour les fichiers de manifest
    ExpiresByType application/manifest+json "access plus 1 week"
</IfModule>

# Compression (comme Vercel)
<IfModule mod_deflate.c>
    # Compression pour tous les fichiers texte
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE application/json
    AddOutputFilterByType DEFLATE application/ld+json
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Headers de sécurité (comme Vercel)
<IfModule mod_headers.c>
    # Sécurité de base
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Content Security Policy (ajustez selon vos besoins)
    Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://assets.lummi.ai https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'none';"
    
    # Cache Control pour les assets
    <FilesMatch "\\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # Cache Control pour HTML
    <FilesMatch "\\.html$">
        Header set Cache-Control "public, max-age=3600, must-revalidate"
    </FilesMatch>
</IfModule>

# Optimisations diverses
<IfModule mod_mime.c>
    # Types MIME pour les nouveaux formats
    AddType image/webp .webp
    AddType application/font-woff2 .woff2
    AddType application/manifest+json .webmanifest
</IfModule>

# Empêcher l'accès aux fichiers sensibles
<Files ~ "^\\.(env|git|htaccess|htpasswd)">
    Order allow,deny
    Deny from all
</Files>

# Redirection HTTPS (optionnel)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;

  return htaccess;
}

// Fonction pour générer le sitemap
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <url>
      <loc>${CONFIG.baseUrl}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
   </url>`;

  // Ajouter les routes principales
  CONFIG.routes.forEach(route => {
    sitemap += `
   <url>
      <loc>${CONFIG.baseUrl}/${route}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>`;
  });

  // Ajouter les projets
  CONFIG.projectIds.forEach(id => {
    sitemap += `
   <url>
      <loc>${CONFIG.baseUrl}/project/${id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Fonction pour générer robots.txt
function generateRobots() {
  return `# robots.txt optimisé

User-agent: *
Allow: /

# Fichiers à ignorer
Disallow: /assets/
Disallow: /*.json$
Disallow: /*.js.map$
Disallow: /*.css.map$

# Sitemap
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Crawl-delay pour éviter la surcharge
Crawl-delay: 1`;
}

// Fonction pour personnaliser le HTML par route
function customizeHtmlForRoute(baseHtml, route, type = 'page', id = null) {
  let html = baseHtml;
  
  // Personnaliser selon la route
  let title = 'Portfolio - Valentin Gassend';
  let description = 'Développeur front-end créatif disponible en freelance';
  let canonicalUrl = CONFIG.baseUrl;
  
  if (type === 'page') {
    switch (route) {
      case 'about':
        title = 'À Propos - Valentin Gassend';
        description = 'Découvrez mon parcours et mes compétences en développement front-end créatif';
        canonicalUrl = `${CONFIG.baseUrl}/about`;
        break;
      case 'projects':
        title = 'Projets - Valentin Gassend';
        description = 'Découvrez mes projets de développement web créatif et mon portfolio';
        canonicalUrl = `${CONFIG.baseUrl}/projects`;
        break;
    }
  } else if (type === 'project' && id) {
    title = `Projet ${id} - Valentin Gassend`;
    description = `Détails du projet ${id} - Développement front-end créatif`;
    canonicalUrl = `${CONFIG.baseUrl}/project/${id}`;
  }
  
  // Remplacer les balises
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name=["']description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`);
  html = html.replace(/(<link\s+rel=["']canonical["']\s+href=["']).*?(["']\s*\/?>)/i, `$1${canonicalUrl}$2`);
  
  // Ajouter des données structurées spécifiques
  const structuredData = {
    "@context": "https://schema.org",
    "@type": type === 'project' ? "CreativeWork" : "WebPage",
    "name": title,
    "description": description,
    "url": canonicalUrl,
    "author": {
      "@type": "Person",
      "name": "Valentin Gassend",
      "jobTitle": "Développeur Front-End",
      "url": CONFIG.baseUrl
    }
  };
  
  const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`;
  html = html.replace('</head>', `${structuredDataScript}\n</head>`);
  
  return html;
}

// Fonction principale de déploiement
async function deploy() {
  log('🚀 Déploiement automatisé - Style Vercel', 'magenta');
  log('════════════════════════════════════════', 'magenta');
  
  try {
    // Étape 1: Nettoyer
    log('🧹 Nettoyage des fichiers précédents...', 'yellow');
    if (fs.existsSync(CONFIG.buildDir)) {
      fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
    }
    
    // Étape 2: Installer les dépendances
    execCommand('npm ci', 'Installation des dépendances');
    
    // Étape 3: Build
    execCommand('npm run build', 'Build du projet');
    
    // Étape 4: Génération des fichiers optimisés
    log('⚙️ Génération des fichiers de configuration...', 'cyan');
    
    const distPath = path.resolve(__dirname, CONFIG.buildDir);
    
    // Générer .htaccess
    fs.writeFileSync(path.join(distPath, '.htaccess'), generateHtaccess());
    log('✅ .htaccess généré', 'green');
    
    // Générer sitemap
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), generateSitemap());
    log('✅ sitemap.xml généré', 'green');
    
    // Générer robots.txt
    fs.writeFileSync(path.join(distPath, 'robots.txt'), generateRobots());
    log('✅ robots.txt généré', 'green');
    
    // Étape 5: Génération des pages statiques
    log('📄 Génération des pages statiques...', 'cyan');
    
    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');
    
    // Créer les pages principales
    for (const route of CONFIG.routes) {
      const routeDir = path.join(distPath, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      
      const customHtml = customizeHtmlForRoute(indexHtml, route, 'page');
      fs.writeFileSync(path.join(routeDir, 'index.html'), customHtml);
      log(`✅ Page /${route} générée`, 'green');
    }
    
    // Créer les pages de projets
    const projectDir = path.join(distPath, 'project');
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    for (const id of CONFIG.projectIds) {
      const idDir = path.join(projectDir, id.toString());
      if (!fs.existsSync(idDir)) {
        fs.mkdirSync(idDir, { recursive: true });
      }
      
      const customHtml = customizeHtmlForRoute(indexHtml, null, 'project', id);
      fs.writeFileSync(path.join(idDir, 'index.html'), customHtml);
      log(`✅ Page /project/${id} générée`, 'green');
    }
    
    // Étape 6: Vérifications finales
    log('🔍 Vérifications finales...', 'cyan');
    
    const requiredFiles = ['index.html', '.htaccess', 'sitemap.xml', 'robots.txt'];
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(distPath, file)));
    
    if (missingFiles.length > 0) {
      log(`❌ Fichiers manquants: ${missingFiles.join(', ')}`, 'red');
      throw new Error('Fichiers manquants');
    }
    
    // Statistiques
    const stats = fs.statSync(distPath);
    const files = fs.readdirSync(distPath, { recursive: true });
    
    log('════════════════════════════════════════', 'magenta');
    log('🎉 Déploiement terminé avec succès!', 'green');
    log(`📁 Dossier de build: ${CONFIG.buildDir}`, 'blue');
    log(`📊 Nombre de fichiers: ${files.length}`, 'blue');
    log('════════════════════════════════════════', 'magenta');
    
    log('📋 Étapes suivantes:', 'yellow');
    log('1. Uploadez le contenu du dossier dist/ sur votre serveur', 'yellow');
    log('2. Vérifiez que toutes les routes fonctionnent', 'yellow');
    log('3. Testez la performance avec PageSpeed Insights', 'yellow');
    log('4. Vérifiez le SEO et les meta tags', 'yellow');
    
  } catch (error) {
    log(`❌ Erreur lors du déploiement: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Exécuter le déploiement
deploy();