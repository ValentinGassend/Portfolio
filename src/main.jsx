import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {Analytics} from "@vercel/analytics/react";
import { setupWebVitalsReporting } from './utils/webVitals.js';

// Fonction pour rendre l'application avec mesure des performances
const renderApp = () => {
    // Marquer le début du rendu React
    if (window.performance) {
        window.performance.mark('react-render-start');
    }

    // Initialiser l'observation des métriques Web Vitals
    setupWebVitalsReporting();

    // Rendre l'application
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <Analytics/>
            <App/>
        </React.StrictMode>,
    );

    // Marquer la fin du rendu React
    if (window.performance) {
        window.performance.mark('react-render-complete');
        window.performance.measure('react-render-time', 'react-render-start', 'react-render-complete');
        const renderTime = window.performance.getEntriesByName('react-render-time')[0].duration;
        console.log('Temps de rendu React:', renderTime);
    }
};

// Précharger l'image/SVG critique pour le LCP
const preloadCriticalAssets = () => {
    // Précharger le logo SVG principal
    const preloadLogo = document.createElement('link');
    preloadLogo.rel = 'preload';
    preloadLogo.href = '/svg/full_logo.svg';
    preloadLogo.as = 'image';
    preloadLogo.type = 'image/svg+xml';
    preloadLogo.fetchPriority = 'high';
    document.head.appendChild(preloadLogo);

    // Précharger l'élément de fond
    const preloadBg = document.createElement('link');
    preloadBg.rel = 'preload';
    preloadBg.href = '/svg/n_element.svg';
    preloadBg.as = 'image';
    preloadBg.type = 'image/svg+xml';
    document.head.appendChild(preloadBg);
};

// Précharger les ressources critiques en priorité
if (!window.__CRITICAL_ASSETS_LOADED__) {
    preloadCriticalAssets();
    window.__CRITICAL_ASSETS_LOADED__ = true;
}

// Vérifier si nous sommes dans le contexte de pré-rendu statique
const isStaticExport = window.__PRELOADED_STATE__ !== undefined;

// Précharger les ressources clés pour les routes principales si ce n'est pas un export statique
if (!isStaticExport && 'requestIdleCallback' in window) {
    requestIdleCallback(() => {
        const routes = ['/projects', '/about'];
        routes.forEach(route => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = route;
            document.head.appendChild(link);
        });
    });
}

// Fonction pour détecter si le DOM est prêt
const onDOMReady = (callback) => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
};

// S'assurer que le CSS critique est chargé avant de rendre l'application
const ensureCriticalCSSLoaded = (callback) => {
    // Vérifier si le CSS critique est déjà chargé
    const criticalCSSLink = document.querySelector('link[href*="critical.css"]');

    if (criticalCSSLink) {
        // Si déjà chargé, continuer
        callback();
    } else {
        // Sinon, créer et charger le CSS critique
        const criticalCSS = document.createElement('link');
        criticalCSS.rel = 'stylesheet';
        criticalCSS.href = '/assets/css/critical.css';
        criticalCSS.onload = callback;
        document.head.appendChild(criticalCSS);
    }
};

// Rendre l'application une fois que tout est prêt
onDOMReady(() => {
    ensureCriticalCSSLoaded(renderApp);
});