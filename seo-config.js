// seo-config.js - Configuration SEO bilingue pour développeur web freelance - OPTIMISÉ
export const SEO_CONFIG = {
    // Informations personnelles
    personal: {
        name: 'Valentin',
        fullName: 'Valentin Gassend',
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
        title: 'Développeur web freelance WordPress',
        subtitle: 'Aix-les-Bains & Annecy',
        titleEn: 'Freelance Web Developer WordPress',
        subtitleEn: 'Aix-les-Bains & Annecy',
        jobTitle: 'Développeur web freelance - Spécialiste WordPress',
        jobTitleEn: 'Freelance Web Developer - WordPress Specialist',
        company: 'Mcube',
        experience: 'Freelance disponible - 3 ans d\'expérience',
        experienceEn: 'Available freelance - 3 years experience',
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

        // Spécialités techniques (français/anglais) - RÉORGANISÉES
        specialties: {
            fr: [
                'WordPress', 'Développement web', 'Sites sur mesure', 'Animations créatives',
                'React', 'JavaScript', 'ThreeJS', 'WebGL', 'GSAP',
                'Lenis', 'Twig', 'Blade', 'Sass', 'Vite', 'Node.js',
                'Core Web Vitals', 'Performance Web', 'Responsive Design',
                'Développement Créatif', 'Expériences Interactives'
            ],
            en: [
                'WordPress', 'Web Development', 'Custom Websites', 'Creative Animations',
                'React', 'JavaScript', 'ThreeJS', 'WebGL', 'GSAP',
                'Lenis', 'Twig', 'Blade', 'Sass', 'Vite', 'Node.js',
                'Core Web Vitals', 'Web Performance', 'Responsive Design',
                'Creative Development', 'Interactive Experiences'
            ]
        },

        // Secteurs d'activité
        sectors: {
            fr: ['Freelance Web', 'Développement WordPress', 'Création Numérique', 'Sites Internet'],
            en: ['Freelance Web', 'WordPress Development', 'Digital Creation', 'Website Creation']
        },

        // Langues
        languages: [
            { name: 'Français', nameEn: 'French', level: 'Natif', levelEn: 'Native' },
            { name: 'Anglais', nameEn: 'English', level: 'Professionnel', levelEn: 'Professional' }
        ]
    },

    // Mots-clés SEO bilingues par importance - COMPLÈTEMENT RÉORGANISÉS
    keywords: {
        // Mots-clés principaux (français) - FOCUS LOCAL + WORDPRESS
        primary_fr: [
            'développeur web freelance aix-les-bains',
            'freelance wordpress aix-les-bains',
            'développeur wordpress aix-les-bains',
            'creative developer annecy freelance',
            'développeur web aix-les-bains',
            'freelance aix-les-bains',
            'valentin gassend',
            'développeur freelance savoie'
        ],

        // Mots-clés principaux (anglais)
        primary_en: [
            'freelance web developer aix-les-bains',
            'wordpress developer aix-les-bains',
            'freelance wordpress aix-les-bains',
            'creative developer annecy freelance',
            'web developer aix-les-bains',
            'freelance developer france',
            'valentin gassend',
            'freelance developer savoie'
        ],

        // Mots-clés secondaires (français)
        secondary_fr: [
            'développeur web freelance annecy',
            'freelance wordpress annecy',
            'développeur wordpress annecy',
            'créateur site web aix-les-bains',
            'développeur web chambéry',
            'freelance développeur savoie',
            'site internet sur mesure aix-les-bains',
            'animations web créatives',
            'développeur react freelance',
            'création site wordpress',
            'développeur web haute-savoie',
            'freelance web savoie'
        ],

        // Mots-clés secondaires (anglais)
        secondary_en: [
            'freelance web developer annecy',
            'wordpress developer annecy',
            'freelance wordpress annecy',
            'website creator aix-les-bains',
            'web developer chambery',
            'freelance developer savoie',
            'custom website aix-les-bains',
            'creative web animations',
            'freelance react developer',
            'wordpress website creation',
            'web developer haute-savoie',
            'freelance web savoie'
        ],

        // SEO local multi-villes (français) - PRIORITÉ WORDPRESS
        local_fr: [
            'développeur wordpress freelance aix-les-bains',
            'freelance wordpress aix-les-bains pas cher',
            'créateur site web aix-les-bains',
            'développeur web freelance chambéry',
            'freelance wordpress annecy',
            'développeur site internet aix-les-bains',
            'freelance développeur web savoie',
            'création site wordpress aix-les-bains',
            'développeur web annecy',
            'freelance web haute-savoie',
            'développeur wordpress chambéry',
            'site internet freelance aix-les-bains',
            'développeur web lyon freelance',
            'création site web savoie'
        ],

        // SEO local multi-villes (anglais)
        local_en: [
            'freelance wordpress developer aix-les-bains',
            'wordpress freelance aix-les-bains',
            'website creator aix-les-bains',
            'freelance web developer chambery',
            'wordpress freelance annecy',
            'website developer aix-les-bains',
            'freelance web developer savoie',
            'wordpress website creation aix-les-bains',
            'web developer annecy',
            'freelance web haute-savoie',
            'wordpress developer chambery',
            'freelance website aix-les-bains',
            'web developer lyon freelance',
            'website creation savoie'
        ],

        // Mots-clés techniques (français) - WORDPRESS EN PREMIER
        technical_fr: [
            'développement wordpress avancé',
            'site wordpress sur mesure',
            'animations css avancées',
            'optimisation wordpress',
            'site web responsive',
            'performance web wordpress',
            'javascript pour wordpress',
            'react développement',
            'animations gsap',
            'threejs intégration',
            'lenis smooth scroll',
            'core web vitals',
            'seo wordpress',
            'wordpress headless'
        ],

        // Mots-clés techniques (anglais)
        technical_en: [
            'advanced wordpress development',
            'custom wordpress website',
            'advanced css animations',
            'wordpress optimization',
            'responsive web design',
            'wordpress web performance',
            'javascript for wordpress',
            'react development',
            'gsap animations',
            'threejs integration',
            'lenis smooth scroll',
            'core web vitals',
            'wordpress seo',
            'headless wordpress'
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

    // Descriptions SEO bilingues - COMPLÈTEMENT RÉÉCRITES
    descriptions: {
        home: {
            short_fr: 'Développeur web freelance sur Aix-les-Bains et Annecy, spécialisé WordPress, animations créatives et sites sur mesure depuis 3 ans.',
            short_en: 'Freelance web developer in Aix-les-Bains and Annecy, specialized in WordPress, creative animations and custom websites for 3 years.',
            long_fr: 'Valentin, développeur web freelance basé à Aix-les-Bains. Création de sites WordPress, animations web créatives et expériences sur mesure pour entreprises en Savoie et Haute-Savoie. Diplômé de l\'École des Gobelins Annecy, expert en développement WordPress, React et animations web. Disponible pour vos projets web créatifs.',
            long_en: 'Valentin, freelance web developer based in Aix-les-Bains. WordPress websites creation, creative web animations and custom experiences for businesses in Savoie and Haute-Savoie. Graduate from École des Gobelins Annecy, expert in WordPress development, React and web animations. Available for your creative web projects.'
        },
        about: {
            short_fr: 'Développeur web freelance diplômé des Gobelins Annecy, passionné par WordPress et les animations web créatives.',
            short_en: 'Freelance web developer graduated from Gobelins Annecy, passionate about WordPress and creative web animations.',
            long_fr: 'Développeur web freelance en alternance chez Mcube depuis septembre 2024. Diplômé de l\'École des Gobelins Annecy (Bachelor Développement Web et Mobile, Master Création Numérique Interactive en cours). Spécialisé en WordPress, React, animations créatives et optimisation performance. Expert en création de sites sur mesure. Disponible sur Aix-les-Bains, Chambéry, Annecy et Lyon.',
            long_en: 'Freelance web developer in apprenticeship at Mcube since September 2024. Graduated from École des Gobelins Annecy (Bachelor Web and Mobile Development, Master Interactive Digital Creation in progress). Specialized in WordPress, React, creative animations and performance optimization. Expert in custom website creation. Available in Aix-les-Bains, Chambéry, Annecy and Lyon.'
        },
        projects: {
            short_fr: 'Portfolio de sites WordPress et projets créatifs réalisés avec animations web innovantes. Formation École des Gobelins Annecy.',
            short_en: 'Portfolio of WordPress websites and creative projects made with innovative web animations. École des Gobelins Annecy education.',
            long_fr: 'Portfolio de Valentin, développeur web freelance diplômé des Gobelins Annecy, présentant mes créations : sites WordPress sur mesure, animations web créatives, interfaces React, expériences interactives. Chaque projet démontre mon expertise technique acquise à l\'École des Gobelins et ma créativité en développement web. Réalisations pour clients de la région Rhône-Alpes.',
            long_en: 'Portfolio of Valentin, freelance web developer graduated from Gobelins Annecy, showcasing my creations: custom WordPress websites, creative web animations, React interfaces, interactive experiences. Each project demonstrates my technical expertise acquired at École des Gobelins and my creativity in web development. Projects for clients in the Rhône-Alpes region.'
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

    // Compétences techniques par niveau - RÉORGANISÉES
    skills: {
        expert: ['WordPress', 'React', 'JavaScript', 'Développement web'],
        advanced: ['GSAP', 'ThreeJS', 'WebGL', 'Animations créatives', 'Sass', 'Vite'],
        intermediate: ['Node.js', 'Twig', 'Blade', 'Core Web Vitals', 'Lenis'],
        tools: ['Git', 'Figma', 'Photoshop', 'After Effects']
    },

    // Données structurées par page (multilingue) - MISES À JOUR
    structuredData: {
        person: {
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Valentin Gassend',
            jobTitle: 'Développeur web freelance WordPress',
            alternateName: ['Valentin', 'Développeur web Aix-les-Bains', 'Freelance WordPress Aix-les-Bains'],
            description: 'Développeur web freelance spécialisé en WordPress et animations créatives, diplômé de l\'École des Gobelins Annecy',
            worksFor: {
                '@type': 'Organization',
                name: 'Freelance',
                description: 'Développeur web freelance disponible pour projets WordPress et sites créatifs'
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
                'WordPress', 'Développement web', 'Sites sur mesure', 'Animations créatives',
                'React', 'JavaScript', 'ThreeJS', 'WebGL', 'GSAP',
                'Création de sites internet', 'Optimisation performance',
                'Expériences interactives', 'Développement créatif',
                'Responsive Design', 'Core Web Vitals'
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
            ],
            offers: {
                '@type': 'Offer',
                itemOffered: {
                    '@type': 'Service',
                    name: 'Développement web freelance',
                    description: 'Création de sites WordPress, animations web créatives, développement React',
                    provider: {
                        '@type': 'Person',
                        name: 'Valentin Gassend'
                    },
                    areaServed: ['Aix-les-Bains', 'Annecy', 'Chambéry', 'Lyon', 'Savoie', 'Haute-Savoie']
                }
            }
        },

        website: {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'Valentin - Développeur web freelance WordPress Aix-les-Bains',
            alternateName: 'Portfolio Développeur web Freelance Gobelins',
            url: 'https://valentingassend.com',
            description: 'Portfolio de Valentin, développeur web freelance diplômé des Gobelins spécialisé en WordPress, animations créatives et sites sur mesure',
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
                jobTitle: 'Développeur web freelance WordPress',
                alumniOf: 'École des Gobelins'
            }
        },

        portfolio: {
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: 'Portfolio Développeur web freelance - Gobelins Graduate',
            alternateName: 'Portfolio Développeur WordPress Freelance',
            creator: {
                '@type': 'Person',
                name: 'Valentin Gassend',
                alumniOf: 'École des Gobelins'
            },
            about: 'Projets de développement web utilisant WordPress, animations créatives et React par un diplômé des Gobelins',
            genre: 'Freelance Web Development Portfolio',
            inLanguage: ['fr', 'en'],
            keywords: 'Développeur web freelance, WordPress, Animations créatives, Gobelins, Portfolio',
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
                jobTitle: 'Développeur web freelance WordPress'
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

// Fonction pour générer les mots-clés par page (bilingue) - MISE À JOUR
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
                    'freelance web developer aix-les-bains',
                    'gobelins annecy graduate',
                    'wordpress developer france',
                    'freelance wordpress aix-les-bains',
                    'web developer rhone alpes',
                    'freelance developer available',
                    'french web developer',
                    ...keywords.local_en.slice(0, 4),
                    ...keywords.technical_en.slice(0, 3)
                ];
            }
            return [
                'valentin gassend',
                'développeur web freelance aix-les-bains',
                'gobelins annecy diplômé',
                'développeur wordpress freelance savoie',
                'freelance wordpress aix-les-bains',
                'développeur web disponible',
                'création site web aix-les-bains',
                'école des gobelins',
                ...keywords.local_fr.slice(0, 4),
                ...keywords.technical_fr.slice(0, 3)
            ];

        case 'projects':
            if (language === 'en') {
                return [
                    'freelance web developer portfolio',
                    'wordpress projects',
                    'creative web animations',
                    'custom website projects',
                    'react projects',
                    'gobelins graduate portfolio',
                    'interactive web experiences',
                    'freelance portfolio',
                    ...keywords.technical_en,
                    ...keywords.local_en.slice(0, 2)
                ];
            }
            return [
                'portfolio développeur web freelance',
                'projets wordpress',
                'animations web créatives',
                'projets sites sur mesure',
                'projets react',
                'portfolio gobelins',
                'expériences web interactives',
                'portfolio freelance',
                ...keywords.technical_fr,
                ...keywords.local_fr.slice(0, 2)
            ];

        case 'project':
            if (language === 'en') {
                return [
                    'freelance web project',
                    'wordpress development',
                    'creative web development',
                    'custom website development',
                    'react development',
                    'interactive project',
                    'gobelins project',
                    'freelance web work'
                ];
            }
            return [
                'projet développeur web freelance',
                'développement wordpress',
                'développement web créatif',
                'développement site sur mesure',
                'développement react',
                'projet interactif',
                'projet gobelins',
                'travail freelance web'
            ];

        default:
            if (language === 'en') {
                return [...keywords.primary_en, ...keywords.secondary_en.slice(0, 5), ...keywords.education.slice(0, 2)];
            }
            return [...keywords.primary_fr, ...keywords.secondary_fr.slice(0, 5), ...keywords.education.slice(0, 2)];
    }
}

// Fonction pour générer la description par page (bilingue) - MISE À JOUR
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
                return `Discover project ${projectId} by Valentin, freelance web developer and Gobelins Annecy graduate. WordPress development, creative animations or React with performance optimization and refined user experience.`;
            }
            return `Découvrez le projet ${projectId} de Valentin, développeur web freelance diplômé des Gobelins Annecy. Développement WordPress, animations créatives ou React avec optimisation performance et expérience utilisateur soignée.`;

        default:
            return language === 'en' ? descriptions.home.short_en : descriptions.home.short_fr;
    }
}

