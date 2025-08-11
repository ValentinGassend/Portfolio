// deploy.js - SEO bilingue pour Creative Developer Gobelins - FIXED
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { SEO_CONFIG } from './seo-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration mise à jour
const CONFIG = {
  buildDir: 'dist',
  baseUrl: 'https://valentingassend.com',
  routes: ['about', 'projects'],
  projectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
};

// Fonction pour générer le sitemap optimisé
function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <!-- Page principale - Creative Developer -->
   <url>
      <loc>${CONFIG.baseUrl}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
   </url>
   
   <!-- À propos - Profil professionnel -->
   <url>
      <loc>${CONFIG.baseUrl}/about</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>
   
   <!-- Projets - Portfolio technique -->
   <url>
      <loc>${CONFIG.baseUrl}/projects</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
   </url>`;

  // Ajouter les projets avec priorité élevée
  CONFIG.projectIds.forEach(id => {
    sitemap += `
   <url>
      <loc>${CONFIG.baseUrl}/project/${id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>`;
  });

  sitemap += `
</urlset>`;

  return sitemap;
}

// Fonction pour générer robots.txt optimisé
function generateRobots() {
  return `# robots.txt pour Creative Developer - ${SEO_CONFIG.personal.name}

User-agent: *
Allow: /

# Priorité SEO pour les pages importantes
Allow: /about
Allow: /projects
Allow: /project/

# Fichiers à ignorer pour optimiser le crawl
Disallow: /assets/
Disallow: /*.json$
Disallow: /*.js.map$
Disallow: /*.css.map$
Disallow: /node_modules/
Disallow: /src/

# Sitemap pour l'indexation
Sitemap: ${CONFIG.baseUrl}/sitemap.xml

# Optimisation crawl
Crawl-delay: 1

# Informations Creative Developer
# Nom: ${SEO_CONFIG.personal.name}
# Titre: ${SEO_CONFIG.professional.title}
# École: ${SEO_CONFIG.professional.school.name}
# Localisation: ${SEO_CONFIG.personal.location.primary}
# Technologies: ${SEO_CONFIG.professional.specialties.fr.slice(0, 5).join(', ')}`;
}

// Fonction pour supprimer l'image LCP des pages autres que l'accueil
function removeLCPImageFromHTML(html) {
  // Supprimer complètement l'image LCP et son conteneur
  return html
      .replace(/<img[^>]*id="pre-lcp-element"[^>]*>/gi, '')
      .replace(/<img[^>]*class="pre-lcp-image"[^>]*>/gi, '')
      .replace(/<img[^>]*data-lcp="true"[^>]*>/gi, '')
      .replace(/<img[^>]*src="\/img\/landing\.webp"[^>]*>/gi, '')
      // Supprimer aussi les styles LCP spécifiques
      .replace(/\.pre-lcp-image\s*\{[^}]*\}/gi, '')
      .replace(/#pre-lcp-element\s*\{[^}]*\}/gi, '')
      // Supprimer les attributs fetchpriority="high" sur d'autres images
      .replace(/fetchpriority="high"/gi, 'fetchpriority="low"')
      // Changer loading="eager" en loading="lazy" pour les autres pages
      .replace(/loading="eager"/gi, 'loading="lazy"');
}

// Fonction pour optimiser les métadonnées LCP par page
function optimizeLCPForPage(html, isHomePage = false) {
  if (isHomePage) {
    // Page d'accueil : garder l'optimisation LCP
    return html
        .replace(/fetchpriority="low"/gi, 'fetchpriority="high"')
        .replace(/loading="lazy"/gi, 'loading="eager"');
  } else {
    // Autres pages : supprimer l'image LCP et optimiser différemment
    let optimizedHTML = removeLCPImageFromHTML(html);

    // Ajouter un préchargement conditionnel pour les ressources critiques de la page
    const criticalPreloads = `
    <!-- Préchargement des ressources critiques pour cette page -->
    <link rel="preload" as="font" href="/fonts/main.woff2" type="font/woff2" crossorigin>
    <link rel="preload" as="style" href="/assets/css/critical.css">`;

    optimizedHTML = optimizedHTML.replace('</head>', `${criticalPreloads}\n  </head>`);

    return optimizedHTML;
  }
}

// Fonction pour personnaliser le HTML par route
function customizeHtmlForRoute(baseHtml, route, type = 'page', id = null) {
  let html = baseHtml;
  const isHomePage = !route && type === 'page';

  // Optimiser le LCP selon le type de page
  html = optimizeLCPForPage(html, isHomePage);

  // Configuration SEO par page
  let title, description, canonicalUrl, keywords;

  if (type === 'page') {
    switch (route) {
      case 'about':
        title = `À Propos - ${SEO_CONFIG.personal.name} | ${SEO_CONFIG.professional.title}`;
        description = `Découvrez le profil de ${SEO_CONFIG.personal.name}, Creative Developer Full Stack chez ${SEO_CONFIG.professional.company}. Spécialiste ThreeJS, WebGL, GSAP et animations web à ${SEO_CONFIG.personal.location.primary}.`;
        canonicalUrl = `${CONFIG.baseUrl}/about`;
        keywords = [
          'valentin gassend',
          'creative developer aix les bains',
          'threejs developer france',
          'gsap developer',
          'mcube developer',
          'webgl expert',
          'full stack developer savoie',
          'gobelins annecy diplômé'
        ];
        break;

      case 'projects':
        title = `Projets & Portfolio - ${SEO_CONFIG.personal.name} | ThreeJS & WebGL`;
        description = `Portfolio de ${SEO_CONFIG.personal.name} : projets ThreeJS, WebGL, GSAP, React et WordPress. Découvrez mes créations d'expériences web interactives et animations 3D.`;
        canonicalUrl = `${CONFIG.baseUrl}/projects`;
        keywords = [
          'portfolio threejs',
          'projets webgl',
          'animations gsap',
          'creative developer portfolio',
          'react projects',
          'wordpress developer',
          'web 3d projects',
          'gobelins portfolio'
        ];
        break;

      default:
        title = `${SEO_CONFIG.personal.name} - ${SEO_CONFIG.professional.title} | ${SEO_CONFIG.personal.location.primary}`;
        description = SEO_CONFIG.descriptions.home.long_fr;
        canonicalUrl = CONFIG.baseUrl;
        keywords = SEO_CONFIG.keywords.primary_fr;
    }
  } else if (type === 'project' && id) {
    title = `Projet ${id} - ${SEO_CONFIG.personal.name} | Creative Development`;
    description = `Découvrez le projet ${id} de ${SEO_CONFIG.personal.name}, Creative Developer. Réalisation ThreeJS, WebGL, GSAP ou React avec optimisation performance.`;
    canonicalUrl = `${CONFIG.baseUrl}/project/${id}`;
    keywords = [
      `projet ${id} creative developer`,
      'threejs project',
      'webgl development',
      'gsap animation',
      'react development',
      'creative coding',
      'gobelins project'
    ];
  }

  // Remplacer les balises principales
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name=["']description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`);
  html = html.replace(/(<link\s+rel=["']canonical["']\s+href=["']).*?(["']\s*\/?>)/i, `$1${canonicalUrl}$2`);

  // Ajouter les mots-clés
  const keywordsTag = `<meta name="keywords" content="${keywords.join(', ')}" />`;
  html = html.replace('</head>', `${keywordsTag}\n  </head>`);

  // Mettre à jour les balises Open Graph avec image adaptée
  const ogImage = isHomePage ? `${CONFIG.baseUrl}/img/landing.webp` : `${CONFIG.baseUrl}/img/og-default.jpg`;

  const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="${SEO_CONFIG.personal.name} - Creative Developer" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:creator" content="${SEO_CONFIG.social.twitter}" />
    
    <!-- Balises professionnelles -->
    <meta name="author" content="${SEO_CONFIG.personal.name}" />
    <meta name="designer" content="${SEO_CONFIG.personal.name}" />
    <meta name="developer" content="${SEO_CONFIG.personal.name}" />
    <meta name="geo.region" content="${SEO_CONFIG.personal.location.countryCode}-84" />
    <meta name="geo.placename" content="${SEO_CONFIG.personal.location.primary}" />
    <meta name="geo.position" content="${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lat};${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lng}" />
    <meta name="ICBM" content="${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lat}, ${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lng}" />
    
    <!-- Balises éducation -->
    <meta name="school" content="${SEO_CONFIG.professional.school.name}" />
    <meta name="education" content="${SEO_CONFIG.professional.school.fullName}" />
    <meta name="company" content="${SEO_CONFIG.professional.company}" />
    
    <!-- Optimisation Core Web Vitals selon le type de page -->
    ${isHomePage ?
      `<link rel="preload" as="image" href="/img/landing.webp" fetchpriority="high">` :
      `<meta name="robots" content="index, follow, max-image-preview:large">`
  }
  `;

  // Remplacer les anciennes balises OG
  html = html.replace(/<meta property="og:.*?>/gi, '');
  html = html.replace(/<meta name="twitter:.*?>/gi, '');
  html = html.replace('</head>', `${ogTags}\n  </head>`);

  // Ajouter les données structurées JSON-LD optimisées
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SEO_CONFIG.personal.name,
    "jobTitle": SEO_CONFIG.professional.jobTitle,
    "description": SEO_CONFIG.descriptions.home.short_fr,
    "url": CONFIG.baseUrl,
    "email": SEO_CONFIG.personal.email,
    "telephone": SEO_CONFIG.personal.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": SEO_CONFIG.personal.location.primary,
      "addressRegion": SEO_CONFIG.personal.location.region,
      "addressCountry": SEO_CONFIG.personal.location.countryCode
    },
    "worksFor": {
      "@type": "Organization",
      "name": SEO_CONFIG.professional.company
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": SEO_CONFIG.professional.school.name,
      "alternateName": SEO_CONFIG.professional.school.fullName,
      "url": SEO_CONFIG.professional.school.url,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": SEO_CONFIG.professional.school.location,
        "addressRegion": SEO_CONFIG.personal.location.region,
        "addressCountry": SEO_CONFIG.personal.location.countryCode
      }
    },
    "knowsAbout": SEO_CONFIG.professional.specialties.fr,
    "serviceArea": SEO_CONFIG.personal.location.cities.map(city => ({
      "@type": "City",
      "name": city,
      "containedInPlace": {
        "@type": "AdministrativeArea",
        "name": SEO_CONFIG.personal.location.region
      }
    })),
    "sameAs": [
      SEO_CONFIG.social.linkedin,
      SEO_CONFIG.social.github,
      SEO_CONFIG.social.portfolio
    ],
    "hasOccupation": {
      "@type": "Occupation",
      "name": SEO_CONFIG.professional.title,
      "description": `Développeur créatif spécialisé en ${SEO_CONFIG.professional.specialties.fr.slice(0, 4).join(', ')}`,
      "skills": SEO_CONFIG.professional.specialties.fr.join(", ")
    }
  };

  // Ajouter les données structurées pour les projets
  if (type === 'project') {
    structuredData["@type"] = "CreativeWork";
    structuredData["creator"] = {
      "@type": "Person",
      "name": SEO_CONFIG.personal.name,
      "jobTitle": SEO_CONFIG.professional.jobTitle,
      "alumniOf": SEO_CONFIG.professional.school.name
    };
    structuredData["about"] = `Projet ${id} de développement créatif utilisant ${SEO_CONFIG.professional.specialties.fr.slice(0, 4).join(', ')}`;
    structuredData["genre"] = "Creative Web Development";
    structuredData["keywords"] = keywords.join(", ");
  }

  const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  html = html.replace('</head>', `${structuredDataScript}\n  </head>`);

  return html;
}

// Fonction pour générer le .htaccess avec optimisations SEO
function generateHtaccess() {
  const htaccess = `# .htaccess optimisé pour Creative Developer - ${SEO_CONFIG.personal.name}

# Activer la réécriture d'URL pour React Router
RewriteEngine On

# Redirections SEO importantes
RewriteCond %{THE_REQUEST} /([^?\\s]*) [NC]
RewriteRule ^index\\.html$ / [R=301,L]

# Gérer les routes React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Optimisations de cache pour performance
<IfModule mod_expires.c>
    ExpiresActive On
    
    # Cache très long pour les assets avec hash (immutable)
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
    
    # Cache HTML optimisé pour SEO
    ExpiresByType text/html "access plus 1 hour"
    
    # Cache pour les fichiers SEO
    ExpiresByType application/xml "access plus 1 day"
    ExpiresByType text/xml "access plus 1 day"
    ExpiresByType application/manifest+json "access plus 1 week"
</IfModule>

# Compression pour optimiser les Core Web Vitals
<IfModule mod_deflate.c>
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

# Headers de sécurité et performance
<IfModule mod_headers.c>
    # Sécurité
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Performance pour Creative Developer
    Header always set X-Creative-Developer "${SEO_CONFIG.personal.name}"
    Header always set X-Technologies "${SEO_CONFIG.professional.specialties.fr.slice(0, 4).join(', ')}"
    Header always set X-School "${SEO_CONFIG.professional.school.name}"
    Header always set X-Location "${SEO_CONFIG.personal.location.primary}"
    
    # Cache Control optimisé
    <FilesMatch "\\.(css|js|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    <FilesMatch "\\.html$">
        Header set Cache-Control "public, max-age=3600, must-revalidate"
    </FilesMatch>
</IfModule>

# Types MIME pour technologies modernes
<IfModule mod_mime.c>
    AddType image/webp .webp
    AddType application/font-woff2 .woff2
    AddType application/manifest+json .webmanifest
    AddType application/json .json
    AddType application/ld+json .jsonld
</IfModule>

# Sécurité renforcée
<Files ~ "^\\.(env|git|htaccess|htpasswd|log)">
    Order allow,deny
    Deny from all
</Files>

# Optimisations pour les moteurs de recherche
<Files "sitemap.xml">
    Header set Cache-Control "public, max-age=86400"
</Files>

<Files "robots.txt">
    Header set Cache-Control "public, max-age=86400"
</Files>

# Redirection HTTPS pour SEO (à décommenter si nécessaire)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`;

  return htaccess;
}

// Fonction principale de déploiement
async function deploy() {
  console.log('🚀 Déploiement SEO optimisé pour Creative Developer');
  console.log('════════════════════════════════════════════════════');

  try {
    // Nettoyage
    console.log('🧹 Nettoyage...');
    if (fs.existsSync(CONFIG.buildDir)) {
      fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
    }

    // Installation et build
    console.log('📦 Installation des dépendances...');
    execSync('npm ci', { stdio: 'inherit' });

    console.log('🔨 Build du projet...');
    execSync('npm run build', { stdio: 'inherit' });

    const distPath = path.resolve(__dirname, CONFIG.buildDir);

    // Génération des fichiers SEO
    console.log('⚙️ Génération des fichiers SEO...');

    fs.writeFileSync(path.join(distPath, '.htaccess'), generateHtaccess());
    fs.writeFileSync(path.join(distPath, 'sitemap.xml'), generateSitemap());
    fs.writeFileSync(path.join(distPath, 'robots.txt'), generateRobots());

    // Génération des pages statiques optimisées
    console.log('📄 Génération des pages SEO avec optimisation LCP...');

    const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf-8');

    // Pages principales (autres que l'accueil)
    for (const route of CONFIG.routes) {
      const routeDir = path.join(distPath, route);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }

      const customHtml = customizeHtmlForRoute(indexHtml, route, 'page');
      fs.writeFileSync(path.join(routeDir, 'index.html'), customHtml);
      console.log(`✅ Page SEO /${route} générée (image LCP supprimée)`);
    }

    // Pages projets
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
      console.log(`✅ Page projet ${id} générée (image LCP supprimée)`);
    }

    // Optimiser la page d'accueil pour conserver l'image LCP
    const homeHtml = customizeHtmlForRoute(indexHtml, null, 'page');
    fs.writeFileSync(path.join(distPath, 'index.html'), homeHtml);
    console.log(`✅ Page d'accueil optimisée (image LCP conservée)`);

    console.log('════════════════════════════════════════════════════');
    console.log('🎉 Déploiement SEO terminé avec succès!');
    console.log(`👨‍💻 Profil: ${SEO_CONFIG.personal.name} - ${SEO_CONFIG.professional.title}`);
    console.log(`🎓 École: ${SEO_CONFIG.professional.school.name}`);
    console.log(`📍 Localisation: ${SEO_CONFIG.personal.location.primary}`);
    console.log(`🏢 Entreprise: ${SEO_CONFIG.professional.company}`);
    console.log(`🔧 Technologies: ${SEO_CONFIG.professional.specialties.fr.slice(0, 5).join(', ')}`);
    console.log(`🌍 Villes ciblées: ${SEO_CONFIG.personal.location.cities.join(', ')}`);
    console.log(`📊 Pages générées: ${3 + CONFIG.projectIds.length} au total`);
    console.log('🖼️ Image LCP optimisée : uniquement sur la page d\'accueil');
    console.log('⚡ Core Web Vitals : optimisés par page');
    console.log('════════════════════════════════════════════════════');

  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter le déploiement
deploy();