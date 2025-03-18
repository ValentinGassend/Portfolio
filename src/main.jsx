import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.scss'
import {Analytics} from "@vercel/analytics/react";

// Fonction pour rendre l'application
const renderApp = () => {
    ReactDOM.createRoot(document.getElementById('root')).render(
        <>
            <Analytics/>
            <App/>
        </>,
    )
};

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

// Rendre l'application immédiatement si le DOM est déjà chargé
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderApp);
} else {
    renderApp();
}