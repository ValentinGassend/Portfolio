const projects = [{
    id: 1,
    year: 2022,
    client: "Gobelins",
    title: "Syndesi.",
    tags: ["Site web", "Dataviz", "Gsap", "Echarts", "Mapbox"],
    content: {
        description: {
            text: "Syndesi. est la formalisation de plusieurs de mois de réflexions autour d’une thématique imposé “Prends de la hauteur, utiliser les données produites de l’espace pour regarder vers la Terre... ou ailleurs !”.\n\nCe projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. C’est d'ailleur en cherchant, au seins du groupe, une cause qui nous tenais à cœur que nous avons choisi de nous concentrer sur l'écologie.",
            image: "https://picsum.photos/2000/3000"
        }, history: {
            text: "Syndesi. est née d’une information clé: plus de 4 jeunes sur 5 ont une pensée concernant l’écologie dans leurs journées. \nEn effet Syndesi à pour objectif d’accompagner toutes personnes qui se sentent concernées par l’urgence climatique et qui souhaitent en apprendre sur le rôle qu’elles peuvent jouer.",
            image: "https://picsum.photos/1000/3000"
        }, why: {
            text: "En effet la datavisualisation des informations et la dynamisation de la page web à, selon nous, été le meilleur moyen de communiquer les informations souhaitées et de répondre à la problématique du projet étudiant “Prendre de la hauteur” tout en faisait du “data storytelling”.",
            image: "https://picsum.photos/2000/2000"
        }, how: {
            text: "Syndesi. se découpe en plusieurs étapes, seul la première a été développé pour des raisons de temps. L’idée était de prendre une action quotidienne et de montrer son impacte en changeants d’échelles.\nLa homepage elle, contribue à personnalisé l’expérience pour parler directement au visiteur.",
            image: "https://picsum.photos/2000/1000"
        }, what: {
            text: "En tant que seul développeur de l’équipe je me suis occupé de l’ensemble de l’intégration de la maquette ainsi que des animations.\n\nLe site Syndesi. rassemble Echarts et Mapbox afin de représenter visuellement certaines données. \nGsap à, en plus de dynamisé le site, contribué à l’aspect fils rouge de l’action quotidienne avec un élément qui nous suit tout au long du scroll représentatif du changement d’échelle. \nLottie à également été un facilitateur de dynamisation du site, il a permis d’alléger les animations en les remplaçant par des séquences vidéos facilement manipulables.",
            image: "https://picsum.photos/3000/3000"
        }, credits: [{
            link: "https://www.instagram.com/rever.dsgn/", content: "Baptiste SINHSATANAK, Designer graphique"
        }, {
            link: "https://bento.me/melisseclivaz", content: "Melisse CLIVAZ, Designer graphique"
        }], inspiration: [], links: [{
            url: "https://syndesi.vercel.app/", title: "Voir le site"
        }, {
            url: "https://github.com/ValentinGassend/Syndesi.", title: "Voir le repo github"
        }]
    },
    color: "#C52D48",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 2,
    year: 2023,
    client: "Gobelins",
    title: "Liveo",
    tags: ["IOT", "Python", "IA", "Whisper"],
    content: {
        description: "Ce projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. Le projet s’est déroulé sur 4 mois, en commençant par l’idéation pour se terminer par une soutenance avec démonstration du produit. Ce projet s’est tenu en collaboration avec l’association Renaissance d’Annecy.",
        history: "C’est après avoir constaté que plus d’1 senior sur 5 était concerné par la perte de mémoire que Liveo a émergé. En effet, Liveo a pour but de fiabiliser la prise de rendez-vous des personnes âgées afin de leur faire gagner en autonomie.",
        why: "Liveo répond à une nécessité de s'ancrer dans le monde réel, c’est pourquoi il était nécessaire que Liveo soit un objet connecté voire embarqué. Fiable, autonome et discret, Liveo doit s’intégrer dans le quotidien des personnes âgées pour les soulager mentalement.",
        how: "Liveo repose sur de multiples composants IoT, de l'appui sur un bouton jusqu'à la compréhension et la retranscription vocale des informations fournies par un utilisateur, en passant par une reconnaissance de badge, des retours visuels et sonores, une communication interne en Bluetooth, et bien d'autres encore. Tout ceci permet de récupérer un certain nombre d'informations qu'il suffit d'analyser et d'enregistrer méthodiquement dans l'objet connecté.",
        what: "En tant que seul développeur de l’équipe, je me suis occupé de l’ensemble du développement de l’objet connecté.\n" +
            "\n" +
            "Liveo regroupe un ESP32, un Raspberry Pi, divers modules de communication tels que le Bluetooth, le wifi ou le RFID, ainsi que Whisper, le modèle d’intelligence artificielle de reconnaissance et de transcription vocale.\n" +
            "\n" +
            "L’ensemble de l’objet est développé en Python et une grosse partie reprend, techniquement, les bases d’une gestion d’agenda.\n" +
            "\n" +
            "Un site web promotionnel a également été produit, mais celui-ci n’a pas été publié en raison de contraintes de temps et de priorité.",
        credits: [{
            link: "https://bento.me/melisseclivaz", content: "Mélisse CLIVAZ, Designer graphique & cheffe de projet"
        },{
            link: "https://www.instagram.com/kinou_design/", content: "Kilian Rizzo, Designer graphique"
        }],
        inspiration: [],
        links: [{
            url: "https://github.com/ValentinGassend/Liveo", title: "voir le repo github",
        },{
            url: "https://vimeo.com/941742794", title: "Video promotionnelle",
        }, {
            url: "https://liveo-website.vercel.app/", title: "Voir le site promotionnel",
        },],
    },
    color: "#333896",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 3,
    year: 2024,
    client: "Hugo PINNA",
    title: "Portfolio Hugo PINNA",
    tags: ["Site internet", "Animation", "React", "Gsap", "Lottie"],
    content: {
        description: "Ce projet est le fruit d’une collaboration avec Hugo Pinna. L’objectif était de réaliser un site qui mettait en avant l’ensemble de son travail, en respectant une direction artistique précise et qui se démarquait.",
        history: "Hugo Pinna est un ami, camarade de classe et freelance. Nous avons également été collègues pendant nos deux premières années d’alternance. C’est à ce moment-là que la proposition de ce portfolio est née. Une demande créative et ambitieuse qui m’a immédiatement séduit.",
        why: "Ce portfolio devait refléter l’image d’Hugo, mais également se démarquer visuellement et techniquement. Dans le monde du design graphique, la concurrence est forte et chaque détail peut avoir son importance.",
        how: "Puisque nous étions techniquement différents de la concurrence, nous nous devions d'aller plus loin que de simples timing d'animation sur quelques survols. Il a fallu penser à des mécaniques originales, créatives et surtout qui avaient du sens dans l'idée générale.",
        what: "Pour cela, le projet s’est construit avec React. J’ai rapidement intégré GSAP pour la gestion de tous les événements au scroll.\n" +
            "Ensuite, la question de la performance s’est rapidement posée. \n" +
            "\n" +
            "C’est alors que j’ai intégré Lottie pour afficher un écran de chargement.\n" +
            "\n" +
            "Pour faciliter la modération du contenu, j’ai choisi le CMS headless de Firebase, \"FireCMS\".",
        credits: [{
            link: "https://www.hugopinna.com/",
            content: "Hugo PINNA, Designer graphique"
        }],
        inspiration: [],
        links: [{
            url: "https://www.hugopinna.com/", title: "Voir le site"
        }, {
            url: "https://github.com/ValentinGassend/portfolio-hugo-pinna", title: "Voir le repo github"
        }]
    },
    color: "#E70000",
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
    isPromoted: false,
    imageUrl: "https://picsum.photos/2000/3000"
},];

export default projects;
