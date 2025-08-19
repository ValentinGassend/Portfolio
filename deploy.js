// deploy.js - SEO optimisé pour développeur web freelance - VERSION DÉTENDUE
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
   <!-- Page principale - Développeur web freelance WordPress -->
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
   
   <!-- Projets - Portfolio créatif -->
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
  return `# robots.txt pour développeur web freelance - ${SEO_CONFIG.personal.fullName}

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

# Informations développeur web freelance
# Nom: ${SEO_CONFIG.personal.fullName}
# Titre: ${SEO_CONFIG.professional.title}
# École: ${SEO_CONFIG.professional.school.name}
# Localisation: ${SEO_CONFIG.personal.location.primary}
# Spécialités: ${SEO_CONFIG.professional.specialties.fr.slice(0, 5).join(', ')}
# Disponibilité: Freelance pour projets WordPress et sites créatifs`;
}

// Fonction pour supprimer l'image LCP des pages autres que l'accueil
function removeLCPImageFromHTML(html) {
  return html
      .replace(/<img[^>]*id="pre-lcp-element"[^>]*>/gi, '')
      .replace(/<img[^>]*class="pre-lcp-image"[^>]*>/gi, '')
      .replace(/<img[^>]*data-lcp="true"[^>]*>/gi, '')
      .replace(/<img[^>]*src="\/img\/landing\.webp"[^>]*>/gi, '')
      .replace(/\.pre-lcp-image\s*\{[^}]*\}/gi, '')
      .replace(/#pre-lcp-element\s*\{[^}]*\}/gi, '')
      .replace(/fetchpriority="high"/gi, 'fetchpriority="low"')
      .replace(/loading="eager"/gi, 'loading="lazy"');
}

