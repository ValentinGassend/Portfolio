// seo-config.js - Configuration SEO bilingue pour Creative Developer
export const SEO_CONFIG = {
    // Informations personnelles
    personal: {
        name: 'Valentin Gassend',
        firstName: 'Valentin',
        lastName: 'Gassend',
        email: 'valentin.gassend@gmail.com',
        phone: '+33768935996',
        location: {
            primary: 'Aix-les-Bains',
            cities: ['Aix-les-Bains', 'Chambéry', 'Annecy', 'Lyon'],
            region: 'Auvergne-Rhône-Alpes',
            country: 'France',
            countryCode: 'FR',
            coordinates: {
                'aix-les-bains': { lat: '45.6887', lng: '5.9165' },
                'chambery': { lat: '45.5646', lng: '5.9178' },
                'annecy': { lat: '45.8992', lng: '6.1294' },
                'lyon': { lat: '45.7640', lng: '4.8357' }
            }
        }
    },

    // Profil professionnel
    professional: {
        title: 'Creative Developer',
        subtitle: 'ThreeJS WebGL & GSAP',
        titleEn: 'Creative Developer',
        subtitleEn: 'ThreeJS WebGL & GSAP',
        jobTitle: 'Développeur Full Stack - Creative Developer',
        jobTitleEn: 'Full Stack Developer - Creative Developer',
        company: 'Mcube',
        experience: 'Alternance depuis septembre 2024',
        experienceEn: 'Apprenticeship since September 2024',
        previousCompany: 'Agence Altimax',
        previousExperience: 'Alternance 2022-2024',

        // École des Gobelins - Mise en avant
        school: {
            name: 'École des Gobelins',
            fullName: 'École by CCI - Gobelins Annecy',
            location: 'Annecy',
            programs: [
                'Master Expert en Création Numérique Interactive (2024-2026)',
                'Bachelor Développement Web et Mobile (2022-2024)'
            ],
            reputation: 'École de référence en création numérique',
            url: 'https://www.gobelins.fr/'
        },

        // Spécialités techniques (français/anglais)
        specialties: {
            fr: [
                'ThreeJS', 'WebGL', 'GSAP', 'React', 'JavaScript',
                'WordPress', 'Lenis', 'Twig', 'Blade', 'Sass',
                'Vite', 'Node.js', 'Core Web Vitals', 'Performance Web',
                'Animations 3D', 'Smooth Scrolling', 'Responsive Design',
                'Développement Créatif', 'Expériences Interactives'
            ],
            en: [
                'ThreeJS', 'WebGL', 'GSAP', 'React', 'JavaScript',
                'WordPress', 'Lenis', 'Twig', 'Blade', 'Sass',
                'Vite', 'Node.js', 'Core Web Vitals', 'Web Performance',
                '3D Animations', 'Smooth Scrolling', 'Responsive Design',
                'Creative Development', 'Interactive Experiences'
            ]
        },

        // Secteurs d'activité
        sectors: {
            fr: ['High-tech', 'Développement Web', 'Création Numérique', 'Agence Digitale'],
            en: ['High-tech', 'Web Development', 'Digital Creation', 'Digital Agency']
        },

        // Langues
        languages: [
            { name: 'Français', nameEn: 'French', level: 'Natif', levelEn: 'Native' },
            { name: 'Anglais', nameEn: 'English', level: 'Professionnel', levelEn: 'Professional' }
        ]
    },

    // Mots-clés SEO bilingues par importance
    keywords: {
        // Mots-clés principaux (français)
        primary_fr: [
            'creative developer',
            'développeur créatif',
            'développeur threejs',
            'développeur webgl',
            'développeur gsap',
            'valentin gassend',
            'gobelins annecy',
            'école des gobelins'
        ],

        // Mots-clés principaux (anglais)
        primary_en: [
            'creative developer',
            'threejs developer',
            'webgl developer',
            'gsap developer',
            'frontend developer',
            '3d web developer',
            'interactive developer',
            'gobelins graduate'
        ],

        // Mots-clés secondaires (français)
        secondary_fr: [
            'développeur créatif france',
            'expert threejs',
            'spécialiste webgl',
            'animations gsap',
            'développement créatif',
            'développeur 3d web',
            'animations web',
            'développeur react',
            'développeur wordpress',
            'développeur full stack',
            'création numérique interactive',
            'expériences interactives'
        ],

        // Mots-clés secondaires (anglais)
        secondary_en: [
            'creative developer france',
            'threejs expert',
            'webgl specialist',
            'gsap animations',
            'creative coding',
            '3d web developer',
            'web animations',
            'react developer',
            'wordpress developer',
            'full stack developer',
            'interactive digital creation',
            'interactive experiences'
        ],

        // SEO local multi-villes (français)
        local_fr: [
            'développeur créatif aix les bains',
            'creative developer chambéry',
            'développeur threejs annecy',
            'développeur webgl lyon',
            'développeur créatif savoie',
            'développeur web savoie',
            'développeur rhône alpes',
            'freelance aix les bains',
            'développeur annecy',
            'développeur chambéry',
            'développeur lyon',
            'gobelins annecy étudiant',
            'mcube développeur',
            'alternance développeur savoie'
        ],

        // SEO local multi-villes (anglais)
        local_en: [
            'creative developer aix les bains',
            'threejs developer chambery',
            'webgl developer annecy',
            'gsap developer lyon',
            'developer rhone alpes',
            'web developer france',
            'creative developer france',
            'freelance developer france',
            'gobelins annecy graduate',
            'french web developer',
            'developer french alps',
            'lyon web developer',
            'annecy developer'
        ],

        // Mots-clés techniques (français)
        technical_fr: [
            'lenis smooth scroll',
            'core web vitals',
            'performance web',
            'animations 3d',
            'rendus webgl',
            'interfaces interactives',
            'développement créatif web',
            'optimisation performance',
            'javascript expert',
            'react expert',
            'wordpress expert',
            'vite build tool',
            'sass expert'
        ],

        // Mots-clés techniques (anglais)
        technical_en: [
            'lenis smooth scroll',
            'core web vitals',
            'web performance',
            '3d animations',
            'webgl rendering',
            'interactive interfaces',
            'creative web development',
            'performance optimization',
            'javascript expert',
            'react expert',
            'wordpress expert',
            'vite build tool',
            'sass expert'
        ],

        // Mots-clés éducation/formation
        education: [
            'gobelins annecy',
            'école des gobelins',
            'gobelins graduate',
            'création numérique interactive',
            'master gobelins',
            'bachelor développement web',
            'dut mmi',
            'alternance mcube',
            'étudiant gobelins',
            'formation développeur créatif'
        ]
    },

    // Descriptions SEO bilingues
    descriptions: {
        home: {
            short_fr: 'Creative Developer spécialisé en ThreeJS/WebGL et GSAP. Diplômé des Gobelins Annecy, je transforme le code en expériences visuelles captivantes.',
            short_en: 'Creative Developer specialized in ThreeJS/WebGL and GSAP. Gobelins Annecy graduate, I transform code into captivating visual experiences.',
            long_fr: 'Valentin Gassend, Creative Developer Full Stack chez Mcube, diplômé de l\'École des Gobelins Annecy. Spécialisé en ThreeJS/WebGL et GSAP, expert en animations web avancées et rendus 3D. Basé en région Rhône-Alpes (Aix-les-Bains, Chambéry, Annecy, Lyon), je crée des expériences interactives mémorables avec React, WordPress et les technologies web modernes.',
            long_en: 'Valentin Gassend, Full Stack Creative Developer at Mcube, graduated from École des Gobelins Annecy. Specialized in ThreeJS/WebGL and GSAP, expert in advanced web animations and 3D rendering. Based in Rhône-Alpes region (Aix-les-Bains, Chambéry, Annecy, Lyon), I create memorable interactive experiences with React, WordPress and modern web technologies.'
        },
        about: {
            short_fr: 'Découvrez le profil de Valentin Gassend, Creative Developer diplômé des Gobelins Annecy, passionné par les technologies 3D et les animations web.',
            short_en: 'Discover the profile of Valentin Gassend, Creative Developer graduated from Gobelins Annecy, passionate about 3D technologies and web animations.',
            long_fr: 'Creative Developer Full Stack en alternance chez Mcube depuis septembre 2024. Diplômé de l\'École des Gobelins Annecy (Bachelor Développement Web et Mobile, Master Création Numérique Interactive en cours). Spécialisé en ThreeJS, WebGL, GSAP, React et WordPress. Expert en optimisation performance et Core Web Vitals. Disponible sur Aix-les-Bains, Chambéry, Annecy et Lyon.',
            long_en: 'Full Stack Creative Developer in apprenticeship at Mcube since September 2024. Graduated from École des Gobelins Annecy (Bachelor Web and Mobile Development, Master Interactive Digital Creation in progress). Specialized in ThreeJS, WebGL, GSAP, React and WordPress. Expert in performance optimization and Core Web Vitals. Available in Aix-les-Bains, Chambéry, Annecy and Lyon.'
        },
        projects: {
            short_fr: 'Portfolio de projets créatifs réalisés avec ThreeJS, WebGL, GSAP, React. Formation École des Gobelins Annecy. Expériences web interactives innovantes.',
            short_en: 'Portfolio of creative projects made with ThreeJS, WebGL, GSAP, React. École des Gobelins Annecy education. Innovative interactive web experiences.',
            long_fr: 'Portfolio de Valentin Gassend, diplômé des Gobelins Annecy, présentant mes projets de développement créatif : applications ThreeJS, animations WebGL, interfaces React, sites WordPress optimisés. Chaque projet démontre mon expertise technique acquise à l\'École des Gobelins et ma créativité en développement web. Réalisations pour clients de la région Rhône-Alpes.',
            long_en: 'Portfolio of Valentin Gassend, Gobelins Annecy graduate, showcasing my creative development projects: ThreeJS applications, WebGL animations, React interfaces, optimized WordPress sites. Each project demonstrates my technical expertise acquired at École des Gobelins and my creativity in web development. Projects for clients in the Rhône-Alpes region.'
        }
    },

    // Réseaux sociaux
    social: {
        linkedin: 'https://www.linkedin.com/in/valentin-gassend/',
        github: 'https://github.com/ValentinGassend',
        twitter: '@ValentinGassend',
        portfolio: 'https://valentingassend.com'
    },

    // Formation
    education: [
        {
            year: '2026',
            degree: 'Master Expert en Création Numérique Interactive',
            school: 'École by CCI - Gobelins Annecy',
            status: 'En cours'
        },
        {
            year: '2024',
            degree: 'Bachelor Développement Web et Mobile',
            school: 'École by CCI - Gobelins Annecy',
            status: 'Obtenu'
        },
        {
            year: '2022',
            degree: 'DUT Métiers du Multimédia et de l\'Internet',
            school: 'USMB - DUT MMI',
            specialization: 'Développement',
            status: 'Obtenu'
        }
    ],

    // Compétences techniques par niveau
    skills: {
        expert: ['ThreeJS', 'React', 'JavaScript', 'GSAP'],
        advanced: ['WebGL', 'WordPress', 'Lenis', 'Sass', 'Vite'],
        intermediate: ['Node.js', 'Twig', 'Blade', 'Core Web Vitals'],
        tools: ['Git', 'Figma', 'Photoshop', 'After Effects']
    },

    // Données structurées par page (multilingue)
    structuredData: {
        person: {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Valentin Gassend',
            jobTitle: 'Creative Developer',
            alternateName: ['Développeur Créatif', 'Creative Developer France'],
            description: 'Creative Developer spécialisé en ThreeJS, WebGL et GSAP, diplômé de l\'École des Gobelins Annecy',
            worksFor: {
                '@type': 'Organization',
                name: 'Mcube',
                description: 'Entreprise de développement web et solutions digitales'
            },
            alumniOf: {
                '@type': 'EducationalOrganization',
                name: 'École des Gobelins',
                alternateName: 'École by CCI - Gobelins Annecy',
                url: 'https://www.gobelins.fr/',
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Annecy',
                    addressRegion: 'Auvergne-Rhône-Alpes',
                    addressCountry: 'FR'
                }
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Aix-les-Bains',
                addressRegion: 'Auvergne-Rhône-Alpes',
                addressCountry: 'FR'
            },
            serviceArea: [
                {
                    '@type': 'City',
                    name: 'Aix-les-Bains',
                    containedInPlace: {
                        '@type': 'AdministrativeArea',
                        name: 'Savoie'
                    }
                },
                {
                    '@type': 'City',
                    name: 'Chambéry',
                    containedInPlace: {
                        '@type': 'AdministrativeArea',
                        name: 'Savoie'
                    }
                },
                {
                    '@type': 'City',
                    name: 'Annecy',
                    containedInPlace: {
                        '@type': 'AdministrativeArea',
                        name: 'Haute-Savoie'
                    }
                },
                {
                    '@type': 'City',
                    name: 'Lyon',
                    containedInPlace: {
                        '@type': 'AdministrativeArea',
                        name: 'Rhône'
                    }
                }
            ],
            knowsAbout: [
                'ThreeJS', 'WebGL', 'GSAP', 'React', 'JavaScript',
                'WordPress', 'Creative Development', 'Web Animation',
                '3D Web Development', 'Performance Optimization',
                'Interactive Experiences', 'Digital Creation',
                'Smooth Scrolling', 'Core Web Vitals'
            ],
            knowsLanguage: [
                {
                    '@type': 'Language',
                    name: 'French',
                    alternateName: 'Français'
                },
                {
                    '@type': 'Language',
                    name: 'English',
                    alternateName: 'Anglais'
                }
            ],
            hasCredential: [
                {
                    '@type': 'EducationalOccupationalCredential',
                    name: 'Master Expert en Création Numérique Interactive',
                    credentialCategory: 'degree',
                    educationalLevel: 'Master',
                    recognizedBy: {
                        '@type': 'EducationalOrganization',
                        name: 'École des Gobelins'
                    }
                },
                {
                    '@type': 'EducationalOccupationalCredential',
                    name: 'Bachelor Développement Web et Mobile',
                    credentialCategory: 'degree',
                    educationalLevel: 'Bachelor',
                    recognizedBy: {
                        '@type': 'EducationalOrganization',
                        name: 'École des Gobelins'
                    }
                }
            ]
        },

        website: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Valentin Gassend - Creative Developer',
            alternateName: 'Portfolio Creative Developer Gobelins',
            url: 'https://valentingassend.com',
            description: 'Portfolio de Valentin Gassend, Creative Developer diplômé des Gobelins spécialisé en ThreeJS, WebGL et GSAP',
            inLanguage: ['fr', 'en'],
            author: {
                '@type': 'Person',
                name: 'Valentin Gassend',
                alumniOf: 'École des Gobelins'
            },
            publisher: {
                '@type': 'Person',
                name: 'Valentin Gassend'
            },
            potentialAction: {
                '@type': 'SearchAction',
                target: 'https://valentingassend.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            },
            mainEntity: {
                '@type': 'Person',
                name: 'Valentin Gassend',
                jobTitle: 'Creative Developer',
                alumniOf: 'École des Gobelins'
            }
        },

        portfolio: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: 'Portfolio Creative Developer - Gobelins Graduate',
            alternateName: 'Portfolio Développeur Créatif',
            creator: {
                '@type': 'Person',
                name: 'Valentin Gassend',
                alumniOf: 'École des Gobelins'
            },
            about: 'Projets de développement créatif utilisant ThreeJS, WebGL, GSAP et React par un diplômé des Gobelins',
            genre: 'Web Development Portfolio',
            inLanguage: ['fr', 'en'],
            keywords: 'Creative Developer, ThreeJS, WebGL, GSAP, Gobelins, Portfolio',
            educationalCredentialAwarded: 'Master Création Numérique Interactive - École des Gobelins'
        },

        // Données pour l'École des Gobelins
        educationalOrganization: {
            '@context': 'https://schema.org',
            '@type': 'EducationalOrganization',
            name: 'École des Gobelins',
            alternateName: 'École by CCI - Gobelins Annecy',
            url: 'https://www.gobelins.fr/',
            description: 'École de référence en création numérique et développement web',
            address: {
                '@type': 'PostalAddress',
                addressLocality: 'Annecy',
                addressRegion: 'Auvergne-Rhône-Alpes',
                addressCountry: 'FR'
            },
            hasAlumni: {
                '@type': 'Person',
                name: 'Valentin Gassend',
                jobTitle: 'Creative Developer'
            }
        }
    },

    // Configuration pour les moteurs de recherche
    searchEngines: {
        google: {
            siteVerification: '', // À ajouter si nécessaire
            analytics: '', // À ajouter si nécessaire
            searchConsole: true
        },
        bing: {
            siteVerification: '' // À ajouter si nécessaire
        }
    },

    // Optimisation performance
    performance: {
        coreWebVitals: {
            lcp: 'Optimisé avec préchargement images',
            fid: 'Optimisé avec code splitting',
            cls: 'Optimisé avec dimensions fixes'
        },
        lighthouse: {
            target: {
                performance: 95,
                accessibility: 100,
                bestPractices: 100,
                seo: 100
            }
        }
    }
};

