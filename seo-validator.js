// seo-validator.js - Script de validation SEO automatisé

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { SEO_CONFIG } from './seo-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist');

console.log('🔍 Validation SEO automatisée...\n');

// Couleurs pour les logs
const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Tests de validation
const validationTests = [
    {
        name: 'Présence des fichiers essentiels',
        test: () => {
            const requiredFiles = ['index.html', 'sitemap.xml', 'robots.txt', '.htaccess'];
            const missingFiles = requiredFiles.filter(file => !fs.existsSync(path.join(distDir, file)));

            if (missingFiles.length === 0) {
                log('✅ Tous les fichiers essentiels sont présents', 'green');
                return true;
            } else {
                log(`❌ Fichiers manquants: ${missingFiles.join(', ')}`, 'red');
                return false;
            }
        }
    },

    {
        name: 'Validation du sitemap XML',
        test: () => {
            try {
                const sitemapPath = path.join(distDir, 'sitemap.xml');
                if (!fs.existsSync(sitemapPath)) {
                    log('❌ sitemap.xml non trouvé', 'red');
                    return false;
                }

                const sitemap = fs.readFileSync(sitemapPath, 'utf-8');

                // Vérifications du sitemap
                const checks = [
                    { test: sitemap.includes('<?xml version="1.0"'), msg: 'Déclaration XML' },
                    { test: sitemap.includes('valentingassend.com'), msg: 'URL de base' },
                    { test: sitemap.includes('hreflang'), msg: 'Support bilingue' },
                    { test: sitemap.includes('/project/'), msg: 'Pages projets' },
                    { test: sitemap.includes('priority'), msg: 'Priorités définies' }
                ];

                let allPassed = true;
                checks.forEach(check => {
                    if (check.test) {
                        log(`  ✅ ${check.msg}`, 'green');
                    } else {
                        log(`  ❌ ${check.msg}`, 'red');
                        allPassed = false;
                    }
                });

                return allPassed;
            } catch (error) {
                log(`❌ Erreur validation sitemap: ${error.message}`, 'red');
                return false;
            }
        }
    },

    {
        name: 'Validation robots.txt',
        test: () => {
            try {
                const robotsPath = path.join(distDir, 'robots.txt');
                if (!fs.existsSync(robotsPath)) {
                    log('❌ robots.txt non trouvé', 'red');
                    return false;
                }

                const robots = fs.readFileSync(robotsPath, 'utf-8');
                const cities = SEO_CONFIG.personal.location.cities;
                const school = SEO_CONFIG.professional.school.name;

                const checks = [
                    { test: robots.includes('User-agent: *'), msg: 'User-agent défini' },
                    { test: robots.includes('Allow: /'), msg: 'Autorisation de base' },
                    { test: robots.includes('Sitemap:'), msg: 'Référence sitemap' },
                    { test: robots.includes(school), msg: 'École des Gobelins mentionnée' },
                    { test: cities.some(city => robots.includes(city)), msg: 'Villes mentionnées' },
                    { test: robots.includes('ThreeJS'), msg: 'Technologies mentionnées' }
                ];

                let allPassed = true;
                checks.forEach(check => {
                    if (check.test) {
                        log(`  ✅ ${check.msg}`, 'green');
                    } else {
                        log(`  ❌ ${check.msg}`, 'red');
                        allPassed = false;
                    }
                });

                return allPassed;
            } catch (error) {
                log(`❌ Erreur validation robots.txt: ${error.message}`, 'red');
                return false;
            }
        }
    },

    {
        name: 'Validation HTML principal',
        test: () => {
            try {
                const indexPath = path.join(distDir, 'index.html');
                if (!fs.existsSync(indexPath)) {
                    log('❌ index.html non trouvé', 'red');
                    return false;
                }

                const html = fs.readFileSync(indexPath, 'utf-8');

                const checks = [
                    { test: html.includes('<title>'), msg: 'Balise title présente' },
                    { test: html.includes('meta name="description"'), msg: 'Meta description présente' },
                    { test: html.includes('Creative Developer'), msg: 'Titre professionnel' },
                    { test: html.includes('ThreeJS'), msg: 'Spécialité ThreeJS' },
                    { test: html.includes('WebGL'), msg: 'Spécialité WebGL' },
                    { test: html.includes('GSAP'), msg: 'Spécialité GSAP' },
                    { test: html.includes('Gobelins'), msg: 'École des Gobelins' },
                    { test: html.includes('hreflang'), msg: 'Support bilingue' },
                    { test: html.includes('application/ld+json'), msg: 'Données structurées' },
                    { test: html.includes('og:title'), msg: 'Open Graph' }
                ];

                let allPassed = true;
                checks.forEach(check => {
                    if (check.test) {
                        log(`  ✅ ${check.msg}`, 'green');
                    } else {
                        log(`  ❌ ${check.msg}`, 'red');
                        allPassed = false;
                    }
                });

                return allPassed;
            } catch (error) {
                log(`❌ Erreur validation HTML: ${error.message}`, 'red');
                return false;
            }
        }
    },

    {
        name: 'Validation des pages statiques',
        test: () => {
            const routes = ['about', 'projects'];
            const projectIds = [1, 2, 3, 4, 5];
            let allPassed = true;

            // Vérifier les pages principales
            routes.forEach(route => {
                const routePath = path.join(distDir, route, 'index.html');
                if (fs.existsSync(routePath)) {
                    log(`  ✅ Page /${route} générée`, 'green');
                } else {
                    log(`  ❌ Page /${route} manquante`, 'red');
                    allPassed = false;
                }
            });

            // Vérifier quelques pages projets
            projectIds.forEach(id => {
                const projectPath = path.join(distDir, 'project', id.toString(), 'index.html');
                if (fs.existsSync(projectPath)) {
                    log(`  ✅ Page /project/${id} générée`, 'green');
                } else {
                    log(`  ❌ Page /project/${id} manquante`, 'red');
                    allPassed = false;
                }
            });

            return allPassed;
        }
    },

    {
        name: 'Validation des mots-clés bilingues',
        test: () => {
            try {
                const indexPath = path.join(distDir, 'index.html');
                const html = fs.readFileSync(indexPath, 'utf-8');

                const keywordsFr = SEO_CONFIG.keywords.primary_fr;
                const keywordsEn = SEO_CONFIG.keywords.primary_en;

                let foundFr = 0;
                let foundEn = 0;

                keywordsFr.forEach(keyword => {
                    if (html.toLowerCase().includes(keyword.toLowerCase())) {
                        foundFr++;
                    }
                });

                keywordsEn.forEach(keyword => {
                    if (html.toLowerCase().includes(keyword.toLowerCase())) {
                        foundEn++;
                    }
                });

                const percentageFr = (foundFr / keywordsFr.length * 100).toFixed(1);
                const percentageEn = (foundEn / keywordsEn.length * 100).toFixed(1);

                log(`  📊 Mots-clés FR trouvés: ${foundFr}/${keywordsFr.length} (${percentageFr}%)`, 'blue');
                log(`  📊 Mots-clés EN trouvés: ${foundEn}/${keywordsEn.length} (${percentageEn}%)`, 'blue');

                if (foundFr >= keywordsFr.length * 0.7 && foundEn >= keywordsEn.length * 0.5) {
                    log('  ✅ Couverture mots-clés satisfaisante', 'green');
                    return true;
                } else {
                    log('  ⚠️ Couverture mots-clés insuffisante', 'yellow');
                    return false;
                }
            } catch (error) {
                log(`❌ Erreur validation mots-clés: ${error.message}`, 'red');
                return false;
            }
        }
    }
];

