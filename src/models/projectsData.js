const projects = [{
    id: 1,
    year: 2022,
    client: "Gobelins",
    title: "Syndesi.",
    tags: ["Site internet", "Dataviz", "Gsap", "Echarts", "Mapbox"],
    content: {
        description: {
            text: "Syndesi. est la formalisation de plusieurs mois de réflexion autour d'une thématique imposée : « Prends de la hauteur, utilise les données produites depuis l'espace pour regarder vers la Terre... ou ailleurs ! ».   Ce projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. Le projet s'est déroulé sur 4 mois, de l'idéation à une soutenance avec démonstration.   C'est en cherchant, au sein du groupe, une cause qui nous tenait à cœur que nous avons choisi de nous concentrer sur l'écologie.",
            image: "/img/syndesi/preview.png"

        }, history: {
            text: "Syndesi. est née d'une information clé : plus de 4 jeunes sur 5 ont une pensée concernant l'écologie dans leur journée. En effet, Syndesi. a pour objectif d'accompagner toutes les personnes qui se sentent concernées par l'urgence climatique et qui souhaitent en apprendre davantage sur le rôle qu'elles peuvent jouer.",
            image: "/img/syndesi/history.png"

        }, why: {
            text: "La datavisualisation des informations et la dynamisation de la page web ont, selon nous, été le meilleur moyen de communiquer les informations souhaitées sans ennuyer le visiteur.",
            image: "/img/syndesi/why.png"

        }, how: {
            text: "Syndesi. se découpe en plusieurs étapes ; seule la première a été développée pour des raisons de temps. L'idée était de prendre une action quotidienne et de montrer son impact en changeant d'échelle.  La homepage, quant à elle, contribue à personnaliser l'expérience pour parler directement au visiteur.",
            image: "/img/syndesi/how.png"

        }, what: {
            text: "En tant que seul développeur de l’équipe, je me suis occupé de l’ensemble de l’intégration de la maquette ainsi que des animations. \n" + "Le site Syndesi. rassemble Echarts et Mapbox afin de représenter visuellement certaines données. Gsap a, en plus de dynamiser le site, contribué à l’aspect fil rouge de l’action quotidienne avec un élément qui nous suit tout au long du scroll, représentatif du changement d’échelle. Lottie a également été un facilitateur de dynamisation du site ; il a permis d’alléger les animations en les remplaçant par des séquences vidéo facilement manipulables.",
            image: "/img/syndesi/what.png"

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
    color: "#20105C",
    isPromoted: true,
    imageUrl: "/img/syndesi/preview.png"

},
    {
        id: 2, year: 2023, client: "Gobelins", title: "Liveo", tags: ["IOT", "Python", "IA", "Whisper"], content: {
            description: {
                text: "Ce projet a été mené à l'école des Gobelins Campus Annecy par une équipe composée de 2 designers et 1 développeur. Le projet s’est déroulé sur 4 mois, en commençant par l’idéation pour se terminer par une soutenance avec démonstration du produit. Ce projet s’est tenu en collaboration avec l’association Renaissance d’Annecy.",
                image: "/img/liveo/preview.png"


            }, history: {
                text: "C’est après avoir constaté que plus d’1 senior sur 5 était concerné par la perte de mémoire que Liveo a émergé. En effet, Liveo a pour but de fiabiliser la prise de rendez-vous des personnes âgées afin de leur faire gagner en autonomie.",
                image: "/img/liveo/history.png"


            }, why: {
                text: "Liveo répond à une nécessité de s'ancrer dans le monde réel, c’est pourquoi il était nécessaire que Liveo soit un objet connecté voire embarqué. Fiable, autonome et discret, Liveo doit s’intégrer dans le quotidien des personnes âgées pour les soulager mentalement.",
                image: "/img/liveo/why.png"


            }, how: {
                text: "Liveo repose sur de multiples composants IoT, de l'appui sur un bouton jusqu'à la compréhension et la retranscription vocale des informations fournies par un utilisateur, en passant par une reconnaissance de badge, des retours visuels et sonores, une communication interne en Bluetooth, et bien d'autres encore. Tout ceci permet de récupérer un certain nombre d'informations qu'il suffit d'analyser et d'enregistrer méthodiquement dans l'objet connecté.",
                image: "/img/liveo/how.png"


            }, what: {
                text: "En tant que seul développeur de l’équipe, je me suis occupé de l’ensemble du développement de l’objet connecté.\n" + "\n" + "Liveo regroupe un ESP32, un Raspberry Pi, divers modules de communication tels que le Bluetooth, le wifi ou le RFID, ainsi que Whisper, le modèle d’intelligence artificielle de reconnaissance et de transcription vocale.\n" + "\n" + "L’ensemble de l’objet est développé en Python et une grosse partie reprend, techniquement, les bases d’une gestion d’agenda.\n" + "\n" + "Un site web promotionnel a également été produit, mais celui-ci n’a pas été publié en raison de contraintes de temps et de priorité.",
                image: "/img/liveo/what.png"

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
        }, color: "#333896", isPromoted: true,
        imageUrl: "/img/liveo/how.png"

    },
    {
        id: 3,
        year: 2024,
        client: "Hugo PINNA",
        title: "Portfolio Hugo PINNA",
        tags: ["Site internet", "Animation", "React", "Gsap", "Lottie"],
        content: {
            description: {
                text: "Ce projet est le fruit d’une collaboration avec Hugo Pinna. L’objectif était de réaliser un site qui mettait en avant l’ensemble de son travail, en respectant une direction artistique précise et qui se démarquait.",
                image: "/img/hugopinna/description.png"

            }, history: {
                text: "Hugo Pinna est un ami, camarade de classe et freelance. Nous avons également été collègues pendant nos deux premières années d’alternance. C’est à ce moment-là que la proposition de ce portfolio est née. Une demande créative et ambitieuse qui m’a immédiatement séduit.",
                image: "/img/hugopinna/history.png"

            }, why: {
                text: "Ce portfolio devait refléter l’image d’Hugo, mais également se démarquer visuellement et techniquement. Dans le monde du design graphique, la concurrence est forte et chaque détail peut avoir son importance.",
                image: "/img/hugopinna/why.png"

            }, how: {
                text: "Puisque nous étions techniquement différents de la concurrence, nous nous devions d'aller plus loin que de simples timing d'animation sur quelques survols. Il a fallu penser à des mécaniques originales, créatives et surtout qui avaient du sens dans l'idée générale.",
                image: "/img/hugopinna/how.png"

            }, what: {
                text: "Pour cela, le projet s’est construit avec React. J’ai rapidement intégré GSAP pour la gestion de tous les événements au scroll.\n" + "Ensuite, la question de la performance s’est rapidement posée. \n" + "\n" + "C’est alors que j’ai intégré Lottie pour afficher un écran de chargement.\n" + "\n" + "Pour faciliter la modération du contenu, j’ai choisi le CMS headless de Firebase, \"FireCMS\".",
                image: "/img/hugopinna/what.png"

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
        imageUrl: "/img/hugopinna/description.png"
    },
    {
        id: 4,
        year: 2022,
        client: "Altimax",
        title: "Voeux 2023",
        tags: ["Site internet", "Animation", "Interaction", "Gsap", "MatterJS", "Lottie"],
        content: {
            description: {
                text: "Le site des vœux 2023 est un projet réalisé au sein de l’agence Altimax. L’objectif est de souhaiter une bonne année à l’ensemble de la clientèle par e-mail, en redirigeant vers un site web via un QR code imprimé sur des chocolats reçus par la cible. Ce projet est créativement libre, il doit simplement correspondre à la direction éditoriale de l’agence.",
                image: "/img/voeux2023/description.png"

            },history: {text: "", image: ""}, why: {

                text: "Le site des vœux devient peu à peu un rituel au sein de l’entreprise, permettant de rappeler notre présence auprès des clients et de mettre en avant de nouvelles compétences techniques au sein de l’équipe.",
                image: "/img/voeux2023/why.png"

            }, how: {
                text: "Bien souvent, tout commence par un brainstorming pour générer des idées, faire naître des concepts, puis laisser la créativité réfléchir à une façon de mettre en forme tout cela, de l'intégrer à la ligne éditoriale de l'agence et d'assurer une véritable cohérence.",
                image: "/img/voeux2023/how.png"

            }, what: {
                text: "Personnellement, j'ai travaillé sur divers projets en R&D, en mettant l'accent sur les interactions utilisateur et l'utilisation des librairies MatterJS et GSAP. Pendant que Lucas s'occupait de l'initialisation du projet, des animations de fond et de la résolution des problèmes de responsivité, Lilian se chargeait de la navigation et m'a assisté sur MatterJS. Ensuite, il a contribué à la correction des bugs. J'ai principalement travaillé sur l'interactivité utilisateur, impliquant beaucoup de JavaScript, ce qui m'a beaucoup plu, même si mon manque d'expérience a ajouté du travail lors de la phase de recette.",
                image: "/img/voeux2023/what.png"

            }, credits: [{
                link: "https://www.hugopinna.com/", content: "Hugo PINNA, Designer graphique"
            }, {
                link: "https://www.linkedin.com/in/morgan-orabona-765b6b197/",
                content: "Morgan ORABONA, Designer graphique"
            }, {
                link: "", content: "Marine MASSIT, Directrice Artistique"
            }, {
                link: "https://www.linkedin.com/in/florent-chatelet/", content: "Florent CHATELET, Motion Designer"
            }, {
                link: "", content: "Lucas ENCRENAZ, Développeur Front-end"
            }, {
                link: "https://lilian-mignogna.fr/", content: "Lilian MIGNOGNA, Développeur Front-end"
            },], inspiration: [], links: [{
                url: "https://voeux23.altimax.com/", title: "Voir le site"
            }]
        },
        color: "#FA60BE",
        isPromoted: false,
        imageUrl: "/img/voeux2023/preview.png"

    },
    {
        id: 5,
        year: 2023,
        client: "Altimax",
        title: "Voeux 2024",
        tags: ["Site internet", "Interaction", "React", "ThreeJS", "Lottie"],
        content: {
            description: {
                text: "Comme l’année passée, Altimax sort son site de vœux pour souhaiter la bonne année à sa clientèle. Cette année, c’est un peu particulier puisque ce sont les deux alternants, Hugo Pinna et moi-même, qui nous occupons de sa réalisation. Évidemment, nous sommes supervisés par Morgan Orabona du côté créatif et Rémi Hervaud du côté développement.",
                image: "/img/voeux2024/description.png"

            }, history: {text: "", image: ""}, why: {
                text: "Le site des vœux se voulait plus simple que l’année précédente, mais malgré tout innovant pour, comme l’année passée, mettre en avant les compétences techniques des membres de l’entreprise.",
                image: "/img/voeux2024/why.png"

            }, how: {
                text: "Il a fallu réfléchir, à deux, à ce que nous voulions faire. La communication de l’agence avait récemment pris une direction plus créative en s’orientant vers plus de propositions en 3D lorsque le temps le permettait. C’est alors que l’idée est venue de créer une page web en 3D.",
                image: "/img/voeux2024/how.png"
            }, what: {
                text: "Étant le seul développeur sur ce projet, c’est avec un peu de pression que j’ai développé le site des vœux avec ThreeJS et React, une technologie que nous souhaitons intégrer progressivement dans les projets d'Altimax.\n" + "\n" + "Bien sûr, l'un des intérêts de faire un site en 3D est d'avoir un peu d’interaction avec l’utilisateur, donc il y a un mouvement de caméra en fonction du mouvement de la souris.\n" + "\n" + "Malheureusement, malgré quelques soucis d’optimisations, j’ai réussi à sortir le site en temps et en heure, épaulé par Rémi et en collaboration étroite avec Hugo pour traiter au mieux les problématiques de fluidité et de chargement.",
                image: "/img/voeux2024/what.png"
            }, credits: [{
                link: "https://www.hugopinna.com/", content: "Hugo PINNA, Designer graphique"
            }, {
                link: "https://www.linkedin.com/in/morgan-orabona-765b6b197/",
                content: "Morgan ORABONA, Designer graphique"
            }, {
                link: "", content: "Rémi HERVAUD, Lead développeur Front-end"
            },], inspiration: [{
                url: "https://raw.githack.com/gonnavis/three.js/SSRPass/examples/webgl_postprocessing_ssr.html",
                title: "three.js webgl postprocessing SSR"
            }, {
                url: "https://codesandbox.io/p/sandbox/starwars-fslt99?", title: "DRCMDA - Starwars"
            },], links: [{
                url: "https://voeux24.altimax.com/", title: "Voir le site"
            }]
        },
        color: "#28F5AA",
        isPromoted: true,
        imageUrl: "/img/voeux2024/preview.png"
    },
    {
        id: 6,
        year: 2023,
        client: "Altimax",
        title: "Major CS2",
        tags: ["Site internet", "Animation", "Interaction", "ThreeJS", "WebGL", "Lottie"],
        content: {
            description: {
                text: "Dans une période plus creuse au sein d'Altimax, mon maître d'apprentissage et lead, Rémi Hervaud, ainsi que Morgan, le maître d'apprentissage d'Hugo, nous ont proposé de gagner en compétences avec une suite techniquement poussée sur un sujet que l'on apprécie, le mod de Counter-Strike 2.",
                image: "/img/major-cs2/description.png"
            }, history: {
                text: "Depuis 2017, le jeu Counter-Strike organise des événements presque systématiquement biannuels. Il s'agit d'événements eSport où les meilleures équipes du monde se rencontrent pour déterminer qui repartira avec le trophée et le prestigieux titre de meilleure équipe du monde. C'est à l'occasion du nouveau jeu de la licence Counter-Strike que le premier Major sur le nouvel opus est organisé dans la ville de Copenhague, au Danemark.",
                image: "/img/major-cs2/history.png"
            }, why: {
                text: "Le but était clair : proposer une conception graphique et technique originale pour le site promotionnel du premier tournoi majeur de Counter-Strike 2.",
                image: "/img/major-cs2/why.png"
            }, how: {
                text: "Avec de nombreuses informations parfois un peu complexes à expliquer, il a fallu réfléchir à l'agencement et réaliser un gros travail de veille pour être force de proposition à la fois sur le plan graphique et technique. Des éléments innovants ont alors émergé, tels qu'un descriptif statistique des joueurs présenté sous forme de cartes Pokémon ou un effet de fumée sur le site, faisant référence aux grenades fumigènes présentes dans le jeu.",
                image: "/img/major-cs2/how.png"
            }, what: {
                text: "Un effet de 3D en CSS a été rapidement ajouté au slider des joueurs pour avoir un rendu qui se rapprochait bien plus d'une carte physique.\n" + "L'effet de fumée a lui été codé en C# pour la gestion du fluide. Cette partie manque de fluidité, surtout sur des ordinateurs peu performants.\n" + "Enfin, un modèle en 3 dimensions d'un skin de couteau, élément emblématique de Counter-Strike, a été intégré au site avec une animation progressive en fonction du scroll. De plus, plusieurs animations de survol faites en JavaScript et CSS élèvent encore d'un cran l'interactivité du site web.\n\nCependant, le site ne possède pas de version mobile viable pour des soucis de temps.",
                image: "/img/major-cs2/what.png"
            }, credits: [{
                link: "https://www.hugopinna.com/", content: "Hugo PINNA, Designer graphique"
            }, {
                link: "https://www.linkedin.com/in/morgan-orabona-765b6b197/",
                content: "Morgan ORABONA, Référent designer graphique"
            }, {
                link: "", content: "Rémi HERVAUD, Référent et lead développeur Front-end"
            },], inspiration: [{
                url: "https://codepen.io/simeydotme/pen/PrQKgo", title: "Pokemon Card Holo Effect"
            }, {
                url: "https://codepen.io/PavelDoGreat/pen/zdWzEL", title: "WebGL Fluid Simulation"
            },], links: [{
                url: "http://cs2.brph6005.odns.fr/", title: "Voir le site"
            },]
        },
        color: "#e31836",
        isPromoted: false,
        imageUrl: "/img/major-cs2/preview.png"
    },];

export default projects;
