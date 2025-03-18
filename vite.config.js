import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';

export default defineConfig({
    plugins: [
        react(),
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
        })
    ],
    build: {
        sourcemap: false,
        minify: 'terser', // Utiliser terser au lieu d'esbuild pour une meilleure minification
        terserOptions: {
            compress: {
                drop_console: true, // Supprimer les console.log
                drop_debugger: true,
                pure_funcs: ['console.log', 'console.debug', 'console.info'] // Supprime ces fonctions
            }
        },
        cssCodeSplit: true,
        // Suppression de cssMinify: 'lightningcss' qui causait l'erreur
        rollupOptions: {
            output: {
                manualChunks: (id) => {
                    // Séparation plus fine des chunks
                    if (id.includes('node_modules')) {
                        if (id.includes('react')) return 'vendor-react';
                        if (id.includes('gsap')) return 'vendor-gsap';
                        if (id.includes('three')) return 'vendor-three';
                        if (id.includes('swiper') || id.includes('lenis')) return 'vendor-ui';
                        return 'vendor';
                    }
                },
                // Customize the asset file names
                assetFileNames: (assetInfo) => {
                    const extType = assetInfo.name.split('.').pop();
                    if (extType === 'css') {
                        return 'assets/css/[name].[hash][extname]';
                    } else if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
                        return 'assets/img/[name].[hash][extname]';
                    } else if (/\.(woff2?|eot|ttf|otf)$/.test(assetInfo.name)) {
                        return 'assets/fonts/[name].[hash][extname]';
                    } else {
                        return 'assets/[name].[hash][extname]';
                    }
                },
                chunkFileNames: 'assets/js/[name].[hash].js',
                entryFileNames: 'assets/js/[name].[hash].js'
            }
        }
    },
    optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom', 'gsap'],
        exclude: [] // Exclure gsap pour charger depuis CDN
    }
});