// Fonction pour générer les mots-clés par page (bilingue)
export function getKeywordsForPage(page, language = 'fr') {
    const keywords = SEO_CONFIG.keywords;

    switch (page) {
        case 'home':
            if (language === 'en') {
                return [
                    ...keywords.primary_en,
                    ...keywords.secondary_en.slice(0, 3),
                    ...keywords.local_en.slice(0, 3),
                    ...keywords.education.slice(0, 2)
                ];
            }
            return [
                ...keywords.primary_fr,
                ...keywords.secondary_fr.slice(0, 3),
                ...keywords.local_fr.slice(0, 3),
                ...keywords.education.slice(0, 2)
            ];

        case 'about':
            if (language === 'en') {
                return [
                    'valentin gassend',
                    'creative developer france',
                    'gobelins annecy graduate',
                    'threejs developer france',
                    'webgl developer rhone alpes',
                    'mcube developer',
                    'interactive digital creation',
                    'french web developer',
                    ...keywords.local_en.slice(0, 4),
                    ...keywords.technical_en.slice(0, 3)
                ];
            }
            return [
                'valentin gassend',
                'creative developer aix les bains',
                'gobelins annecy diplômé',
                'développeur créatif savoie',
                'développeur threejs france',
                'mcube développeur',
                'création numérique interactive',
                'école des gobelins',
                ...keywords.local_fr.slice(0, 4),
                ...keywords.technical_fr.slice(0, 3)
            ];

        case 'projects':
            if (language === 'en') {
                return [
                    'creative developer portfolio',
                    'threejs projects',
                    'webgl projects',
                    'gsap animations',
                    'react projects',
                    'wordpress projects',
                    'gobelins graduate portfolio',
                    'interactive experiences',
                    ...keywords.technical_en,
                    ...keywords.local_en.slice(0, 2)
                ];
            }
            return [
                'portfolio creative developer',
                'projets threejs',
                'projets webgl',
                'animations gsap',
                'projets react',
                'projets wordpress',
                'portfolio gobelins',
                'expériences interactives',
                ...keywords.technical_fr,
                ...keywords.local_fr.slice(0, 2)
            ];

        case 'project':
            if (language === 'en') {
                return [
                    'creative developer project',
                    'threejs development',
                    'webgl development',
                    'gsap animation',
                    'react development',
                    'interactive project',
                    'gobelins project',
                    'creative coding'
                ];
            }
            return [
                'projet creative developer',
                'développement créatif',
                'projet threejs',
                'développement webgl',
                'animation gsap',
                'développement react',
                'projet interactif',
                'projet gobelins'
            ];

        default:
            if (language === 'en') {
                return [...keywords.primary_en, ...keywords.secondary_en.slice(0, 5), ...keywords.education.slice(0, 2)];
            }
            return [...keywords.primary_fr, ...keywords.secondary_fr.slice(0, 5), ...keywords.education.slice(0, 2)];
    }
}

