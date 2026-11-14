/**
 * Réalisations — contenus repris du portfolio Target Agency (Framer).
 * Visuels : /public/cases/<slug>/ (récupérés par scripts/fetch-portfolio-images.mjs).
 */
export type Img = { src: string; w: number; h: number; alt: string };

export type CaseStudy = {
  slug: string;
  client: string;
  year: string;
  /** Secteur affiché en étiquette */
  sector: string;
  /** Missions (étiquettes) */
  services: string[];
  /** Accroche courte (cartes) */
  summary: string;
  /** Titre éditorial de la page */
  headline?: string;
  /** Contexte · notre réponse · résultat */
  story?: [string, string, string];
  url?: string;
  /** Vignette (cartes, projet suivant) */
  image?: Img;
  /** Visuel d'ouverture de la page (par défaut : la vignette) */
  hero?: Img;
  /** Galerie : « full » = pleine largeur, « half » = demi-colonne */
  gallery?: (Img & { span: "full" | "half" })[];
  /** Couleur d'accent de la marque cliente (curseur, liens, détails) */
  tint?: string;
  /** Couverture typographique de secours si pas d'image */
  cover?: "accent" | "outline" | "grid";
  featured?: boolean;
  layout?: "dripmycard";
  tags?: string[];
};

const img = (slug: string, file: string, w: number, h: number, alt: string): Img => ({
  src: `/cases/${slug}/${file}`,
  w,
  h,
  alt,
});

