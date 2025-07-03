#!/usr/bin/env node
import { execSync } from 'child_process';

console.log('🚀 Configuration du déploiement...');

// Rendre deploy.js exécutable
execSync('chmod +x deploy.js');

// Installer les dépendances si nécessaire
try {
    execSync('npm ci');
    console.log('✅ Dépendances installées');
} catch (error) {
    console.log('📦 Installation des dépendances...');
    execSync('npm install');
}

console.log('🎉 Configuration terminée !');
console.log('💡 Utilisez: npm run deploy');