// Fonction pour optimiser les métadonnées LCP par page
function optimizeLCPForPage(html, isHomePage = false) {
  if (isHomePage) {
    return html
        .replace(/fetchpriority="low"/gi, 'fetchpriority="high"')
        .replace(/loading="lazy"/gi, 'loading="eager"');
  } else {
    let optimizedHTML = removeLCPImageFromHTML(html);
    const criticalPreloads = `
    <!-- Préchargement des ressources critiques pour cette page -->
    <link rel="preload" as="font" href="/font/BricolageGrotesque-Regular.woff2" type="font/woff2" crossorigin>
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

  // Configuration SEO par page avec nouveau positionnement
  let title, description, canonicalUrl, keywords;

  if (type === 'page') {
    switch (route) {
      case 'about':
        title = `À Propos - ${SEO_CONFIG.personal.name} | Développeur web freelance Gobelins Annecy | Spécialiste WordPress`;
        description = `Découvrez le profil de ${SEO_CONFIG.personal.name}, développeur web freelance diplômé des Gobelins Annecy. Spécialisé WordPress, animations créatives et sites sur mesure à ${SEO_CONFIG.personal.location.primary}.`;
        canonicalUrl = `${CONFIG.baseUrl}/about`;
        keywords = [
          'valentin gassend',
          'développeur web freelance aix-les-bains',
          'gobelins annecy diplômé',
          'développeur wordpress freelance savoie',
          'freelance wordpress aix-les-bains',
          'développeur web disponible',
          'création site web aix-les-bains',
          'école des gobelins'
        ];
        break;

      case 'projects':
        title = `Projets & Portfolio - ${SEO_CONFIG.personal.name} | WordPress & Web Créatif | Diplômé Gobelins`;
        description = `Portfolio de ${SEO_CONFIG.personal.name} : sites WordPress sur mesure, animations web créatives, interfaces React. Réalisations freelance pour clients en Savoie et Haute-Savoie.`;
        canonicalUrl = `${CONFIG.baseUrl}/projects`;
        keywords = [
          'portfolio développeur web freelance',
          'projets wordpress',
          'animations web créatives',
          'projets sites sur mesure',
          'projets react',
          'portfolio gobelins',
          'expériences web interactives',
          'portfolio freelance'
        ];
        break;

      default:
        title = `${SEO_CONFIG.personal.name}, développeur web freelance WordPress | ${SEO_CONFIG.professional.subtitle} | Diplômé Gobelins`;
        description = SEO_CONFIG.descriptions.home.long_fr;
        canonicalUrl = CONFIG.baseUrl;
        keywords = SEO_CONFIG.keywords.primary_fr;
    }
  } else if (type === 'project' && id) {
    title = `Projet ${id} - ${SEO_CONFIG.personal.name} | Développement web freelance | Gobelins`;
    description = `Découvrez le projet ${id} de ${SEO_CONFIG.personal.name}, développeur web freelance diplômé des Gobelins Annecy. Développement WordPress, animations créatives ou React avec optimisation performance.`;
    canonicalUrl = `${CONFIG.baseUrl}/project/${id}`;
    keywords = [
      `projet ${id} développeur web freelance`,
      'développement wordpress',
      'développement web créatif',
      'développement site sur mesure',
      'développement react',
      'projet interactif',
      'projet gobelins',
      'travail freelance web'
    ];
  }

  // Remplacer les balises principales
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);
  html = html.replace(/(<meta\s+name=["']description["']\s+content=["']).*?(["']\s*\/?>)/i, `$1${description}$2`);
  html = html.replace(/(<link\s+rel=["']canonical["']\s+href=["']).*?(["']\s*\/?>)/i, `$1${canonicalUrl}$2`);

  // Ajouter les mots-clés
  const keywordsTag = `<meta name="keywords" content="${keywords.join(', ')}" />`;
  html = html.replace('</head>', `${keywordsTag}\n  </head>`);

  // Mettre à jour les balises Open Graph
  const ogImage = isHomePage ? `${CONFIG.baseUrl}/img/landing.webp` : `${CONFIG.baseUrl}/img/og-default.jpg`;

  const ogTags = `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${ogImage}" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="${SEO_CONFIG.personal.name} - Développeur web freelance" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${ogImage}" />
    <meta name="twitter:creator" content="${SEO_CONFIG.social.twitter}" />
    
    <!-- Balises professionnelles -->
    <meta name="author" content="${SEO_CONFIG.personal.fullName}" />
    <meta name="designer" content="${SEO_CONFIG.personal.fullName}" />
    <meta name="developer" content="${SEO_CONFIG.personal.fullName}" />
    <meta name="geo.region" content="${SEO_CONFIG.personal.location.countryCode}-84" />
    <meta name="geo.placename" content="${SEO_CONFIG.personal.location.primary}" />
    <meta name="geo.position" content="${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lat};${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lng}" />
    <meta name="ICBM" content="${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lat}, ${SEO_CONFIG.personal.location.coordinates['aix-les-bains'].lng}" />
    
    <!-- Balises éducation -->
    <meta name="school" content="${SEO_CONFIG.professional.school.name}" />
    <meta name="education" content="${SEO_CONFIG.professional.school.fullName}" />
    <meta name="company" content="Freelance - Disponible" />
    <meta name="availability" content="Disponible pour nouveaux projets" />
    <meta name="specialization" content="WordPress, Animations créatives, Sites sur mesure" />
    <meta name="service-area" content="${SEO_CONFIG.personal.location.cities.join(', ')}" />
  `;

  // Remplacer les anciennes balises OG
  html = html.replace(/<meta property="og:.*?>/gi, '');
  html = html.replace(/<meta name="twitter:.*?>/gi, '');
  html = html.replace('</head>', `${ogTags}\n  </head>`);

  // Ajouter les données structurées JSON-LD optimisées avec corrections
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": SEO_CONFIG.personal.fullName,
    "alternateName": [SEO_CONFIG.personal.name, "Développeur web Aix-les-Bains", "Freelance WordPress Aix-les-Bains"],
    "jobTitle": SEO_CONFIG.professional.jobTitle,
    "description": SEO_CONFIG.descriptions.home.short_fr,
    "url": CONFIG.baseUrl,
    "email": SEO_CONFIG.personal.email,
    "telephone": SEO_CONFIG.personal.phone,
    "image": `${CONFIG.baseUrl}/img/landing.webp`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": SEO_CONFIG.personal.location.primary,
      "addressRegion": SEO_CONFIG.personal.location.region,
      "addressCountry": SEO_CONFIG.personal.location.countryCode,
      "postalCode": "73100"
    },
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance",
      "description": "Développeur web freelance disponible pour projets WordPress et sites créatifs"
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
      "name": "Développeur web freelance",
      "description": "Développeur web spécialisé en WordPress et animations créatives",
      "skills": "WordPress, React, JavaScript, Animations web, Sites sur mesure, Performance web",
      "occupationLocation": {
        "@type": "City",
        "name": SEO_CONFIG.personal.location.primary
      },
      "estimatedSalary": {
        "@type": "MonetaryAmount",
        "currency": "EUR",
        "value": {
          "@type": "QuantitativeValue",
          "minValue": 400,
          "maxValue": 800,
          "unitText": "DAY"
        }
      }
    },
    "offers": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Développement web freelance",
        "description": "Création de sites WordPress, animations web créatives, développement React sur mesure",
        "provider": {
          "@type": "Person",
          "name": SEO_CONFIG.personal.fullName
        },
        "areaServed": SEO_CONFIG.personal.location.cities.map(city => ({
          "@type": "City",
          "name": city
        })),
        "availableChannel": {
          "@type": "ServiceChannel",
          "serviceUrl": CONFIG.baseUrl,
          "serviceSmsNumber": SEO_CONFIG.personal.phone,
          "serviceEmail": SEO_CONFIG.personal.email
        }
      },
      "availability": "https://schema.org/InStock",
      "businessFunction": "https://schema.org/Sell"
    }
  };

  // Ajouter les données structurées pour les projets
  if (type === 'project') {
    structuredData["@type"] = "CreativeWork";
    structuredData["creator"] = {
      "@type": "Person",
      "name": SEO_CONFIG.personal.fullName,
      "jobTitle": SEO_CONFIG.professional.jobTitle,
      "alumniOf": SEO_CONFIG.professional.school.name
    };
    structuredData["about"] = `Projet ${id} de développement web utilisant ${SEO_CONFIG.professional.specialties.fr.slice(0, 4).join(', ')}`;
    structuredData["genre"] = "Freelance Web Development";
    structuredData["keywords"] = keywords.join(", ");
  }

  const structuredDataScript = `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>`;
  html = html.replace('</head>', `${structuredDataScript}\n  </head>`);

  return html;
}

// Fonction pour générer le .htaccess avec optimisations SEO
function generateHtaccess() {
  const htaccess = `# .htaccess OPTIMISÉ POUR CACHE DES POLICES
# Corrige le problème Lighthouse "Utiliser des durées de mise en cache efficaces"

RewriteEngine On

# ========================================
# 🎯 CACHE POLICES - PRIORITÉ ABSOLUE
# ========================================

<IfModule mod_expires.c>
    ExpiresActive On
    
    # ✅ POLICES - Cache 1 an (365 jours) - TOUS les formats
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/ttf "access plus 1 year"
    ExpiresByType font/otf "access plus 1 year"
    ExpiresByType font/eot "access plus 1 year"
    
    # ✅ POLICES - Types MIME alternatifs
    ExpiresByType application/font-woff2 "access plus 1 year"
    ExpiresByType application/font-woff "access plus 1 year"
    ExpiresByType application/font-sfnt "access plus 1 year"
    ExpiresByType application/vnd.ms-fontobject "access plus 1 year"
    ExpiresByType application/x-font-woff "access plus 1 year"
    ExpiresByType application/x-font-woff2 "access plus 1 year"
    ExpiresByType application/x-font-ttf "access plus 1 year"
    ExpiresByType application/x-font-otf "access plus 1 year"
    
    # ✅ CSS et JS avec hash - Cache immutable
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    
    # ✅ IMAGES - Cache long
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # ✅ HTML - Cache court avec revalidation
    ExpiresByType text/html "access plus 1 hour"
    
    # ✅ Fichiers SEO
    ExpiresByType application/xml "access plus 1 day"
    ExpiresByType text/xml "access plus 1 day"
</IfModule>

# ========================================
# 🎯 HEADERS DE CACHE EXPLICITES
# ========================================

<IfModule mod_headers.c>
    # ✅ POLICES - Headers de cache explicites et CORS
    <FilesMatch "\\.(woff2|woff|ttf|otf|eot)$">
        # Cache immutable 1 an
        Header set Cache-Control "public, max-age=31536000, immutable"
        
        # CORS pour polices cross-domain
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type, Accept, Origin"
        
        # Optimisations compression
        Header set Vary "Accept-Encoding"
        
        # Sécurité
        Header set X-Content-Type-Options "nosniff"
        
        # Debug (à supprimer en production)
        Header set X-Font-Cache "1-year-immutable"
    </FilesMatch>
    
    # ✅ CSS et JS avec hash
    <FilesMatch "\\.(css|js)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
        Header set X-Asset-Cache "1-year-immutable"
    </FilesMatch>
    
    # ✅ IMAGES
    <FilesMatch "\\.(png|jpg|jpeg|gif|svg|webp|avif)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
        Header set X-Image-Cache "1-year-immutable"
    </FilesMatch>
    
    # ✅ HTML avec revalidation
    <FilesMatch "\\.html$">
        Header set Cache-Control "public, max-age=3600, must-revalidate"
        Header set X-HTML-Cache "1-hour-revalidate"
    </FilesMatch>
    
    # ✅ Headers de sécurité globaux
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# ========================================
# 🎯 TYPES MIME COMPLETS POUR POLICES
# ========================================

<IfModule mod_mime.c>
    # ✅ Types MIME modernes pour polices
    AddType font/woff2 .woff2
    AddType font/woff .woff
    AddType font/ttf .ttf
    AddType font/otf .otf
    AddType font/eot .eot
    
    # ✅ Types MIME alternatifs
    AddType application/font-woff2 .woff2
    AddType application/font-woff .woff
    AddType application/font-sfnt .ttf .otf
    AddType application/vnd.ms-fontobject .eot
    AddType application/x-font-woff .woff
    AddType application/x-font-woff2 .woff2
    AddType application/x-font-ttf .ttf
    AddType application/x-font-otf .otf
    
    # ✅ Autres types importants
    AddType image/webp .webp
    AddType image/avif .avif
    AddType application/manifest+json .webmanifest
    AddType application/json .json
    
    # ✅ Charset par défaut
    AddDefaultCharset UTF-8
</IfModule>

# ========================================
# 🎯 COMPRESSION OPTIMISÉE
# ========================================

<IfModule mod_deflate.c>
    # ✅ Compression pour fichiers texte
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
    AddOutputFilterByType DEFLATE image/svg+xml
    
    # ✅ Exclure les polices de la compression (déjà optimisées)
    SetEnvIfNoCase Request_URI \\.(?:woff|woff2|ttf|otf|eot)$ no-gzip dont-vary
    
    # ✅ Exclure autres fichiers binaires
    SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png|webp|avif|zip|gz|rar|bz2|7z)$ no-gzip dont-vary
</IfModule>

# ========================================
# 🎯 OPTIMISATIONS SPÉCIFIQUES BRICOLAGE
# ========================================

# ✅ Cache spécifique pour les polices Bricolage Grotesque
<LocationMatch "^/font/Bricolage.*\\.(woff2|woff|ttf|otf)$">
    ExpiresDefault "access plus 1 year"
    Header set Cache-Control "public, max-age=31536000, immutable"
    Header set X-Font-Family "Bricolage-Grotesque"
    Header set X-Font-Cache-Optimized "true"
</LocationMatch>

# ========================================
# 🎯 GESTION DES ROUTES REACT
# ========================================

# ✅ Redirection SPA (après les règles de cache)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/font/
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule . /index.html [L]

# ========================================
# 🎯 RÈGLES DE SÉCURITÉ
# ========================================

# ✅ Bloquer accès aux fichiers sensibles
<FilesMatch "^\\.">
    Order allow,deny
    Deny from all
</FilesMatch>

# ✅ Protection des logs et configs
<FilesMatch "\\.(env|git|htaccess|htpasswd|log|ini|conf)$">
    Order allow,deny
    Deny from all
</FilesMatch>`;

  return htaccess;
}

// Fonction principale de déploiement
async function deploy() {
  console.log('🚀 Déploiement SEO optimisé pour développeur web freelance');
  console.log('═══════════════════════════════════════════════════════════════');

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

    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🎉 Déploiement SEO terminé avec succès!');
    console.log(`👨‍💻 Profil: ${SEO_CONFIG.personal.fullName} - ${SEO_CONFIG.professional.title}`);
    console.log(`🎓 École: ${SEO_CONFIG.professional.school.name}`);
    console.log(`📍 Localisation: ${SEO_CONFIG.personal.location.primary}`);
    console.log(`💼 Disponibilité: Freelance pour nouveaux projets`);
    console.log(`🔧 Spécialités: ${SEO_CONFIG.professional.specialties.fr.slice(0, 5).join(', ')}`);
    console.log(`🌍 Villes ciblées: ${SEO_CONFIG.personal.location.cities.join(', ')}`);
    console.log(`📊 Pages générées: ${3 + CONFIG.projectIds.length} au total`);
    console.log('🖼️ Image LCP optimisée : uniquement sur la page d\'accueil');
    console.log('⚡ Core Web Vitals : optimisés par page');
    console.log('🎯 SEO local : WordPress + Freelance + Localisation');
    console.log('═══════════════════════════════════════════════════════════════');

  } catch (error) {
    console.error(`❌ Erreur: ${error.message}`);
    process.exit(1);
  }
}

// Exécuter le déploiement
deploy();