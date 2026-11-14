import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Mentions légales", path: "/legal" });

export default function LegalNotice() {
  return (
    <LegalPage
      n="L1"
      title="Mentions légales"
      updated="11 novembre 2026"
      path="/legal"
      sections={[
        {
          h: "Éditeur du site",
          p: [
            `Le site est édité par la société WE ARE TARGET, société par actions simplifiée (SAS) au capital de 1 000 €, exploitant l’enseigne ${site.name} (communication et marketing).`,
            "Siège social : 50 avenue des Champs-Élysées, 75008 Paris. Activité et équipe basées à Mulhouse (Haut-Rhin).",
            "SIREN : 130 384 969 — SIRET (siège) : 130 384 969 00015 — TVA intracommunautaire : FR91 130 384 969.",
            `Contact : ${site.contact.email} — ${site.contact.phone}.`,
          ],
        },
        {
          h: "Directeur de la publication",
          p: [`${site.founder.name}, Président de WE ARE TARGET SAS.`],
        },
        {
          h: "Hébergement",
          p: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com."],
        },
        {
          h: "Propriété intellectuelle",
          p: [
            "L’ensemble des contenus du site (textes, logos, identités visuelles, images, graphismes, vidéos) est la propriété de We are Target ou de ses clients et partenaires, et est protégé par le droit d’auteur. Toute reproduction, représentation ou réutilisation, totale ou partielle, sans autorisation écrite préalable est interdite.",
            "Les projets présentés dans la rubrique « Réalisations » restent la propriété de leurs clients respectifs.",
          ],
        },
        {
          h: "Responsabilité",
          p: [
            `${site.name} s’efforce de garantir l’exactitude des informations publiées sur ce site, mais ne peut être tenue responsable des omissions, d’éventuelles erreurs ou d’une indisponibilité temporaire du site. Les liens vers des sites tiers sont fournis à titre informatif et n’engagent pas sa responsabilité.`,
          ],
        },
        {
          h: "Droit applicable",
          p: ["Les présentes mentions légales sont soumises au droit français. Tout litige relève de la compétence des tribunaux français."],
        },
      ]}
    />
  );
}
