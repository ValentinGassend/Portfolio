// deploy-config.js - Configuration de déploiement optimisée Lighthouse
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configuration adaptée pour différents hébergeurs
const deployConfig = {
  // Configuration générale
  general: {
    buildDir: 'dist',
    routes: ['about', 'projects'],
    projectIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    baseUrl: 'https://valentingassend.com' // À adapter selon votre hébergeur
  },

  // ✅ Configuration pour hébergement statique (style Vercel) - MISE À JOUR
  static: {
    rewrites: [
      { source: "/(.*)", destination: "/" }
    ],
    headers: [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          }
        ]
      },
      // ✅ NOUVEAU: Cache optimisé pour polices (Lighthouse)
      {
        source: "/font/(.*\\.(woff2|woff|ttf|otf|eot))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*"
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, OPTIONS"
          },
          {
            key: "Vary",
            value: "Accept-Encoding"
          },
          {
            key: "X-Font-Cache-Lighthouse",
            value: "245KB-saved"
          }
        ]
      },
      // ✅ NOUVEAU: Cache spécifique Bricolage Grotesque
      {
        source: "/font/Bricolage(.*\\.(woff2|woff|ttf|otf))",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          },
          {
            key: "X-Font-Family",
            value: "Bricolage-Grotesque"
          },
          {
            key: "X-Lighthouse-Optimized",
            value: "true"
          }
        ]
      },
      // ✅ Cache pour autres assets
      {
        source: "/(.*)\\.(js|css|png|jpg|jpeg|gif|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },

  // ✅ Configuration pour hébergement traditionnel (Apache/Nginx) - MISE À JOUR COMPLÈTE
  traditional: {
    htaccess: `# .htaccess optimisé Lighthouse - Cache polices 245 KiB
RewriteEngine On

# ========================================
# 🎯 CACHE POLICES - PRIORITÉ LIGHTHOUSE
# ========================================

<IfModule mod_expires.c>
    ExpiresActive On
    
    # ✅ POLICES - Cache 1 an (corrige les 245 KiB du rapport Lighthouse)
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
    
    # ✅ CSS et JS avec hash
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType application/x-javascript "access plus 1 year"
    
    # ✅ IMAGES
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    
    # ✅ HTML avec revalidation
    ExpiresByType text/html "access plus 1 hour"
    
    # ✅ Fichiers SEO
    ExpiresByType application/xml "access plus 1 day"
    ExpiresByType text/xml "access plus 1 day"
</IfModule>

# ========================================
# 🎯 HEADERS DE CACHE EXPLICITES
# ========================================

<IfModule mod_headers.c>
    # ✅ POLICES - Headers explicites pour corriger Lighthouse
    <FilesMatch "\\.(woff2|woff|ttf|otf|eot)$">
        # Cache immutable 1 an - Corrige "Cache TTL: None"
        Header set Cache-Control "public, max-age=31536000, immutable"
        
        # CORS pour polices cross-domain
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, OPTIONS"
        
        # Optimisations
        Header set Vary "Accept-Encoding"
        Header set X-Content-Type-Options "nosniff"
        
        # Debug Lighthouse
        Header set X-Font-Cache-Fixed "Lighthouse-245KB-saved"
    </FilesMatch>
    
    # ✅ Cache spécifique Bricolage Grotesque
    <LocationMatch "^/font/Bricolage.*\\.(woff2|woff|ttf|otf)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
        Header set X-Font-Family "Bricolage-Grotesque"
        Header set X-Lighthouse-Optimized "true"
    </LocationMatch>
    
    # ✅ CSS et JS
    <FilesMatch "\\.(css|js)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # ✅ Images
    <FilesMatch "\\.(png|jpg|jpeg|gif|svg|webp|avif)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
    
    # ✅ HTML
    <FilesMatch "\\.html$">
        Header set Cache-Control "public, max-age=3600, must-revalidate"
    </FilesMatch>
    
    # ✅ Headers de sécurité
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>

# ========================================
# 🎯 TYPES MIME COMPLETS
# ========================================

<IfModule mod_mime.c>
    # ✅ Types MIME polices
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
    
    # ✅ Autres types
    AddType image/webp .webp
    AddType image/avif .avif
    AddType application/manifest+json .webmanifest
    AddType application/json .json
    
    AddDefaultCharset UTF-8
</IfModule>

# ========================================
# 🎯 COMPRESSION OPTIMISÉE
# ========================================

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
    AddOutputFilterByType DEFLATE image/svg+xml
    
    # ✅ Exclure polices (déjà optimisées)
    SetEnvIfNoCase Request_URI \\.(?:woff|woff2|ttf|otf|eot)$ no-gzip dont-vary
    SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png|webp|avif)$ no-gzip dont-vary
</IfModule>

# ========================================
# 🎯 ROUTES REACT ROUTER
# ========================================

RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/font/
RewriteCond %{REQUEST_URI} !^/assets/
RewriteRule . /index.html [L]`,

    // ✅ NGINX CONFIGURATION MISE À JOUR
    nginx: `server {
    listen 80;
    server_name valentingassend.com;
    root /var/www/votre-site;
    index index.html;

    # ========================================
    # 🎯 CACHE POLICES OPTIMISÉ (Lighthouse)
    # ========================================
    
    # Cache spécifique pour polices (corrige 245 KiB)
    location ~* \\.(woff2|woff|ttf|otf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header X-Font-Cache-Lighthouse "245KB-saved";
        add_header Vary "Accept-Encoding";
    }
    
    # Cache spécifique Bricolage Grotesque
    location ^~ /font/Bricolage {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header X-Font-Family "Bricolage-Grotesque";
        add_header X-Lighthouse-Optimized "true";
        add_header Access-Control-Allow-Origin "*";
    }

    # Gestion des routes React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour autres assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|webp|avif)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
    }
    
    # HTML avec revalidation
    location ~* \\.html$ {
        expires 1h;
        add_header Cache-Control "public, max-age=3600, must-revalidate";
    }

    # ========================================
    # 🎯 SÉCURITÉ ET COMPRESSION
    # ========================================
    
    # Headers de sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Compression optimisée
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
        
    # Exclure polices de la compression
    location ~* \\.(woff2|woff|ttf|otf|eot)$ {
        gzip off;
    }
}`
  }
};

