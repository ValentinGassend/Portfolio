// Fichier: src/utils/webVitals.js
// Ce fichier centralise la mesure des métriques Web Vitals

/**
 * Utilitaire pour mesurer et rapporter les métriques Web Vitals
 * Utilise la méthode recommandée par Google
 */

// Fonction pour envoyer les métriques à votre système d'analytics
const reportWebVitals = (metric) => {
    // Vous pouvez envoyer ces métriques à votre système d'analytics
    console.log(`Métrique Web Vitals:`, metric);

    // Exemple d'envoi à Google Analytics
    if (window.gtag) {
        window.gtag('event', metric.name, {
            value: Math.round(metric.value),
            metric_id: metric.id,
            metric_value: metric.value,
            metric_delta: metric.delta,
        });
    }

    // Exemple d'envoi à Vercel Analytics
    if (window.va) {
        window.va('event', {
            name: metric.name,
            value: Math.round(metric.value),
        });
    }
};

/**
 * Configurer l'observation et le rapport des métriques Web Vitals
 * Utilise la méthode moderne et recommandée
 */
export const setupWebVitalsReporting = () => {
    if (!('PerformanceObserver' in window)) return;

    try {
        // Observer LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];

            // Extraire les informations pertinentes
            const metric = {
                name: 'LCP',
                value: lastEntry.startTime,
                id: lastEntry.id,
                element: lastEntry.element
            };

            // Marquer visuellement l'élément LCP pour le debugging
            if (lastEntry.element) {
                lastEntry.element.setAttribute('data-lcp', 'true');

                // Ajouter une bordure en mode développement
                if (process.env.NODE_ENV === 'development') {
                    lastEntry.element.style.outline = '2px solid red';
                }

                console.log('LCP détecté:', lastEntry.element);
                console.log('Temps LCP:', lastEntry.startTime);
            } else {
                console.warn('LCP détecté mais aucun élément associé');
            }

            reportWebVitals(metric);
        });

        // Observer FID (First Input Delay)
        const fidObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const metric = {
                    name: 'FID',
                    value: entry.processingStart - entry.startTime,
                    id: entry.id
                };

                reportWebVitals(metric);
            });
        });

        // Observer CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((entryList) => {
            let cls = 0;

            entryList.getEntries().forEach(entry => {
                if (!entry.hadRecentInput) {
                    cls += entry.value;
                }
            });

            const metric = {
                name: 'CLS',
                value: cls
            };

            reportWebVitals(metric);
        });

        // Observer FCP (First Contentful Paint)
        const fcpObserver = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                const metric = {
                    name: 'FCP',
                    value: entry.startTime,
                    id: entry.id
                };

                reportWebVitals(metric);
            });
        });

        // Activer les observers avec les configurations appropriées
        lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
        fidObserver.observe({ type: 'first-input', buffered: true });
        clsObserver.observe({ type: 'layout-shift', buffered: true });
        fcpObserver.observe({ type: 'paint', buffered: true });

        // Nettoyer les observers quand la page se décharge
        window.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                lcpObserver.takeRecords();
                lcpObserver.disconnect();
                fidObserver.takeRecords();
                fidObserver.disconnect();
                clsObserver.takeRecords();
                clsObserver.disconnect();
                fcpObserver.takeRecords();
                fcpObserver.disconnect();
            }
        });
    } catch (error) {
        console.error('Erreur lors de la configuration des métriques Web Vitals:', error);
    }
};

/**
 * Force l'élément LCP à être reconnu correctement
 * Cette fonction est un hack pour garantir la détection de l'élément LCP
 */
export const forceLCPcandidate = (element) => {
    if (!element) return;

    // Ajouter des attributs pour indiquer au navigateur que c'est l'élément LCP
    element.id = 'lcp-element';
    element.setAttribute('fetchpriority', 'high');
    element.setAttribute('importance', 'high');

    // S'assurer que l'élément est visible par le navigateur
    element.style.opacity = '1';
    element.style.visibility = 'visible';

    // Force le navigateur à recalculer les styles pour reconnaître l'élément
    window.requestAnimationFrame(() => {
        element.classList.add('force-lcp');
        // Force un reflow
        void element.offsetWidth;
    });

    console.log('Élément LCP forcé:', element);
};