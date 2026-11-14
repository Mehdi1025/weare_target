import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({ title: "Politique de confidentialité", path: "/policy" });

export default function Policy() {
  return (
    <LegalPage
      n="L2"
      title="Politique de confidentialité"
      updated="11 novembre 2026"
      path="/policy"
      sections={[
        {
          h: "Responsable du traitement",
          p: [
            `WE ARE TARGET SAS (SIREN 130 384 969), 50 avenue des Champs-Élysées, 75008 Paris, représentée par son Président, ${site.founder.name}. Contact : ${site.contact.email}.`,
          ],
        },
        {
          h: "Données collectées",
          p: [
            "Lorsque vous remplissez le formulaire de contact, nous collectons votre nom, votre entreprise, votre adresse e-mail, votre téléphone, la description de votre projet et votre fourchette de budget. Si vous réservez un appel, les informations saisies sont traitées par notre outil de prise de rendez-vous.",
            "Pour une candidature : les informations et liens que vous choisissez de nous transmettre.",
          ],
        },
        {
          h: "Finalités et bases légales",
          p: [
            "Vos données servent uniquement à répondre à votre demande, à vous proposer un devis ou un rendez-vous, et à gérer les candidatures. Le traitement repose sur votre consentement et sur notre intérêt légitime à répondre aux sollicitations reçues.",
          ],
        },
        {
          h: "Durée de conservation",
          p: [
            "Les données de contact sont conservées pendant la durée nécessaire au traitement de votre demande, puis au maximum 3 ans après le dernier échange en l’absence de suite commerciale.",
          ],
        },
        {
          h: "Destinataires et sous-traitants",
          p: [
            "Vos données ne sont ni vendues ni cédées. Elles peuvent être traitées par nos prestataires techniques (hébergement, outil de prise de rendez-vous, messagerie), dans le cadre strict de leur mission. Les transferts hors Union européenne sont encadrés par des garanties appropriées.",
          ],
        },
        {
          h: "Vos droits",
          p: [
            `Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation, d’opposition et de portabilité de vos données. Pour les exercer, écrivez-nous à ${site.contact.email}. Vous pouvez aussi introduire une réclamation auprès de la CNIL (cnil.fr).`,
          ],
        },
        {
          h: "Cookies",
          p: [
            "Le site n’utilise que des cookies techniques nécessaires à son fonctionnement. La vidéo de présentation est intégrée via le mode de confidentialité renforcée de YouTube et ne se charge qu’à votre demande.",
          ],
        },
      ]}
    />
  );
}
