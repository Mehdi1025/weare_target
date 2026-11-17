import { site } from "@/content/site";
import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TAB_LABEL: Record<string, string> = {
  projet: "Envoyer un message",
  rdv: "Prendre rendez-vous",
  candidature: "Rejoindre l’équipe",
};

function asString(v: unknown): string {
  if (typeof v === "string") return v.trim();
  return "";
}

const DEFAULT_CONTACT_TO = [
  "mehdibachiri2002@gmail.com",
  "monsieur.fisli@gmail.com",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Plusieurs destinataires : virgules ou point-virgules dans CONTACT_TO_EMAIL. */
function contactRecipients(raw: string | undefined): string[] {
  const source = raw?.trim() || DEFAULT_CONTACT_TO.join(", ");
  const list = source
    .split(/[,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const valid = list.filter((e) => EMAIL_RE.test(e));
  return valid.length > 0 ? valid : [...DEFAULT_CONTACT_TO];
}

function buildText(body: Record<string, string>) {
  const lines = [
    `Type de demande : ${TAB_LABEL[body.type] ?? body.type}`,
    "",
    `Nom : ${body.name}`,
    `Email : ${body.email}`,
    body.phone ? `Téléphone : ${body.phone}` : null,
    body.company ? `Entreprise : ${body.company}` : null,
    body.poste ? `Poste visé : ${body.poste}` : null,
    body.service ? `Service : ${body.service}` : null,
    body.budget ? `Budget : ${body.budget}` : null,
    body.date ? `Date souhaitée : ${body.date}` : null,
    body.creneau ? `Créneau : ${body.creneau}` : null,
    body.portfolio ? `Portfolio / LinkedIn : ${body.portfolio}` : null,
    "",
    "Message :",
    body.message,
    "",
    `— Formulaire ${site.name} (${site.url})`,
  ].filter(Boolean);
  return lines.join("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = contactRecipients(process.env.CONTACT_TO_EMAIL);
  const from =
    process.env.CONTACT_FROM_EMAIL ?? `Target Agency <onboarding@resend.dev>`;

  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY manquant");
    return NextResponse.json(
      { ok: false, error: "Le serveur n’est pas configuré pour l’envoi d’e-mails." },
      { status: 503 },
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Corps de requête invalide." }, { status: 400 });
  }

  const raw = payload as Record<string, unknown>;
  if (asString(raw._hp)) {
    return NextResponse.json({ ok: true });
  }

  const type = asString(raw.type) || "projet";
  const name = asString(raw.name);
  const email = asString(raw.email);
  const message = asString(raw.message);

  if (!name || !email || !message) {
    return NextResponse.json({ ok: false, error: "Champs obligatoires manquants." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (message.length > 10_000) {
    return NextResponse.json({ ok: false, error: "Message trop long." }, { status: 400 });
  }

  const body: Record<string, string> = {
    type,
    name,
    email,
    message,
    phone: asString(raw.phone),
    company: asString(raw.company),
    poste: asString(raw.poste),
    service: asString(raw.service),
    budget: asString(raw.budget),
    date: asString(raw.date),
    creneau: asString(raw.creneau),
    portfolio: asString(raw.portfolio),
  };

  const subject = `[${site.name}] ${TAB_LABEL[type] ?? type} — ${name}`;
  const text = buildText(body);

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("[contact] Resend:", error);
    let hint =
      "L’envoi a échoué. Réessayez ou écrivez-nous par e-mail.";
    if (error.statusCode === 403) {
      hint =
        "Configuration Resend : le destinataire doit être l’e-mail du compte tant que wearetarget.fr n’est pas vérifié (un seul Gmail), ou utilisez @wearetarget.fr après vérification du domaine. L’expéditeur doit être onboarding@resend.dev ou une adresse @wearetarget.fr vérifiée.";
    } else if (error.statusCode === 422) {
      hint =
        "Configuration Resend : vérifiez CONTACT_TO_EMAIL et CONTACT_FROM_EMAIL sur Vercel (plusieurs destinataires = virgules, après mise à jour du site).";
    } else if (error.statusCode === 401) {
      hint = "Configuration Resend : clé API invalide (RESEND_API_KEY sur Vercel).";
    }
    return NextResponse.json({ ok: false, error: hint }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}