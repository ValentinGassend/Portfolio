// generateSitemap.js - Générateur de sitemap SEO bilingue et multi-villes
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_CONFIG } from './seo-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const generateSitemap = () => {
  try {
    console.log('🗺️ Génération du sitemap SEO bilingue optimisé...');

    // Configuration des chemins
    const outDir = path.resolve(__dirname, 'public');
    const baseUrl = 'https://valentingassend.com';
    const today = new Date().toISOString().split('T')[0];

    // Créer le répertoire public si nécessaire
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // IDs des projets (à adapter selon vos projets réels)
    const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const cities = SEO_CONFIG.personal.location.cities.join(', ');
    const school = SEO_CONFIG.professional.school.name;

    // Génération du sitemap XML bilingue avec hreflang
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
                           http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
   
   <!-- Page d'accueil - Creative Developer ${school} -->
   <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>1.0</priority>
      <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/" />
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/" />
      <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
   </url>
   
   <!-- À propos - Profil ${school} -->
   <url>
      <loc>${baseUrl}/about</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
      <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/about" />
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/about" />
   </url>
   
   <!-- Portfolio - Projets créatifs -->
   <url>
      <loc>${baseUrl}/projects</loc>
      <lastmod>${today}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>0.9</priority>
      <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/projects" />
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/projects" />
   </url>`;

    // Ajouter les pages de projets individuels avec hreflang
    projectIds.forEach(id => {
      sitemap += `
   
   <!-- Projet ${id} - Creative Development -->
   <url>
      <loc>${baseUrl}/project/${id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
      <xhtml:link rel="alternate" hreflang="fr" href="${baseUrl}/project/${id}" />
      <xhtml:link rel="alternate" hreflang="en" href="${baseUrl}/en/project/${id}" />
   </url>`;
    });

    // Fermer le sitemap
    sitemap += `

</urlset>`;

    // Écrire le sitemap
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap XML bilingue avec hreflang généré avec succès');

    // Générer robots.txt optimisé avec technologies
    const robotsTxt = `# robots.txt pour Creative Developer - Valentin Gassend
# Domaine: ${baseUrl}
# Généré le: ${today}

# Autoriser tous les robots d'indexation
User-agent: *
Allow: /

# Pages importantes à indexer en priorité
Allow: /about
Allow: /projects
Allow: /project/

# Fichiers et dossiers à éviter pour optimiser le crawl
Disallow: /assets/
Disallow: /src/
Disallow: /node_modules/
Disallow: /dist/
Disallow: /*.json$
Disallow: /*.js.map$
Disallow: /*.css.map$
Disallow: /.*

# Fichiers temporaires et de développement
Disallow: /tmp/
Disallow: /temp/
Disallow: /.git/
Disallow: /.vscode/
Disallow: /.env

# Sitemap pour faciliter l'indexation
Sitemap: ${baseUrl}/sitemap.xml

# Optimisation du crawl
Crawl-delay: 1

# Directives spécifiques pour les moteurs de recherche
# Google
User-agent: Googlebot
Allow: /
Crawl-delay: 1

# Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 2

# Yandex
User-agent: YandexBot
Allow: /
Crawl-delay: 2

# Informations complémentaires pour SEO
# Contact: ${SEO_CONFIG.personal.email}
# Développeur: ${SEO_CONFIG.personal.name}
# École: ${SEO_CONFIG.professional.school.name}
# Technologies: ThreeJS, WebGL, GSAP, React, JavaScript, WordPress
# Spécialités: Creative Development, 3D Web Development, Web Animation
# Localisation: ${SEO_CONFIG.personal.location.primary}, ${SEO_CONFIG.personal.location.region}, ${SEO_CONFIG.personal.location.country}
# Villes: ${SEO_CONFIG.personal.location.cities.join(', ')}
# Entreprise: ${SEO_CONFIG.professional.company}`;

    fs.writeFileSync(path.join(outDir, 'robots.txt'), robotsTxt);
    console.log('✅ Robots.txt avec technologies mentionnées généré avec succès');

    // Générer un sitemap HTML pour les utilisateurs (optionnel)
    const htmlSitemap = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Plan du site - ${SEO_CONFIG.personal.name}</title>
    <meta name="description" content="Plan du site de ${SEO_CONFIG.personal.name}, Creative Developer spécialisé en ThreeJS, WebGL et GSAP">
    <meta name="robots" content="index, follow">
    <style>
        body { font-family: system-ui, -apple-system, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px; }
        .section { margin: 30px 0; }
        .section h2 { color: #007acc; margin-bottom: 15px; }
        .links { display: grid; gap: 10px; }
        .link { padding: 10px; border: 1px solid #eee; border-radius: 5px; text-decoration: none; color: #333; }
        .link:hover { background: #f5f5f5; }
        .meta { color: #666; font-size: 0.9em; margin-top: 5px; }
    </style>
</head>
<body>
    <h1>Plan du site - ${SEO_CONFIG.personal.name}</h1>
    <p>Creative Developer spécialisé en <strong>ThreeJS</strong>, <strong>WebGL</strong> et <strong>GSAP</strong></p>
    
    <div class="section">
        <h2>Pages principales</h2>
        <div class="links">
            <a href="/" class="link">
                <strong>Accueil</strong>
                <div class="meta">Portfolio et présentation</div>
            </a>
            <a href="/about" class="link">
                <strong>À propos</strong>
                <div class="meta">Profil professionnel et compétences</div>
            </a>
            <a href="/projects" class="link">
                <strong>Projets</strong>
                <div class="meta">Portfolio de réalisations créatives</div>
            </a>
        </div>
    </div>
    
    <div class="section">
        <h2>Projets détaillés</h2>
        <div class="links">
            ${projectIds.map(id => `
            <a href="/project/${id}" class="link">
                <strong>Projet ${id}</strong>
                <div class="meta">Développement créatif avec ThreeJS/WebGL</div>
            </a>`).join('')}
        </div>
    </div>
    
    <div class="section">
        <h2>Informations</h2>
        <div class="links">
            <div class="link">
                <strong>Localisation</strong>
                <div class="meta">${SEO_CONFIG.personal.location.primary}, ${SEO_CONFIG.personal.location.region}</div>
            </div>
            <div class="link">
                <strong>Spécialités</strong>
                <div class="meta">${SEO_CONFIG.professional.specialties.fr.slice(0, 6).join(', ')}</div>
            </div>
            <div class="link">
                <strong>École</strong>
                <div class="meta">${SEO_CONFIG.professional.school.name}</div>
            </div>
            <div class="link">
                <strong>Entreprise</strong>
                <div class="meta">${SEO_CONFIG.professional.company}</div>
            </div>
        </div>
    </div>
    
    <footer style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; text-align: center;">
        <p>© 2024 ${SEO_CONFIG.personal.name} - Creative Developer</p>
        <p>Diplômé ${SEO_CONFIG.professional.school.name} - Spécialiste ThreeJS, WebGL, GSAP</p>
        <p>Dernière mise à jour: ${today}</p>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(outDir, 'sitemap.html'), htmlSitemap);
    console.log('✅ Sitemap HTML généré avec succès');

    // Générer un fichier de méta-données SEO bilingue
    const seoMetadata = {
      generated: today,
      domain: baseUrl,
      developer: SEO_CONFIG.personal.name,
      education: {
        school: SEO_CONFIG.professional.school.name,
        programs: SEO_CONFIG.professional.school.programs,
        location: SEO_CONFIG.professional.school.location
      },
      company: SEO_CONFIG.professional.company,
      specialties: {
        fr: SEO_CONFIG.professional.specialties.fr,
        en: SEO_CONFIG.professional.specialties.en
      },
      location: {
        cities: SEO_CONFIG.personal.location.cities,
        region: SEO_CONFIG.personal.location.region,
        primary: SEO_CONFIG.personal.location.primary
      },
      languages: ['fr', 'en'],
      pages: {
        total: 3 + projectIds.length,
        main: 3,
        projects: projectIds.length,
        languages_supported: 2
      },
      keywords: {
        primary_fr: SEO_CONFIG.keywords.primary_fr,
        primary_en: SEO_CONFIG.keywords.primary_en,
        secondary_fr: SEO_CONFIG.keywords.secondary_fr,
        secondary_en: SEO_CONFIG.keywords.secondary_en,
        local_fr: SEO_CONFIG.keywords.local_fr,
        local_en: SEO_CONFIG.keywords.local_en,
        technical_fr: SEO_CONFIG.keywords.technical_fr,
        technical_en: SEO_CONFIG.keywords.technical_en,
        education: SEO_CONFIG.keywords.education
      },
      structured_data: SEO_CONFIG.structuredData,
      hreflang_support: true,
      multi_city_seo: true
    };

    fs.writeFileSync(path.join(outDir, 'seo-metadata.json'), JSON.stringify(seoMetadata, null, 2));
    console.log('✅ Métadonnées SEO bilingues générées avec succès');

    // Générer un fichier de mots-clés par ville pour le SEO local
    const localKeywords = {};
    SEO_CONFIG.personal.location.cities.forEach(city => {
      localKeywords[city] = {
        fr: [
          `creative developer ${city.toLowerCase()}`,
          `développeur créatif ${city.toLowerCase()}`,
          `développeur threejs ${city.toLowerCase()}`,
          `développeur webgl ${city.toLowerCase()}`,
          `freelance ${city.toLowerCase()}`,
          `gobelins ${city.toLowerCase()}`
        ],
        en: [
          `creative developer ${city.toLowerCase()}`,
          `threejs developer ${city.toLowerCase()}`,
          `webgl developer ${city.toLowerCase()}`,
          `freelance developer ${city.toLowerCase()}`,
          `gobelins graduate ${city.toLowerCase()}`
        ]
      };
    });

    fs.writeFileSync(path.join(outDir, 'local-keywords.json'), JSON.stringify(localKeywords, null, 2));
    console.log('✅ Mots-clés locaux par ville générés avec succès');

    // Statistiques finales
    console.log('\n📊 Statistiques du sitemap bilingue:');
    console.log(`• ${3 + projectIds.length} pages au total`);
    console.log(`• ${projectIds.length} projets créatifs`);
    console.log(`• ${SEO_CONFIG.personal.location.cities.length} villes ciblées: ${cities}`);
    console.log(`• ${SEO_CONFIG.keywords.primary_fr.length} mots-clés principaux FR`);
    console.log(`• ${SEO_CONFIG.keywords.primary_en.length} mots-clés principaux EN`);
    console.log(`• ${SEO_CONFIG.professional.specialties.fr.length} spécialités techniques`);
    console.log(`• École: ${school}`);
    console.log(`• Entreprise: ${SEO_CONFIG.professional.company}`);
    console.log(`• Support bilingue: Français + English avec hreflang`);
    console.log(`• Données structurées: Schema.org optimisées`);
    console.log(`• Géolocalisation: ${SEO_CONFIG.personal.location.region}`);

    // Résumé des optimisations
    console.log('\n🎯 Optimisations SEO appliquées:');
    console.log('✅ Sitemap XML bilingue avec hreflang');
    console.log('✅ Robots.txt multi-villes avec technologies');
    console.log('✅ Sitemap HTML utilisateur enrichi');
    console.log('✅ Métadonnées SEO complètes');
    console.log('✅ Mots-clés locaux par ville');
    console.log('✅ Données structurées Gobelins');
    console.log('✅ Support géolocalisation étendue');

  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
    throw error;
  }
};

// Exporter pour utilisation en module
export default generateSitemap;

// Exécuter directement si appelé
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSitemap();
}