export const cases: CaseStudy[] = [
  {
    slug: "dripmycard",
    client: "DripMyCard",
    year: "2026",
    sector: "E-commerce",
    services: ["Naming", "Branding", "Shopify", "Outil métier"],
    summary: "Une marque e-commerce construite de A à Z : nom, identité, boutique, packaging et production.",
    image: img("dripmycard", "cover.webp", 2400, 1697, "Logo DripMyCard et carte pêche qui coule sur fond encre"),
    featured: true,
    layout: "dripmycard",
    tags: ["Naming", "Identité", "E-commerce", "Packaging"],
  },
  {
    slug: "copifi",
    client: "CopiFi",
    year: "2026",
    sector: "SaaS · Fintech",
    services: ["Identité visuelle", "Landing page"],
    summary: "Identité de marque complète et landing page.",
    headline: "Identité visuelle et landing page d’une plateforme de facturation",
    url: "https://copifi.fr",
    tint: "#3FB37F",
    story: [
      "CopiFi est le SaaS français qui réunit facturation conforme et pilotage d’entreprise dans un seul abonnement. Avec la réforme de la facturation électronique, les dirigeants de TPE-PME cherchent un outil simple pour facturer en règle et garder la main sur leur trésorerie. L’enjeu : inspirer confiance dès le premier regard, sans jamais paraître austère.",
      "Nous avons conçu l’identité visuelle complète : un logomark aux formes organiques, un logotype net, un duo vert et vert foncé à l’esprit fintech premium, une typographie affirmée (Baltore) et une charte qui cadre le ton de la marque. Elle se décline sur la carte de visite, l’affichage, le textile et l’interface.",
      "Nous avons ensuite conçu et développé la landing page de copifi.fr : un message centré sur le bénéfice (« Pilotez, facturez, décidez »), un parcours limpide et un design fidèle à l’identité. Une marque et un site qui parlent le même langage.",
    ],
    image: img("copifi", "cover.png", 1440, 1080, "Logo CopiFi sur fond sombre"),
    hero: img("copifi", "logo-metal.webp", 2000, 1427, "Logo CopiFi en relief métallique sur fond noir"),
    gallery: [
      { ...img("copifi", "landing-laptop.webp", 1535, 1024, "Landing page de copifi.fr sur un ordinateur portable"), span: "full" },
      { ...img("copifi", "sweats.webp", 2000, 1333, "Sweats à capuche noirs floqués du logo CopiFi"), span: "half" },
      { ...img("copifi", "carte-visite.webp", 2000, 1333, "Carte de visite CopiFi avec QR code"), span: "half" },
      { ...img("copifi", "affiche.webp", 2000, 1500, "Affiche CopiFi dans un couloir urbain"), span: "full" },
      { ...img("copifi", "logomark.jpg", 1920, 1440, "Logomark CopiFi, page de la charte graphique"), span: "half" },
      { ...img("copifi", "palette.jpg", 1920, 1440, "Palette verte de la marque CopiFi"), span: "half" },
      { ...img("copifi", "typo.jpg", 1920, 1440, "Typographie Baltore de la marque CopiFi"), span: "full" },
    ],
  },
  {
    slug: "media-brokerage-by-reign",
    client: "Media & Brokerage By Reign",
    year: "2025",
    sector: "Immobilier · Dubaï",
    services: ["Plateforme web", "Immobilier premium"],
    summary: "Plateforme immobilière premium.",
    headline: "Une plateforme immobilière premium, bilingue",
    url: "https://mbbyreign.com",
    tint: "#C9A45C",
    story: [
      "Media & Brokerage by Reign accompagne les investisseurs francophones dans l’immobilier à Dubaï : conseil, courtage, projets off-plan, gestion locative. Un univers où la confiance et l’image comptent autant que la sélection des biens.",
      "Nous avons conçu une plateforme immobilière premium complète, bilingue français et anglais : une identité élégante aux tons aubergine et or, une typographie serif éditoriale, une présentation soignée de l’offre et un parcours de contact direct avec l’équipe.",
      "Le résultat est une présence en ligne cohérente avec un positionnement haut de gamme, sur laquelle l’équipe s’appuie pour présenter ses biens et ses services.",
    ],
    image: img("media-brokerage-by-reign", "cover.png", 1440, 1080, "Monogramme MB by Reign sur fond sombre"),
    gallery: [
      { ...img("media-brokerage-by-reign", "accueil.jpg", 1200, 1160, "Page d’accueil du site Media & Brokerage by Reign"), span: "half" },
      { ...img("media-brokerage-by-reign", "mission.jpg", 1200, 1000, "Section mission du site Media & Brokerage by Reign"), span: "half" },
    ],
  },
  {
    slug: "luxkey",
    client: "Luxkey",
    year: "2026",
    sector: "Conciergerie",
    services: ["Logo", "Plateforme web"],
    summary: "Plateforme de location courte durée & conciergerie.",
    headline: "Logo et plateforme web pour une conciergerie premium",
    url: "https://luxkey.fr",
    tint: "#E8455B",
    story: [
      "Une conciergerie premium vend d’abord une promesse : confier son séjour ou son bien en toute sérénité. Pour Luxkey, l’image de marque et l’outil numérique devaient dégager le même niveau de soin.",
      "Nous avons créé le logo : un logotype élégant en capitales dont le X est dessiné par une clé, signature immédiate de la marque. Puis nous avons développé la plateforme complète : catalogue de propriétés, comparateur, espace compte, modes clair et sombre.",
      "Le résultat est une marque et une plateforme qui se répondent, pour une activité où la confiance fait toute la différence.",
    ],
    image: img("luxkey", "cover.png", 1440, 1080, "Logo Luxkey sur fond sombre"),
    gallery: [
      { ...img("luxkey", "logo.png", 1536, 1024, "Logo Luxkey avec une clé formant le X"), span: "full" },
      { ...img("luxkey", "accueil.jpg", 1200, 900, "Page d’accueil de la plateforme Luxkey"), span: "half" },
      { ...img("luxkey", "services.jpg", 1200, 1200, "Section services de la plateforme Luxkey"), span: "half" },
    ],
  },
  {
    slug: "latifa-b",
    client: "Latifa B.",
    year: "2025",
    sector: "Mode",
    services: ["Identité visuelle", "Direction artistique"],
    summary: "Identité visuelle & direction artistique.",
    headline: "Identité visuelle et direction artistique d’une marque de mode",
    tint: "#B0445E",
    story: [
      "Dans la mode, une marque se reconnaît avant même d’être lue. Latifa B. voulait une identité élégante, chaleureuse et immédiatement mémorable, à l’image de sa signature : « Best clothing for you ».",
      "Nous avons dessiné son monogramme LB, puis bâti une charte autour d’une palette bordeaux profond et crème, associée à des typographies raffinées. La direction artistique cadre toute sa communication : ambiances de satin et de velours, compositions et ton visuel.",
      "Enseigne, cartes de visite, étiquettes, sac : les déclinaisons montrent comment l’univers s’applique avec cohérence sur tous les supports de la marque.",
    ],
    image: img("latifa-b", "cover.png", 1440, 1080, "Monogramme LB de Latifa B. sur fond sombre"),
    gallery: [
      { ...img("latifa-b", "enseigne.jpg", 2000, 3438, "Enseigne et cartes de visite Latifa B. sur satin crème"), span: "half" },
      { ...img("latifa-b", "cartes.jpg", 2000, 3438, "Cartes de visite bordeaux Latifa B. et étiquette"), span: "half" },
      { ...img("latifa-b", "sac.jpg", 2000, 3438, "Sac boutique bordeaux au monogramme LB"), span: "half" },
      { ...img("latifa-b", "palette.jpg", 2000, 3438, "Palette bordeaux et crème et typographies Latifa B."), span: "half" },
    ],
  },
  {
    slug: "l-heritage-francais",
    client: "L’Héritage Français",
    year: "2026",
    sector: "E-commerce · Mode",
    services: ["Boutique e-commerce", "Shopify"],
    summary: "Boutique e-commerce Shopify.",
    headline: "Une boutique Shopify à l’image d’une marque française",
    url: "https://lheritagefrancais.fr",
    story: [
      "L’Héritage Français est une marque de vêtements inspirée de l’héritage français, fabriquée et imprimée en France. Sa devise, « Ex Gallia, Aeternitas », dit tout : de la France, pour l’éternité. La boutique devait porter cette promesse et rassurer sur l’origine des produits.",
      "Nous avons conçu et mis en ligne la boutique sur Shopify : un univers sombre et affirmé, des collections mises en avant, des pages produits claires, un parcours d’achat fluide et une page dédiée à la traçabilité. Livraison offerte, satisfait ou remboursé et support sont visibles dès l’accueil.",
      "Le résultat est une boutique à l’image de la marque, facile à administrer et prête à grandir avec le catalogue.",
    ],
    image: img("l-heritage-francais", "cover.png", 1440, 1080, "Emblème L’Héritage Français sur fond sombre"),
    gallery: [
      { ...img("l-heritage-francais", "accueil.jpg", 1200, 1150, "Page d’accueil de la boutique L’Héritage Français"), span: "half" },
      { ...img("l-heritage-francais", "collections.jpg", 1200, 1200, "Collections de la boutique Shopify L’Héritage Français"), span: "half" },
    ],
  },
  {
    slug: "bz-family",
    client: "Bz Family",
    year: "2026",
    sector: "Association",
    services: ["Site web", "Gestion interne"],
    summary: "Site web associatif.",
    headline: "Un site associatif et un outil de gestion interne",
    url: "https://bz-family-ten.vercel.app",
    tint: "#F29A2E",
    story: [
      "Bz Family est une association de quartier qui réunit habitants, bénévoles et partenaires autour de trois choses simples : nourrir, accompagner, rassembler. Pour continuer à grandir, elle avait besoin d’un site qui parle au public et d’un outil qui simplifie le quotidien de l’équipe.",
      "Nous avons développé un site associatif complet : présentation des actions, appels à faire un don ou à devenir bénévole, et des fonctionnalités de gestion interne pour faciliter l’organisation.",
      "Le résultat est un outil simple à utiliser, qui allège l’administratif et laisse plus de place à la vie de l’association.",
    ],
    image: img("bz-family", "cover.png", 1440, 1080, "Logo Bz Family sur fond sombre"),
    gallery: [
      { ...img("bz-family", "accueil.jpg", 1200, 1070, "Page d’accueil du site de l’association Bz Family"), span: "half" },
      { ...img("bz-family", "actions.jpg", 1200, 850, "Section actions du site Bz Family"), span: "half" },
    ],
  },
];

export const getCase = (slug: string) => cases.find((c) => c.slug === slug);
export const featuredCase = cases.find((c) => c.featured);
export const otherCases = cases.filter((c) => !c.featured);