// Exécution des tests
async function runValidation() {
    log('🎯 Validation SEO pour Creative Developer Gobelins\n', 'blue');

    let passedTests = 0;
    let totalTests = validationTests.length;

    for (const test of validationTests) {
        log(`📋 Test: ${test.name}`, 'blue');
        const result = test.test();
        if (result) {
            passedTests++;
        }
        console.log('');
    }

    // Résumé final
    log('═══════════════════════════════════════', 'blue');
    log(`📊 Résultats: ${passedTests}/${totalTests} tests réussis`, 'blue');

    if (passedTests === totalTests) {
        log('🎉 Validation SEO réussie! Votre site est optimisé.', 'green');
    } else if (passedTests >= totalTests * 0.8) {
        log('⚠️ Validation SEO partiellement réussie. Quelques améliorations possibles.', 'yellow');
    } else {
        log('❌ Validation SEO échouée. Des corrections sont nécessaires.', 'red');
    }
    log('═══════════════════════════════════════', 'blue');

    // Recommandations
    if (passedTests < totalTests) {
        log('\n💡 Recommandations:', 'yellow');
        log('1. Relancez npm run deploy pour regénérer les fichiers', 'yellow');
        log('2. Vérifiez que seo-config.js est correctement configuré', 'yellow');
        log('3. Contrôlez que tous les imports fonctionnent', 'yellow');
        log('4. Relancez ce script après corrections', 'yellow');
    } else {
        log('\n🚀 Prochaines étapes:', 'green');
        log('1. Déployez votre site en production', 'green');
        log('2. Soumettez le sitemap à Google Search Console', 'green');
        log('3. Surveillez les performances avec npm run analyze:seo', 'green');
        log('4. Vérifiez les positions dans 2-4 semaines', 'green');
    }

    return passedTests === totalTests;
}

