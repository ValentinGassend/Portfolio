import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const generateSitemap = () => {
  try {
    // Chemin du fichier de sortie du sitemap
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const outDir = path.resolve(__dirname, 'public');

    // Assurez-vous que le répertoire public existe
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Création du contenu du sitemap
    const baseUrl = 'https://valentingassend.com';
    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

    // Vous devrez ajuster manuellement les IDs des projets ici
    // ou trouver un moyen d'importer vos données de projets
    const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
   <!-- Pages principales -->
   <url>
      <loc>${baseUrl}/</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>1.0</priority>
   </url>
   <url>
      <loc>${baseUrl}/projects</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.9</priority>
   </url>
   <url>
      <loc>${baseUrl}/about</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.8</priority>
   </url>
   
   <!-- Pages de projets individuels -->`;

    // Ajouter chaque projet
    projectIds.forEach(id => {
      sitemap += `
   <url>
      <loc>${baseUrl}/project/${id}</loc>
      <lastmod>${today}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
   </url>`;
    });

    sitemap += `
</urlset>`;

    // Écriture du sitemap.xml
    fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap);
    console.log('✅ Sitemap généré avec succès');

    // Générer aussi robots.txt
    const robots = `# robots.txt pour valentingassend.com

# Autoriser tous les robots à explorer le site
User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml`;

    fs.writeFileSync(path.join(outDir, 'robots.txt'), robots);
    console.log('✅ robots.txt généré avec succès');

  } catch (error) {
    console.error('❌ Erreur lors de la génération du sitemap:', error);
  }
};

export default generateSitemap;