// ✅ Fonction mise à jour pour générer les fichiers de configuration
export function generateDeployFiles(hostingType = 'static') {
  const distDir = path.resolve(__dirname, deployConfig.general.buildDir);

  console.log(`🚀 Génération des fichiers de déploiement pour ${hostingType}...`);
  console.log(`🎯 Optimisations Lighthouse incluses: Cache polices 245 KiB`);

  // Créer le dossier dist s'il n'existe pas
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  switch (hostingType) {
    case 'vercel':
      // ✅ Générer vercel.json optimisé avec cache polices
      const vercelConfig = {
        rewrites: deployConfig.static.rewrites,
        headers: deployConfig.static.headers,
        buildCommand: "npm run build",
        devCommand: "npm run dev",
        installCommand: "npm install",
        framework: "vite",
        // ✅ NOUVEAU: Configuration spécifique pour performance
        functions: {
          "app/**": {
            maxDuration: 30
          }
        }
      };

      fs.writeFileSync(
          path.resolve(__dirname, 'vercel.json'),
          JSON.stringify(vercelConfig, null, 2)
      );
      console.log('✅ vercel.json généré avec cache polices optimisé');
      break;

    case 'netlify':
      // ✅ Générer _redirects pour Netlify
      const redirects = '/*    /index.html   200';
      fs.writeFileSync(
          path.resolve(distDir, '_redirects'),
          redirects
      );

      // ✅ Générer netlify.toml avec cache polices
      const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# ✅ Cache optimisé pour polices (Lighthouse)
[[headers]]
  for = "/font/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"
    X-Font-Cache-Lighthouse = "245KB-saved"

# ✅ Cache spécifique Bricolage
[[headers]]
  for = "/font/Bricolage*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    X-Font-Family = "Bricolage-Grotesque"
    X-Lighthouse-Optimized = "true"

[[headers]]
  for = "/*.{woff2,woff,ttf,otf,eot}"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
    Access-Control-Allow-Origin = "*"

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/*.{js,css,png,jpg,jpeg,gif,svg,webp,avif}"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`;

      fs.writeFileSync(
          path.resolve(__dirname, 'netlify.toml'),
          netlifyConfig
      );
      console.log('✅ Configuration Netlify générée avec cache polices');
      break;

    case 'apache':
      // ✅ Générer .htaccess optimisé pour Apache
      fs.writeFileSync(
          path.resolve(distDir, '.htaccess'),
          deployConfig.traditional.htaccess
      );
      console.log('✅ .htaccess généré avec cache polices (245 KiB optimisé)');
      break;

    case 'nginx':
      // ✅ Générer configuration Nginx optimisée
      fs.writeFileSync(
          path.resolve(__dirname, 'nginx.conf'),
          deployConfig.traditional.nginx
      );
      console.log('✅ Configuration Nginx générée avec cache polices');
      break;

    default:
      // ✅ Configuration générique optimisée
      fs.writeFileSync(
          path.resolve(distDir, '.htaccess'),
          deployConfig.traditional.htaccess
      );

      const genericConfig = {
        rewrites: deployConfig.static.rewrites,
        headers: deployConfig.static.headers,
        // ✅ NOUVEAU: Métadonnées d'optimisation
        lighthouse: {
          fontCacheOptimized: true,
          expectedSavings: "245KB",
          cacheMaxAge: 31536000,
          optimizedFor: "Bricolage Grotesque fonts"
        }
      };

      fs.writeFileSync(
          path.resolve(__dirname, 'deploy.json'),
          JSON.stringify(genericConfig, null, 2)
      );
      console.log('✅ Configuration générique générée avec optimisations Lighthouse');
  }

  return true;
}

// ✅ Fonction mise à jour pour créer un script de déploiement automatisé
export function createDeployScript(hostingType, deployOptions = {}) {
  const script = `#!/bin/bash
# Script de déploiement automatisé avec optimisations Lighthouse

echo "🚀 Début du déploiement avec cache polices optimisé..."

# Nettoyer les anciens builds
rm -rf dist

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Générer les fichiers de configuration optimisés
echo "⚙️ Génération des fichiers de configuration Lighthouse..."
node -e "
import { generateDeployFiles } from './deploy-config.js';
generateDeployFiles('${hostingType}');
"

# Générer le sitemap
echo "🗺️ Génération du sitemap..."
npm run seo:generate

# Copier les fichiers nécessaires
if [ -f "public/sitemap.xml" ]; then
    cp public/sitemap.xml dist/
fi
if [ -f "public/robots.txt" ]; then
    cp public/robots.txt dist/
fi

# ✅ NOUVEAU: Test du cache des polices
echo "🧪 Test de la configuration cache polices..."
if [ -f "dist/.htaccess" ]; then
    if grep -q "font/woff2.*access plus 1 year" dist/.htaccess; then
        echo "✅ Cache polices configuré (1 an)"
    else
        echo "⚠️ Cache polices non détecté"
    fi
fi

echo "✅ Build terminé avec optimisations Lighthouse!"
echo "🎯 Cache polices: 245 KiB économisés"

# Instructions spécifiques selon le type d'hébergement
case "${hostingType}" in
  "vercel")
    echo "🌐 Déploiement Vercel: vercel --prod"
    echo "📊 Vérification post-déploiement:"
    echo "   curl -I https://votre-site.com/font/BricolageGrotesque-Regular.woff2"
    ;;
  "netlify")
    echo "🌐 Déploiement Netlify: netlify deploy --prod --dir=dist"
    echo "📊 Vérification post-déploiement:"
    echo "   curl -I https://votre-site.com/font/BricolageGrotesque-Regular.woff2"
    ;;
  "ftp")
    echo "🌐 Déploiement FTP: Utilisez votre client FTP pour uploader le dossier dist/"
    echo "📁 Assurez-vous que .htaccess est uploadé"
    ;;
  *)
    echo "🌐 Déploiement manuel: Uploadez le contenu du dossier dist/ sur votre serveur"
    echo "⚠️ Important: Vérifiez que .htaccess est bien transféré"
    ;;
esac

echo ""
echo "🎯 Prochaines étapes:"
echo "1. Testez le cache: curl -I votre-site.com/font/BricolageGrotesque-Regular.woff2"
echo "2. Vérifiez header: Cache-Control: public, max-age=31536000, immutable"
echo "3. Relancez Lighthouse: Score attendu 90+"
echo "🎉 Déploiement terminé!"
`;

  fs.writeFileSync(path.resolve(__dirname, 'deploy.sh'), script);
  fs.chmodSync(path.resolve(__dirname, 'deploy.sh'), 0o755);
  console.log('✅ Script de déploiement créé avec tests cache polices');
}

// ✅ NOUVELLE FONCTION: Test de configuration cache polices
export function testFontCacheConfig(hostingType = 'apache') {
  console.log('🧪 Test de la configuration cache polices...');

  const distDir = path.resolve(__dirname, deployConfig.general.buildDir);

  switch (hostingType) {
    case 'apache':
      const htaccessPath = path.join(distDir, '.htaccess');
      if (fs.existsSync(htaccessPath)) {
        const htaccess = fs.readFileSync(htaccessPath, 'utf-8');

        const checks = [
          { test: htaccess.includes('font/woff2'), msg: 'Type MIME woff2' },
          { test: htaccess.includes('access plus 1 year'), msg: 'Cache 1 an configuré' },
          { test: htaccess.includes('max-age=31536000'), msg: 'Headers Cache-Control' },
          { test: htaccess.includes('Access-Control-Allow-Origin'), msg: 'CORS configuré' }
        ];

        checks.forEach(check => {
          console.log(check.test ? `✅ ${check.msg}` : `❌ ${check.msg}`);
        });
      }
      break;

    case 'vercel':
      const vercelPath = path.resolve(__dirname, 'vercel.json');
      if (fs.existsSync(vercelPath)) {
        const vercel = fs.readFileSync(vercelPath, 'utf-8');
        const hasFont = vercel.includes('/font/');
        const hasCache = vercel.includes('max-age=31536000');

        console.log(hasFont ? '✅ Configuration polices Vercel' : '❌ Configuration polices manquante');
        console.log(hasCache ? '✅ Cache configuré' : '❌ Cache manquant');
      }
      break;
  }

  console.log('📊 Test terminé');
}

// ✅ NOUVELLE FONCTION: Génération de rapport d'optimisation
export function generateOptimizationReport() {
  const report = {
    timestamp: new Date().toISOString(),
    optimizations: {
      fontCache: {
        enabled: true,
        expectedSavings: "245 KiB",
        cacheMaxAge: "31536000 seconds (1 year)",
        formats: ["woff2", "woff", "ttf", "otf", "eot"],
        corsEnabled: true
      },
      lighthouse: {
        targetIssue: "Utiliser des durées de mise en cache efficaces",
        solution: "Cache 1 an pour polices Bricolage Grotesque",
        expectedScore: "90+"
      },
      fontFamily: "Bricolage Grotesque",
      hostingTypes: ["Apache", "Nginx", "Vercel", "Netlify"]
    }
  };

  const reportPath = path.resolve(__dirname, 'optimization-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`📊 Rapport d'optimisation généré: ${reportPath}`);

  return report;
}

export default deployConfig;