export const site = {
  name: "Target Agency",
  legalName: "We are Target SAS",
  tagline: "Agence de Marketing digital & de communication",
  description:
    "Target Agency transforme les ambitions des entreprises en marques fortes : branding, sites web, réseaux sociaux, publicité et automatisation. 100 % à distance, partout en France.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wearetarget.fr",
  locale: "fr_FR",
  contact: {
    phone: "+33 6 09 88 46 60",
    phoneHref: "tel:+33609884660",
    email: "hello@wearetarget.fr",
    location: "France — 100 % à distance",
    /** Prise de rendez-vous (appel découverte de 20 minutes) */
    booking: "https://calendar.app.google/zdGA6TjWZsBzguja9",
  },
  video: {
    youtubeId: "QH5hihlXjmw",
    url: "https://www.youtube.com/watch?v=QH5hihlXjmw",
    duration: "1:42",
  },
  founder: { name: "Adam Fisli", role: "Fondateur" },
} as const;

export const mainNav = [
  { label: "Accueil", href: "/" },
  { label: "Réalisations", href: "/cases" },
  { label: "Articles", href: "/blog" },
  { label: "À propos", href: "/about-us" },
  { label: "Carrière", href: "/career" },
  { label: "Nous contacter", href: "/contacts" },
] as const;

export const legalNav = [
  { label: "Politique de confidentialité", href: "/policy" },
  { label: "Mentions légales", href: "/legal" },
  { label: "Conditions d’utilisation", href: "/terms" },
  { label: "Conditions générales de vente", href: "/cgv" },
] as const;

export type SocialIcon = "instagram" | "tiktok" | "linkedin" | "facebook" | "x" | "youtube";

export const socials: { label: string; href: string; icon: SocialIcon }[] = [
  { label: "Instagram", href: "https://www.instagram.com/wearetarget_agency", icon: "instagram" },
  { label: "TikTok", href: "https://www.tiktok.com/@wearetarget_agency", icon: "tiktok" },
  { label: "LinkedIn", href: "https://fr.linkedin.com/in/adam-fisli-022931153", icon: "linkedin" },
];

/** Outils maîtrisés par l'équipe */
export const tools = [
  "Figma",
  "Framer",
  "Shopify",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Google Analytics",
  "Semrush",
  "Notion",
  "ChatGPT",
  "Claude",
  "React",
  "Next.js",
  "Laravel",
  "Meta Ads",
  "Google Ads",
] as const;

export const manifesto = [
  "Pas de jargon. Juste des résultats.",
  "La clarté prime sur la complexité",
  "Les résultats avant les promesses",
  "Conçu pour la réalité du terrain",
  "Des stratégies qui tiennent dans la durée",
] as const;