// Fonction pour générer la description par page (bilingue)
export function getDescriptionForPage(page, projectId = null, language = 'fr') {
    const descriptions = SEO_CONFIG.descriptions;

    switch (page) {
        case 'home':
            return language === 'en' ? descriptions.home.long_en : descriptions.home.long_fr;

        case 'about':
            return language === 'en' ? descriptions.about.long_en : descriptions.about.long_fr;

        case 'projects':
            return language === 'en' ? descriptions.projects.long_en : descriptions.projects.long_fr;

        case 'project':
            if (language === 'en') {
                return `Discover project ${projectId} by Valentin Gassend, Creative Developer and Gobelins Annecy graduate. Implementation using ThreeJS, WebGL, GSAP or React with performance optimization and refined user experience.`;
            }
            return `Découvrez le projet ${projectId} de Valentin Gassend, Creative Developer diplômé des Gobelins Annecy. Réalisation utilisant ThreeJS, WebGL, GSAP ou React avec optimisation performance et expérience utilisateur soignée.`;

        default:
            return language === 'en' ? descriptions.home.short_en : descriptions.home.short_fr;
    }
}

// Fonction pour générer le titre par page (bilingue)
export function getTitleForPage(page, projectId = null, language = 'fr') {
    const { personal, professional } = SEO_CONFIG;

    switch (page) {
        case 'home':
            if (language === 'en') {
                return `${personal.name} - ${professional.titleEn} | ${professional.subtitleEn} | Gobelins Graduate`;
            }
            return `${personal.name} - ${professional.title} | ${professional.subtitle} | Diplômé Gobelins`;

        case 'about':
            if (language === 'en') {
                return `About - ${personal.name} | ${professional.titleEn} Gobelins Annecy | Rhône-Alpes`;
            }
            return `À Propos - ${personal.name} | ${professional.title} Gobelins Annecy | Rhône-Alpes`;

        case 'projects':
            if (language === 'en') {
                return `Projects & Portfolio - ${personal.name} | ThreeJS WebGL GSAP | Gobelins Graduate`;
            }
            return `Projets & Portfolio - ${personal.name} | ThreeJS WebGL GSAP | Diplômé Gobelins`;

        case 'project':
            if (language === 'en') {
                return `Project ${projectId} - ${personal.name} | Creative Development | Gobelins`;
            }
            return `Projet ${projectId} - ${personal.name} | Développement Créatif | Gobelins`;

        default:
            if (language === 'en') {
                return `${personal.name} - ${professional.titleEn} | Gobelins Graduate`;
            }
            return `${personal.name} - ${professional.title} | Diplômé Gobelins`;
    }
}

export default SEO_CONFIG;