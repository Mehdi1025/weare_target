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
  const to = process.env.CONTACT_TO_EMAIL ?? "mehdibachiri200@gmail.com";
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
    to: [to],
    replyTo: email,
    subject,
    text,
  });

  if (error) {
    console.error("[contact] Resend:", error);
    return NextResponse.json(
      { ok: false, error: "L’envoi a échoué. Réessayez ou écrivez-nous par e-mail." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}