// seo-analyzer.js - Analyse des performances SEO
const seoAnalyzer = {
    async analyzeKeywordDensity() {
        log('\n📊 Analyse de la densité des mots-clés...', 'blue');

        try {
            const indexPath = path.join(distDir, 'index.html');
            const html = fs.readFileSync(indexPath, 'utf-8');
            const text = html.replace(/<[^>]*>/g, ' ').toLowerCase();
            const words = text.split(/\s+/).filter(w => w.length > 2);
            const totalWords = words.length;

            // Analyser les mots-clés principaux
            const keywordAnalysis = {};
            const allKeywords = [
                ...SEO_CONFIG.keywords.primary_fr,
                ...SEO_CONFIG.keywords.primary_en,
                ...SEO_CONFIG.keywords.secondary_fr.slice(0, 5),
                ...SEO_CONFIG.keywords.secondary_en.slice(0, 5)
            ];

            allKeywords.forEach(keyword => {
                const keywordLower = keyword.toLowerCase();
                const count = (text.match(new RegExp(keywordLower, 'g')) || []).length;
                const density = ((count / totalWords) * 100).toFixed(2);

                if (count > 0) {
                    keywordAnalysis[keyword] = { count, density };
                }
            });

            // Affichage des résultats
            log('🔍 Densité des mots-clés trouvés:', 'blue');
            Object.entries(keywordAnalysis)
                .sort((a, b) => b[1].count - a[1].count)
                .slice(0, 10)
                .forEach(([keyword, data]) => {
                    const color = data.density > 2 ? 'green' : data.density > 1 ? 'yellow' : 'red';
                    log(`  • ${keyword}: ${data.count} fois (${data.density}%)`, color);
                });

            return keywordAnalysis;
        } catch (error) {
            log(`❌ Erreur analyse mots-clés: ${error.message}`, 'red');
            return {};
        }
    },

    async analyzeStructuredData() {
        log('\n🏗️ Analyse des données structurées...', 'blue');

        try {
            const indexPath = path.join(distDir, 'index.html');
            const html = fs.readFileSync(indexPath, 'utf-8');

            const jsonLdMatches = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);

            if (!jsonLdMatches) {
                log('❌ Aucune donnée structurée trouvée', 'red');
                return false;
            }

            jsonLdMatches.forEach((match, index) => {
                try {
                    const jsonContent = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
                    const data = JSON.parse(jsonContent);

                    log(`📋 Donnée structurée ${index + 1}:`, 'blue');
                    log(`  • Type: ${data['@type']}`, 'green');

                    if (data['@type'] === 'Person') {
                        log(`  • Nom: ${data.name}`, 'green');
                        log(`  • Profession: ${data.jobTitle}`, 'green');
                        log(`  • École: ${data.alumniOf?.name || 'Non spécifié'}`, data.alumniOf?.name ? 'green' : 'yellow');
                        log(`  • Compétences: ${data.knowsAbout?.length || 0} listées`, 'green');
                    }
                } catch (parseError) {
                    log(`  ❌ Erreur parsing JSON-LD ${index + 1}`, 'red');
                }
            });

            return true;
        } catch (error) {
            log(`❌ Erreur analyse données structurées: ${error.message}`, 'red');
            return false;
        }
    },

    async generateSEOReport() {
        log('\n📋 Génération du rapport SEO complet...', 'blue');

        const report = {
            timestamp: new Date().toISOString(),
            site: 'https://valentingassend.com',
            developer: SEO_CONFIG.personal.name,
            school: SEO_CONFIG.professional.school.name,
            technologies: SEO_CONFIG.professional.specialties.fr,
            cities: SEO_CONFIG.personal.location.cities,
            languages: ['fr', 'en'],

            // Analyse automatique
            files: {
                sitemap: fs.existsSync(path.join(distDir, 'sitemap.xml')),
                robots: fs.existsSync(path.join(distDir, 'robots.txt')),
                htaccess: fs.existsSync(path.join(distDir, '.htaccess')),
                sitemapHtml: fs.existsSync(path.join(distDir, 'sitemap.html'))
            },

            keywords: await this.analyzeKeywordDensity(),
            structuredData: await this.analyzeStructuredData(),

            recommendations: [
                'Soumettre sitemap.xml à Google Search Console',
                'Configurer Google Analytics avec objectifs',
                'Surveiller positions mots-clés avec SEMrush/Ahrefs',
                'Optimiser Core Web Vitals avec PageSpeed Insights',
                'Créer profils Google My Business pour chaque ville',
                'Développer backlinks depuis sites Gobelins/éducation',
                'Publier articles techniques sur blog',
                'Participer communautés ThreeJS/WebGL'
            ]
        };

        // Sauvegarder le rapport
        const reportPath = path.join(__dirname, 'seo-report.json');
        fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

        log(`📊 Rapport SEO sauvegardé: ${reportPath}`, 'green');
        return report;
    }
};

// Export pour utilisation en module
export { runValidation, seoAnalyzer };

// Exécution si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
    runValidation()
        .then(success => {
            if (success) {
                return seoAnalyzer.generateSEOReport();
            }
        })
        .then(() => {
            log('\n🎯 Validation et analyse SEO terminées!', 'green');
        })
        .catch(error => {
            log(`❌ Erreur: ${error.message}`, 'red');
            process.exit(1);
        });
}