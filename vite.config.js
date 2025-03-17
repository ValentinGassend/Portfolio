import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import viteImagemin from 'vite-plugin-imagemin';
import generateSitemap from "./generateSitemap.js";

generateSitemap();
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
        sourcemap: false, // Désactivez les sourcemaps en production
        chunkSizeWarningLimit: 1000,
        // Enable CSS code splitting
        cssCodeSplit: true,
        // Enable brotli compression for static files
        brotliSize: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', 'react-router-dom'],
                    gsap: ['gsap', 'gsap/ScrollTrigger', 'gsap/ScrollSmoother'],
                    three: ['three'],
                    utilities: ['lenis', 'swiper']
                },
                // Customize the asset file names
                assetFileNames: (assetInfo) => {
                    const extType = assetInfo.name.split('.').pop();
                    if (extType === 'css') {
                        return 'assets/css/[name].[hash][extname]';
                    } else if (extType === 'js') {
                        return 'assets/js/[name].[hash][extname]';
                    } else {
                        return 'assets/[name].[hash][extname]';
                    }
                },
                // Use long-term caching for assets
                chunkFileNames: 'assets/js/[name].[hash].js',
                entryFileNames: 'assets/js/[name].[hash].js'
            }
        }
    }
});
