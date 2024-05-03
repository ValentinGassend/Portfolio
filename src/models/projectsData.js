const projects = [{
    id: 1,
    year: 2022,
    client: "Gobelins",
    title: "Syndesi.",
    tags: ["Site web", "Dataviz", "Gsap", "Echarts", "Mapbox"],
    content: {
        description: {
            text: "Syndesi. est la formalisation de plusieurs mois de réflexion autour d'une thématique imposée : « Prends de la hauteur, utilise les données produites depuis l'espace pour regarder vers la Terre... ou ailleurs ! ».   Ce projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. Le projet s'est déroulé sur 4 mois, de l'idéation à une soutenance avec démonstration.   C'est en cherchant, au sein du groupe, une cause qui nous tenait à cœur que nous avons choisi de nous concentrer sur l'écologie.",
            image: "https://picsum.photos/2000/3000"
        }, history: {
            text: "Syndesi. est née d'une information clé : plus de 4 jeunes sur 5 ont une pensée concernant l'écologie dans leur journée. En effet, Syndesi. a pour objectif d'accompagner toutes les personnes qui se sentent concernées par l'urgence climatique et qui souhaitent en apprendre davantage sur le rôle qu'elles peuvent jouer.",
            image: "https://picsum.photos/1000/3000"
        }, why: {
            text: "La datavisualisation des informations et la dynamisation de la page web ont, selon nous, été le meilleur moyen de communiquer les informations souhaitées sans ennuyer le visiteur.",
            image: "https://picsum.photos/2000/2000"
        }, how: {
            text: "Syndesi. se découpe en plusieurs étapes ; seule la première a été développée pour des raisons de temps. L'idée était de prendre une action quotidienne et de montrer son impact en changeant d'échelle.  La homepage, quant à elle, contribue à personnaliser l'expérience pour parler directement au visiteur.",
            image: "https://picsum.photos/2000/1000"
        }, what: {
            text: "En tant que seul développeur de l’équipe, je me suis occupé de l’ensemble de l’intégration de la maquette ainsi que des animations. \n" + "Le site Syndesi. rassemble Echarts et Mapbox afin de représenter visuellement certaines données. Gsap a, en plus de dynamiser le site, contribué à l’aspect fil rouge de l’action quotidienne avec un élément qui nous suit tout au long du scroll, représentatif du changement d’échelle. Lottie a également été un facilitateur de dynamisation du site ; il a permis d’alléger les animations en les remplaçant par des séquences vidéo facilement manipulables.",
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
    id: 2, year: 2023, client: "Gobelins", title: "Liveo", tags: ["IOT", "Python", "IA", "Whisper"], content: {
        description: {
            text: "Ce projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. Le projet s’est déroulé sur 4 mois, en commençant par l’idéation pour se terminer par une soutenance avec démonstration du produit. Ce projet s’est tenu en collaboration avec l’association Renaissance d’Annecy.",
            image: "https://picsum.photos/1000/3000"

        }, history: {
            text: "C’est après avoir constaté que plus d’1 senior sur 5 était concerné par la perte de mémoire que Liveo a émergé. En effet, Liveo a pour but de fiabiliser la prise de rendez-vous des personnes âgées afin de leur faire gagner en autonomie.",
            image: "https://picsum.photos/2000/1500"

        }, why: {
            text: "Liveo répond à une nécessité de s'ancrer dans le monde réel, c’est pourquoi il était nécessaire que Liveo soit un objet connecté voire embarqué. Fiable, autonome et discret, Liveo doit s’intégrer dans le quotidien des personnes âgées pour les soulager mentalement.",
            image: "https://picsum.photos/2000/1750"

        }, how: {
            text: "Liveo repose sur de multiples composants IoT, de l'appui sur un bouton jusqu'à la compréhension et la retranscription vocale des informations fournies par un utilisateur, en passant par une reconnaissance de badge, des retours visuels et sonores, une communication interne en Bluetooth, et bien d'autres encore. Tout ceci permet de récupérer un certain nombre d'informations qu'il suffit d'analyser et d'enregistrer méthodiquement dans l'objet connecté.",
            image: "https://picsum.photos/1000/2000"

        }, what: {
            text: "En tant que seul développeur de l’équipe, je me suis occupé de l’ensemble du développement de l’objet connecté.\n" + "\n" + "Liveo regroupe un ESP32, un Raspberry Pi, divers modules de communication tels que le Bluetooth, le wifi ou le RFID, ainsi que Whisper, le modèle d’intelligence artificielle de reconnaissance et de transcription vocale.\n" + "\n" + "L’ensemble de l’objet est développé en Python et une grosse partie reprend, techniquement, les bases d’une gestion d’agenda.\n" + "\n" + "Un site web promotionnel a également été produit, mais celui-ci n’a pas été publié en raison de contraintes de temps et de priorité.",
            image: "https://picsum.photos/2000/3000"
        }, credits: [{
            link: "https://bento.me/melisseclivaz", content: "Mélisse CLIVAZ, Designer graphique & cheffe de projet"
        }, {
            link: "https://www.instagram.com/kinou_design/", content: "Kilian Rizzo, Designer graphique"
        }], inspiration: [], links: [{
            url: "https://github.com/ValentinGassend/Liveo", title: "voir le repo github",
        }, {
            url: "https://vimeo.com/941742794", title: "Video promotionnelle",
        }, {
            url: "https://liveo-website.vercel.app/", title: "Voir le site promotionnel",
        }],
    }, color: "#333896", isPromoted: true, imageUrl: "https://picsum.photos/2000/3000"
}, {
    id: 3,
    year: 2024,
    client: "Hugo PINNA",
    title: "Portfolio Hugo PINNA",
    tags: ["Site internet", "Animation", "React", "Gsap", "Lottie"],
    content: {
        description: {
            text: "Ce projet est le fruit d’une collaboration avec Hugo Pinna. L’objectif était de réaliser un site qui mettait en avant l’ensemble de son travail, en respectant une direction artistique précise et qui se démarquait.",
            image: "https://picsum.photos/1000/3000"
        }, history: {
            text: "Hugo Pinna est un ami, camarade de classe et freelance. Nous avons également été collègues pendant nos deux premières années d’alternance. C’est à ce moment-là que la proposition de ce portfolio est née. Une demande créative et ambitieuse qui m’a immédiatement séduit.",
            image: "https://picsum.photos/2000/1500"
        }, why: {
            text: "Ce portfolio devait refléter l’image d’Hugo, mais également se démarquer visuellement et techniquement. Dans le monde du design graphique, la concurrence est forte et chaque détail peut avoir son importance.",
            image: "https://picsum.photos/2000/1750"
        }, how: {
            text: "Puisque nous étions techniquement différents de la concurrence, nous nous devions d'aller plus loin que de simples timing d'animation sur quelques survols. Il a fallu penser à des mécaniques originales, créatives et surtout qui avaient du sens dans l'idée générale.",
            image: "https://picsum.photos/1000/2000"
        }, what: {
            text: "Pour cela, le projet s’est construit avec React. J’ai rapidement intégré GSAP pour la gestion de tous les événements au scroll.\n" + "Ensuite, la question de la performance s’est rapidement posée. \n" + "\n" + "C’est alors que j’ai intégré Lottie pour afficher un écran de chargement.\n" + "\n" + "Pour faciliter la modération du contenu, j’ai choisi le CMS headless de Firebase, \"FireCMS\".",
            image: "https://picsum.photos/2000/3000"
        }, credits: [{
            link: "https://www.hugopinna.com/", content: "Hugo PINNA, Designer graphique"
        }], inspiration: [], links: [{
            url: "https://www.hugopinna.com/", title: "Voir le site"
        }, {
            url: "https://github.com/ValentinGassend/portfolio-hugo-pinna", title: "Voir le repo github"
        }]
    },
    color: "#E70000",
    isPromoted: true,
    imageUrl: "https://picsum.photos/2000/3000"
},];

export default projects;
