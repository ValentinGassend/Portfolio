import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {Analytics} from "@vercel/analytics/react";

// Fonction qui hydrate l'application de manière efficace
const hydrateApp = () => {
    const root = createRoot(document.getElementById('root'));
    root.render(
        <>
            <Analytics />
            <App />
        </>
    );
};

// Attendre que le DOM soit prêt avant d'hydrater l'application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(hydrateApp, 0); // Utiliser setTimeout pour éviter le blocage du thread principal
    });
} else {
    setTimeout(hydrateApp, 0);
}

// Déclarer un Element le plus grand possible dès le début pour aider au LCP
window.addEventListener('load', () => {
    // Trouver l'élément le plus grand visible à l'écran et le marquer comme LCP
    const findLargestElement = () => {
        const elements = document.querySelectorAll('img, video, canvas, svg, div');
        let largestElement = null;
        let largestSize = 0;

        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const size = rect.width * rect.height;

            if (size > largestSize &&
                rect.top < window.innerHeight &&
                rect.left < window.innerWidth) {
                largestSize = size;
                largestElement = el;
            }
        });

        if (largestElement) {
            largestElement.setAttribute('elementtiming', 'LCP-element');
            largestElement.setAttribute('fetchpriority', 'high');
        }
    };

    // Différer l'exécution pour permettre au rendu de se compléter
    setTimeout(findLargestElement, 500);
});

// Préchargement des routes principales pour une navigation plus rapide
if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const routes = ['/about', '/projects'];
        routes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
        });
    });
}

// Rapport de performances pour le debug (uniquement en dev)
if (import.meta.env.DEV) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            // Mesure de performance simplifiée
            const timing = performance.getEntriesByType('navigation')[0];
            const paint = performance.getEntriesByType('paint');

            const FCP = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 'N/A';
            const DCL = timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart;

            console.log('Performance metrics:', {
                'First Contentful Paint': `${FCP}ms`,
                'DOM Content Loaded': `${DCL}ms`,
                'Load Event': `${timing.loadEventEnd - timing.loadEventStart}ms`,
                'Total Load Time': `${timing.loadEventEnd}ms`,
            });
        }, 1000);
    });
}