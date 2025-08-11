import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import { createHtmlPlugin } from 'vite-plugin-html';


// Configuration optimisée pour les performances
export default defineConfig({
    plugins: [
        react({
            // Activer la Fast Refresh uniquement en développement
            fastRefresh: process.env.NODE_ENV !== 'production',
            // Minimiser la taille du bundle en production
            jsxRuntime: process.env.NODE_ENV === 'production' ? 'automatic' : 'classic',
        }),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            mozjpeg: {
                quality: 80,
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        name: 'removeViewBox',
                        active: false, // Ne pas supprimer viewBox pour maintenir le responsive
                    },
                    {
                        name: 'removeEmptyAttrs',
                        active: false,
                    },
                ],
            },
            webp: {
                quality: 80,
            },
        }),
    ],
    build: {
        treeshake: true,
        // Désactiver les sourcemaps en production pour réduire la taille
        sourcemap: false,
        // Augmenter la limite d'avertissement pour les gros chunks
        chunkSizeWarningLimit: 1000,
        // Activer la division du CSS pour améliorer le chargement
        cssCodeSplit: true,
        // Activer la compression brotli pour les fichiers statiques
        brotliSize: true,
        // Minimiser le CSS avec PostCSS
        cssMinify: 'lightningcss',
        // Optimisations pour les assets
        assetsInlineLimit: 4096, // Inliner les fichiers de moins de 4kb
        // Configuration Rollup pour optimiser le découpage des bundles
        rollupOptions: {
            output: {
                // Stratégie plus fine de découpage des chunks
                manualChunks: (id) => {
                    // Séparer les bibliothèques en chunks spécifiques
                    if (id.includes('node_modules')) {
                        if (id.includes('three')) return 'vendor-three';
                        if (id.includes('gsap')) return 'vendor-gsap';
                        if (id.includes('lenis')) return 'vendor-lenis';
                        if (id.includes('swiper')) return 'vendor-swiper';
                        if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
                        if (id.includes('react-router')) return 'vendor-router';
                        return 'vendor'; // Autres bibliothèques
                    }

                    // Regrouper les composants par fonction
                    if (id.includes('/ui/views/homePage/')) return 'home-page';
                    if (id.includes('/ui/views/projectsPage/')) return 'projects-page';
                    if (id.includes('/ui/views/aboutPage/')) return 'about-page';
                    if (id.includes('/ui/views/singleProjectPage/')) return 'project-page';
                    if (id.includes('/ui/components/')) return 'components';
                },
                // Personnaliser les noms de fichiers d'assets
                assetFileNames: (assetInfo) => {
                    const extType = assetInfo.name.split('.').pop();
                    if (extType === 'css') {
                        return 'assets/css/[name].[hash][extname]';
                    } else if (/\.(woff2?|ttf|otf|eot)$/.test(assetInfo.name)) {
                        return 'assets/fonts/[name].[hash][extname]';
                    } else if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.name)) {
                        return 'assets/images/[name].[hash][extname]';
                    } else {
                        return 'assets/[name].[hash][extname]';
                    }
                },
                // Utiliser un cache long-term pour les assets
                chunkFileNames: 'assets/js/[name].[hash].js',
                entryFileNames: 'assets/js/[name].[hash].js'
            }
        },
        // Optimisations générales pour la production
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Supprimer les console.log en production
                drop_debugger: true, // Supprimer les debugger en production
            },
        },
        // Métadonnées pour PWA
        manifest: {
            name: 'Portfolio - Valentin Gassend',
            short_name: 'VG Portfolio',
            description: 'Portfolio de Valentin Gassend, développeur front-end créatif',
            theme_color: '#ffffff',
            icons: [
                {
                    src: '/favicon.svg',
                    sizes: 'any',
                    type: 'image/svg+xml',
                },
            ],
        },
    },
    // Optimisations pour le serveur de développement
    server: {
        // Compression en développement pour simuler des conditions de production
        cors: true,
        // Optimiser l'utilisation de la mémoire
        hmr: {
            overlay: true,
        },
    },
    // Optimiser le préchargement des modules
    optimizeDeps: {
        include: [
            'react',
            'react-dom',
            'react-router-dom',
            'gsap',
            'lenis',
            'swiper',
            'react-helmet'
        ],
    },
    // Prévention des erreurs de CORS lors de l'utilisation de fonts et autres assets
    css: {
        devSourcemap: true,
    },
    // Configuration des ressources statiques
    publicDir: 'public',
    // Chemin d'accès de base
    base: '/',
});