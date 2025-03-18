// prerender-test.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Routes à pré-rendre
const routes = ['', 'about', 'projects'];
const projectIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const testPrerender = async () => {
  console.log('🧪 Test de pré-rendu des pages statiques...');
  
  // Créer le dossier dist s'il n'existe pas
  const distDir = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  // Créer un dossier pour chaque route
  for (const route of routes) {
    const routeDir = path.resolve(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }
    
    // Créer un fichier index.html dans chaque dossier
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Page ${route || 'Accueil'} - Pré-rendue</title>
</head>
<body>
    <h1>Page ${route || 'Accueil'} pré-rendue avec succès</h1>
    <p>Cette page sera remplacée par le contenu réel lors du build complet.</p>
</body>
</html>`;
    
    fs.writeFileSync(path.resolve(routeDir, 'index.html'), htmlContent);
    console.log(`✅ Page /${route} pré-rendue avec succès`);
  }
  
  // Créer les pages de projets
  const projectsDir = path.resolve(distDir, 'project');
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir, { recursive: true });
  }
  
  for (const id of projectIds) {
    const projectDir = path.resolve(projectsDir, id.toString());
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir, { recursive: true });
    }
    
    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Projet ${id} - Pré-rendu</title>
</head>
<body>
    <h1>Page du projet ${id} pré-rendue avec succès</h1>
    <p>Cette page sera remplacée par le contenu réel lors du build complet.</p>
</body>
</html>`;
    
    fs.writeFileSync(path.resolve(projectDir, 'index.html'), htmlContent);
    console.log(`✅ Page /project/${id} pré-rendue avec succès`);
  }
  
  console.log('🎉 Test de pré-rendu terminé avec succès!');
};

testPrerender().catch(err => {
  console.error('❌ Erreur lors du test de pré-rendu:', err);
  process.exit(1);
});