// Fonction pour générer le titre par page (bilingue) - MISE À JOUR
export function getTitleForPage(page, projectId = null, language = 'fr') {
    const { personal, professional } = SEO_CONFIG;

    switch (page) {
        case 'home':
            if (language === 'en') {
                return `${personal.name}, freelance web developer WordPress | ${professional.subtitleEn} | Gobelins Graduate`;
            }
            return `${personal.name}, développeur web freelance WordPress | ${professional.subtitle} | Diplômé Gobelins`;

        case 'about':
            if (language === 'en') {
                return `About - ${personal.name} | Freelance Web Developer Gobelins Annecy | WordPress Specialist`;
            }
            return `À Propos - ${personal.name} | Développeur web freelance Gobelins Annecy | Spécialiste WordPress`;

        case 'projects':
            if (language === 'en') {
                return `Projects & Portfolio - ${personal.name} | WordPress & Creative Web | Gobelins Graduate`;
            }
            return `Projets & Portfolio - ${personal.name} | WordPress & Web Créatif | Diplômé Gobelins`;

        case 'project':
            if (language === 'en') {
                return `Project ${projectId} - ${personal.name} | Freelance Web Development | Gobelins`;
            }
            return `Projet ${projectId} - ${personal.name} | Développement web freelance | Gobelins`;

        default:
            if (language === 'en') {
                return `${personal.name} - Freelance Web Developer WordPress | Gobelins Graduate`;
            }
            return `${personal.name} - Développeur web freelance WordPress | Diplômé Gobelins`;
    }
}

export default SEO_CONFIG;