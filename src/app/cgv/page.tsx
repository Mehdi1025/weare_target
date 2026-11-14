import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Conditions générales de vente", path: "/cgv" });

export default function Cgv() {
  return (
    <LegalPage
      n="L4"
      title="Conditions générales de vente"
      updated="11 novembre 2026"
      path="/cgv"
      sections={[
        {
          h: "Champ d’application",
          p: [
            `Les présentes conditions générales de vente (CGV) s’appliquent à toutes les prestations de services conclues entre WE ARE TARGET SAS, exploitant l’enseigne ${site.name} (SIREN 130 384 969), ci-après « le Prestataire », et toute personne physique ou morale agissant à titre professionnel, ci-après « le Client ».`,
          ],
        },
        {
          h: "Prestations",
          p: [
            `${site.name} propose des prestations de communication et de marketing : stratégie de marque, identité visuelle, création de sites web et de boutiques en ligne, gestion des réseaux sociaux, publicité en ligne, production de contenu, outils et automatisation, conseil et formation. Le contenu précis de chaque mission (périmètre, livrables, calendrier, prix) est défini dans un devis ou une proposition commerciale.`,
          ],
        },
        {
          h: "Devis et commande",
          p: [
            "Le devis est valable pendant la durée indiquée sur celui-ci. La commande est ferme après signature ou acceptation écrite du devis par le Client et, le cas échéant, versement de l’acompte prévu. Toute demande hors périmètre fait l’objet d’un avenant ou d’un nouveau devis.",
          ],
        },
        {
          h: "Prix et paiement",
          p: [
            "Les prix sont exprimés en euros et indiqués hors taxes, la TVA applicable s’ajoutant au prix. Les modalités de paiement (acompte, échéancier, abonnement mensuel) figurent sur le devis. À défaut de précision, les factures sont payables à 30 jours à compter de leur date d’émission.",
            "En cas de retard de paiement, des pénalités sont exigibles de plein droit, à un taux égal à trois fois le taux d’intérêt légal, ainsi qu’une indemnité forfaitaire de 40 € pour frais de recouvrement (articles L441-10 et D441-5 du Code de commerce).",
          ],
        },
        {
          h: "Délais et collaboration",
          p: [
            "Les délais de réalisation sont donnés à titre indicatif et dépendent notamment de la réactivité du Client (fourniture des contenus, validations, retours). Tout retard du Client peut entraîner un décalage équivalent du calendrier.",
          ],
        },
        {
          h: "Propriété intellectuelle",
          p: [
            "Les droits d’exploitation des créations livrées (logos, identités visuelles, maquettes, sites, contenus) sont cédés au Client dans les conditions du devis, après paiement intégral du prix. Jusqu’à ce paiement, les créations restent la propriété du Prestataire. Le Prestataire conserve le droit de mentionner la réalisation dans ses références commerciales (portfolio, site, réseaux sociaux), sauf demande contraire écrite du Client.",
          ],
        },
        {
          h: "Confidentialité",
          p: ["Chaque partie s’engage à garder confidentielles les informations non publiques échangées dans le cadre de la mission."],
        },
        {
          h: "Abonnements et résiliation",
          p: [
            "Les prestations récurrentes (contenu, social media, publicité) sont souscrites pour la durée indiquée sur le devis, puis reconduites tacitement. Chaque partie peut y mettre fin par écrit en respectant le préavis prévu au devis. Les sommes dues pour les travaux déjà engagés restent exigibles.",
          ],
        },
        {
          h: "Responsabilité",
          p: [
            "Le Prestataire est tenu à une obligation de moyens. Il ne peut être tenu responsable des résultats commerciaux (audience, ventes, positionnement) qui dépendent de facteurs extérieurs à sa prestation, ni des dommages indirects. Sa responsabilité est limitée, toutes causes confondues, au montant des sommes effectivement perçues pour la mission concernée.",
          ],
        },
        {
          h: "Données personnelles",
          p: ["Le traitement des données personnelles est décrit dans notre politique de confidentialité, accessible depuis le pied de page du site."],
        },
        {
          h: "Droit applicable et litiges",
          p: [
            `Les présentes CGV sont soumises au droit français. En cas de litige, les parties recherchent d’abord une solution amiable. À défaut, les tribunaux français seront seuls compétents. Contact : ${site.contact.email}.`,
          ],
        },
      ]}
    />
  );
}
