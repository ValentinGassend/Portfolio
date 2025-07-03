// deploy-config.js - Configuration de déploiement adaptée
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

  // Configuration pour hébergement statique (style Vercel)
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
      {
        source: "/(.*)\\.(js|css|png|jpg|jpeg|gif|svg|webp)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable"
          }
        ]
      }
    ]
  },

  // Configuration pour hébergement traditionnel (Apache/Nginx)
  traditional: {
    htaccess: `RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Cache Control
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType application/font-woff2 "access plus 1 year"
</IfModule>

# Compression
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
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>`,

    nginx: `server {
    listen 80;
    server_name valentingassend.com;
    root /var/www/votre-site;
    index index.html;

    # Gestion des routes React Router
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache pour les assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # Sécurité
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";

    # Compression
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
}`
  }
};

// Fonction pour générer les fichiers de configuration
export function generateDeployFiles(hostingType = 'static') {
  const distDir = path.resolve(__dirname, deployConfig.general.buildDir);
  
  console.log(`🚀 Génération des fichiers de déploiement pour ${hostingType}...`);

  // Créer le dossier dist s'il n'existe pas
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  switch (hostingType) {
    case 'vercel':
      // Générer vercel.json optimisé
      const vercelConfig = {
        rewrites: deployConfig.static.rewrites,
        headers: deployConfig.static.headers,
        buildCommand: "npm run build",
        devCommand: "npm run dev",
        installCommand: "npm install",
        framework: "vite"
      };
      
      fs.writeFileSync(
        path.resolve(__dirname, 'vercel.json'),
        JSON.stringify(vercelConfig, null, 2)
      );
      console.log('✅ vercel.json généré');
      break;

    case 'netlify':
      // Générer _redirects pour Netlify
      const redirects = '/*    /index.html   200';
      fs.writeFileSync(
        path.resolve(distDir, '_redirects'),
        redirects
      );
      
      // Générer netlify.toml
      const netlifyConfig = `[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Content-Type-Options = "nosniff"
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"

[[headers]]
  for = "/*.{js,css,png,jpg,jpeg,gif,svg,webp}"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`;
    
      fs.writeFileSync(
        path.resolve(__dirname, 'netlify.toml'),
        netlifyConfig
      );
      console.log('✅ Configuration Netlify générée');
      break;

    case 'apache':
      // Générer .htaccess pour Apache
      fs.writeFileSync(
        path.resolve(distDir, '.htaccess'),
        deployConfig.traditional.htaccess
      );
      console.log('✅ .htaccess généré');
      break;

    case 'nginx':
      // Générer configuration Nginx
      fs.writeFileSync(
        path.resolve(__dirname, 'nginx.conf'),
        deployConfig.traditional.nginx
      );
      console.log('✅ Configuration Nginx générée');
      break;

    default:
      // Configuration générique
      fs.writeFileSync(
        path.resolve(distDir, '.htaccess'),
        deployConfig.traditional.htaccess
      );
      
      const genericConfig = {
        rewrites: deployConfig.static.rewrites,
        headers: deployConfig.static.headers
      };
      
      fs.writeFileSync(
        path.resolve(__dirname, 'deploy.json'),
        JSON.stringify(genericConfig, null, 2)
      );
      console.log('✅ Configuration générique générée');
  }

  return true;
}

// Fonction pour créer un script de déploiement automatisé
export function createDeployScript(hostingType, deployOptions = {}) {
  const script = `#!/bin/bash
# Script de déploiement automatisé

echo "🚀 Début du déploiement..."

# Nettoyer les anciens builds
rm -rf dist

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm ci

# Build du projet
echo "🔨 Build du projet..."
npm run build

# Générer les fichiers de configuration
echo "⚙️ Génération des fichiers de configuration..."
node -e "
import { generateDeployFiles } from './deploy-config.js';
generateDeployFiles('${hostingType}');
"

# Générer le sitemap
echo "🗺️ Génération du sitemap..."
npm run generate-sitemap

# Copier les fichiers nécessaires
cp public/sitemap.xml dist/
cp public/robots.txt dist/

echo "✅ Build terminé avec succès!"

# Instructions spécifiques selon le type d'hébergement
case "${hostingType}" in
  "vercel")
    echo "🌐 Déploiement Vercel: vercel --prod"
    ;;
  "netlify")
    echo "🌐 Déploiement Netlify: netlify deploy --prod --dir=dist"
    ;;
  "ftp")
    echo "🌐 Déploiement FTP: Utilisez votre client FTP pour uploader le dossier dist/"
    ;;
  *)
    echo "🌐 Déploiement manuel: Uploadez le contenu du dossier dist/ sur votre serveur"
    ;;
esac

echo "🎉 Déploiement terminé!"
`;

  fs.writeFileSync(path.resolve(__dirname, 'deploy.sh'), script);
  fs.chmodSync(path.resolve(__dirname, 'deploy.sh'), 0o755);
  console.log('✅ Script de déploiement créé');
}

export default deployConfig;