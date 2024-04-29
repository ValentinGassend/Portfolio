const projects = [{
    id: 1,
    year: 2022,
    client: "Gobelins",
    title: "Syndesi.",
    tags: ["Site web", "Dataviz", "Gsap", "Echarts", "Mapbox"],
    content: {
        description: "Syndesi. est la formalisation de plusieurs de mois de réflexions autour d’une thématique imposé “Prends de la hauteur, utiliser les données produites de l’espace pour regarder vers la Terre... ou ailleurs !”.\n\nCe projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. C’est d'ailleur en cherchant, au seins du groupe, une cause qui nous tenais à cœur que nous avons choisi de nous concentrer sur l'écologie.",
        history: "Syndesi. est née d’une information clé: plus de 4 jeunes sur 5 ont une pensée concernant l’écologie dans leurs journées. \nEn effet Syndesi à pour objectif d’accompagner toutes personnes qui se sentent concernées par l’urgence climatique et qui souhaitent en apprendre sur le rôle qu’elles peuvent jouer.",
        why: "En effet la datavisualisation des informations et la dynamisation de la page web à, selon nous, été le meilleur moyen de communiquer les informations souhaitées et de répondre à la problématique du projet étudiant “Prendre de la hauteur” tout en faisait du “data storytelling”.",
        how: "Syndesi. se découpe en plusieurs étapes, seul la première a été développé pour des raisons de temps. L’idée était de prendre une action quotidienne et de montrer son impacte en changeants d’échelles.\nLa homepage elle, contribue à personnalisé l’expérience pour parler directement au visiteur.",
        what: "En tant que seul développeur de l’équipe je me suis occupé de l’ensemble de l’intégration de la maquette ainsi que des animations.\n\nLe site Syndesi. rassemble Echarts et Mapbox afin de représenter visuellement certaines données. \nGsap à, en plus de dynamisé le site, contribué à l’aspect fils rouge de l’action quotidienne avec un élément qui nous suit tout au long du scroll représentatif du changement d’échelle. \nLottie à également été un facilitateur de dynamisation du site, il a permis d’alléger les animations en les remplaçant par des séquences vidéos facilement manipulables.",
        credits: [{
            link: "https://www.instagram.com/rever.dsgn/",
            content: "Baptiste SINHSATANAK, Designer graphique"
        }, {
            link: "https://bento.me/melisseclivaz",
            content: "Melisse CLIVAZ, Designer graphique"
        }],
        inspiration: [],
        links: [{
            url: "https://syndesi.vercel.app/", title: "Voir le site",
        }, {
            url: "https://github.com/ValentinGassend/Syndesi.", title: "Voir le repo github",
        },],
    },
    color: "#4D407D",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000",

}, {
    id: 2,
    year: 2019,
    client: "Hugo Pinna",
    title: "Portfolio Hugo PINNA",
    tags: ["Site web", "React", "Gsap"],
    content: {
        description: "Une application mobile interactive conçue pour sensibiliser le grand public aux problématiques environnementales et encourager des actions individuelles et collectives en faveur de l'environnement.",
        history: "Développé en collaboration avec l'Association ABC, le projet a été lancé avec succès en 2019 et a reçu un accueil positif, atteignant rapidement un large public.",
        why: "Pour répondre au besoin croissant de sensibilisation du public aux problématiques environnementales et encourager des actions concrètes pour la protection de l'environnement.",
        how: "L'application a été développée en utilisant les dernières technologies mobiles et en s'appuyant sur des données scientifiques pour fournir des informations précises sur les questions environnementales.",
        what: "L'application permet aux utilisateurs d'accéder à des informations sur les problématiques environnementales, de participer à des actions de sensibilisation et de partager leurs propres initiatives écologiques.",
        credits: [{
            link: "https://hugopinna.com/",
            content: "Hugo Pinna, designer Graphique"
        }],
        inspiration: [],
        links: [{
            url: "https://hugopinna.com/", title: "Voir le site",
        }, {
            url: "https://example.com/link2", title: "Titre du lien 2",
        },],
    },
    color: "#33FF57",
    isPromoted: false,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 3,
    year: 2021,
    client: "Startup XYZ",
    title: "Site web de commerce électronique",
    tags: ["Site web", "Commerce électronique", "Développement web"],
    content: {
        description: "Un site web de commerce électronique dynamique conçu pour offrir aux clients une expérience de magasinage en ligne intuitive et sécurisée.",
        history: "Lancé en 2021 par la startup XYZ, le site web de commerce électronique a rapidement attiré l'attention des consommateurs et a généré une croissance significative des ventes.",
        why: "Pour permettre à la startup XYZ d'entrer sur le marché du commerce électronique et de proposer ses produits à un public plus large.",
        how: "Le site web a été développé en utilisant les dernières technologies web et en se concentrant sur une conception conviviale et responsive pour offrir une expérience utilisateur optimale.",
        what: "Le site web permet aux utilisateurs de parcourir une large sélection de produits, de passer des commandes en toute sécurité et de suivre leur livraison en temps réel.",
        credits: [{
            link: "https://example.com/credit1",
            content: "Conception et développement par une équipe talentueuse de développeurs web de la startup XYZ, avec un accent particulier sur la convivialité et la performance."
        }, {
            link: "https://example.com/credit2",
            content: "Intégration des systèmes de paiement sécurisés par un partenaire spécialisé."
        }],
        inspiration: [{
            url: "https://example.com/inspiration1", title: "Titre de l'inspiration 1",
        }, {
            url: "https://example.com/inspiration2", title: "Titre de l'inspiration 2",
        },],
        links: [{
            url: "https://example.com/link1", title: "Titre du lien 1",
        }, {
            url: "https://example.com/link2", title: "Titre du lien 2",
        },],
    },
    color: "#3366FF",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 4,
    year: 2018,
    client: "Organisation non gouvernementale (ONG)",
    title: "Système de gestion des bénévoles",
    tags: ["Gestion des bénévoles", "ONG", "Développement logiciel"],
    content: {
        description: "Un système de gestion des bénévoles complet conçu pour aider l'ONG à coordonner et à suivre les activités de ses bénévoles de manière efficace.",
        history: "Développé en 2018 pour répondre aux besoins croissants de l'ONG en matière de gestion des bénévoles, le système a grandement simplifié les processus de recrutement, de suivi et de communication.",
        why: "Pour permettre à l'ONG de mieux organiser ses activités bénévoles, d'optimiser l'affectation des ressources humaines et de maximiser l'impact de ses projets.",
        how: "Le système a été conçu en collaboration avec les membres de l'ONG, en tenant compte de leurs besoins spécifiques et en s'appuyant sur les meilleures pratiques en matière de gestion des bénévoles.",
        what: "Le système permet à l'ONG de gérer les profils des bénévoles, d'attribuer des tâches, de suivre les heures de service et de communiquer efficacement avec les volontaires.",
        credits: [{
            link: "https://example.com/credit1",
            content: "Développé par une équipe dédiée de développeurs logiciels en partenariat étroit avec les responsables et les membres de l'ONG."
        }, {
            link: "https://example.com/credit2",
            content: "Testé et amélioré grâce aux retours des utilisateurs bénévoles."
        }],
        inspiration: [{
            url: "https://example.com/inspiration1", title: "Titre de l'inspiration 1",
        }, {
            url: "https://example.com/inspiration2", title: "Titre de l'inspiration 2",
        },],
        links: [{
            url: "https://example.com/link1", title: "Titre du lien 1",
        }, {
            url: "https://example.com/link2", title: "Titre du lien 2",
        },],
    },
    color: "#FF33FF",
    isPromoted: false,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 5,
    year: 2022,
    client: "Société ABC",
    title: "Application de gestion des tâches",
    tags: ["Application de productivité", "Gestion des tâches", "Développement d'applications"],
    content: {
        description: "Une application de gestion des tâches intuitive conçue pour aider les employés de la société ABC à organiser, suivre et prioriser leurs tâches quotidiennes.",
        history: "Lancée en 2022, l'application de gestion des tâches a considérablement amélioré l'efficacité et la productivité des employés de la société ABC en rationalisant les processus de travail et en réduisant les retards.",
        why: "Pour répondre au besoin croissant de la société ABC en matière d'organisation et de suivi des tâches, et pour améliorer la gestion du temps et des ressources.",
        how: "L'application a été développée en utilisant une approche centrée sur l'utilisateur, en tenant compte des retours des employés et en s'appuyant sur les meilleures pratiques en matière de gestion des tâches.",
        what: "L'application permet aux utilisateurs de créer des listes de tâches, d'établir des priorités, de définir des rappels et de collaborer avec leurs collègues sur des projets communs.",
        credits: [{
            link: "https://example.com/credit1",
            content: "Développée par une équipe de développeurs d'applications dévouée de la société ABC, en collaboration avec les départements internes concernés."
        }],
        inspiration: [{
            url: "https://example.com/inspiration1", title: "Titre de l'inspiration 1",
        }, {
            url: "https://example.com/inspiration2", title: "Titre de l'inspiration 2",
        },],
        links: [{
            url: "https://example.com/link1", title: "Titre du lien 1",
        }, {
            url: "https://example.com/link2", title: "Titre du lien 2",
        },],
    },
    color: "#FFFF33",
    isPromoted: false,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 6,
    year: 2023,
    client: "Startup ABC",
    title: "Plateforme de réservation de salles de réunion",
    tags: ["Plateforme web", "Réservation de salles", "Développement d'applications"],
    content: {
        description: "Une plateforme web de réservation de salles de réunion flexible conçue pour simplifier le processus de planification des réunions pour les employés de la startup ABC.",
        history: "Lancée en 2023, la plateforme de réservation de salles de réunion a permis à la startup ABC d'optimiser l'utilisation de ses espaces de réunion et d'améliorer la collaboration entre les équipes.",
        why: "Pour répondre au besoin croissant de la startup ABC en matière de gestion efficace des salles de réunion et pour réduire les conflits de réservation et les retards.",
        how: "La plateforme a été développée en utilisant une approche agile, en impliquant les utilisateurs finaux dès les premières phases de conception et en s'appuyant sur les technologies web modernes.",
        what: "La plateforme permet aux utilisateurs de consulter la disponibilité des salles, de réserver des créneaux horaires, d'inviter des participants et de recevoir des rappels de réunion.",
        credits: [{
            link: "https://example.com/credit1",
            content: "Développée par une équipe multidisciplinaire de développeurs web et de spécialistes en expérience utilisateur de la startup ABC."
        }, {
            link: "https://example.com/credit2",
            content: "Conception basée sur des études approfondies sur les besoins des utilisateurs."
        }],
        inspiration: [{
            url: "https://example.com/inspiration1", title: "Titre de l'inspiration 1",
        }, {
            url: "https://example.com/inspiration2", title: "Titre de l'inspiration 2",
        },],
        links: [{
            url: "https://example.com/link1", title: "Titre du lien 1",
        }, {
            url: "https://example.com/link2", title: "Titre du lien 2",
        },],
    },
    color: "#33FFFF",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000"
},];

export default projects;
