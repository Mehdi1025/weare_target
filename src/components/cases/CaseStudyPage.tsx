import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { CaseStudy } from "@/content/cases";
import { clipUp, fadeUp, fadeUpBlur } from "@/lib/motion";
import { Index, Rule } from "@/components/ui/Section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Parallax } from "@/components/motion/Parallax";
import { ArrowRight, ArrowUpRight } from "@/components/ui/Icons";
import { ScrubText } from "@/components/dmc/Bits";
import { ContactCta } from "@/components/home/Sections";
import { CaseCover } from "./CaseCover";
import { CaseGallery } from "./CaseGallery";

const host = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "");

/** Étude de cas générique : ouverture, récit en trois temps, galerie, lien client, projet suivant */
export function CaseStudyPage({ item, index, next }: { item: CaseStudy; index: number; next: CaseStudy }) {
  const hero = item.hero ?? item.image;
  const [context, answer, result] = item.story ?? ["", "", ""];
  const n = String(index + 1).padStart(2, "0");

  return (
    <div style={{ "--tint": item.tint ?? "#ff3a24" } as CSSProperties}>
      {/* ── Ouverture ───────────────────────────────────────────── */}
      <section className="shell pb-14 pt-36 md:pt-44">
        <Reveal className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/cases" className="label inline-flex items-center gap-2 hover:text-bone">
            <ArrowRight className="h-3 w-3 rotate-180" /> Toutes les réalisations
          </Link>
          <Index n={`04/${n}`}>Étude de cas · {item.year}</Index>
        </Reveal>
        <SplitReveal as="h1" by="char" className="display-xl mt-10 max-w-[14ch]" text={item.client} />
        {item.headline && (
          <SplitReveal as="p" className="display-md mt-5 max-w-[24ch] text-mute" text={item.headline} delay={0.35} stagger={0.035} />
        )}
      </section>

      <section className="shell">
        {hero && (
          <Reveal variants={clipUp} className="overflow-hidden rounded-[24px] md:rounded-[32px]">
            <Parallax amount={9} className="aspect-[4/3] md:aspect-[21/10]">
              <Image src={hero.src} alt={hero.alt} fill priority sizes="(max-width: 1440px) 95vw, 1360px" className="object-cover" />
            </Parallax>
          </Reveal>
        )}
        <Stagger as="dl" stagger={0.07} className="mt-6 grid grid-cols-2 gap-6 border-b hairline pb-8 md:grid-cols-4">
          <StaggerItem>
            <dt className="label">Client</dt>
            <dd className="mt-2">{item.client}</dd>
          </StaggerItem>
          <StaggerItem>
            <dt className="label">Secteur</dt>
            <dd className="mt-2">{item.sector}</dd>
          </StaggerItem>
          <StaggerItem>
            <dt className="label">Mission</dt>
            <dd className="mt-2 flex flex-wrap gap-1.5">
              {item.services.map((s) => (
                <span key={s} className="rounded-full border hairline px-2.5 py-0.5 text-sm">
                  {s}
                </span>
              ))}
            </dd>
          </StaggerItem>
          <StaggerItem>
            <dt className="label">En ligne</dt>
            <dd className="mt-2">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[var(--tint)]">
                  {host(item.url)} <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <span className="text-mute">Identité & supports</span>
              )}
            </dd>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ── Récit ───────────────────────────────────────────────── */}
      {item.story && (
        <section className="shell py-24 md:py-36">
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="label">
                <span className="text-[var(--tint)]">(01)</span> Le contexte
              </p>
            </div>
            <div className="md:col-span-9">
              <ScrubText text={context} className="text-[clamp(1.5rem,3vw,2.6rem)] font-medium leading-[1.2] tracking-[-0.02em]" />
            </div>
          </div>
          <div className="mt-20 grid gap-12 md:grid-cols-12">
            {[
              ["(02)", "Notre réponse", answer],
              ["(03)", "Le résultat", result],
            ].map(([k, t, body], i) => (
              <Reveal key={t} variants={fadeUpBlur} delay={i * 0.12} className={i === 0 ? "md:col-span-5 md:col-start-4" : "md:col-span-4"}>
                <Rule />
                <p className="label mt-5">
                  <span className="text-[var(--tint)]">{k}</span> {t}
                </p>
                <p className="mt-5 text-lg leading-relaxed text-bone/80">{body}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Galerie ─────────────────────────────────────────────── */}
      {item.gallery && item.gallery.length > 0 && (
        <section className="shell pb-24 md:pb-32">
          <CaseGallery items={item.gallery} />
        </section>
      )}

      {/* ── Voir le site ────────────────────────────────────────── */}
      {item.url && (
        <section className="shell pb-24">
          <Reveal variants={fadeUp}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="view"
              data-cursor-label="Visiter"
              className="group flex flex-col gap-4 border-y hairline py-10 md:flex-row md:items-end md:justify-between"
            >
              <span className="label">Voir le site en ligne</span>
              <span className="flex items-center gap-4 font-display text-[clamp(2.4rem,7vw,6.5rem)] font-semibold leading-none tracking-[-0.05em] transition-colors duration-500 group-hover:text-[var(--tint)]">
                {host(item.url)}
                <ArrowUpRight className="h-[0.6em] w-[0.6em] transition-transform duration-500 group-hover:-translate-y-2 group-hover:translate-x-2" />
              </span>
            </a>
          </Reveal>
        </section>
      )}

      {/* ── Projet suivant ──────────────────────────────────────── */}
      <section className="shell pb-12">
        <Link
          href={`/cases/${next.slug}`}
          data-cursor="view"
          data-cursor-label="Suivant"
          className="group grid items-center gap-8 rounded-[28px] border hairline p-6 transition-colors duration-500 hover:border-bone/30 md:grid-cols-[1fr_auto] md:p-10"
        >
          <div>
            <p className="label">Projet suivant</p>
            <p className="mt-4 flex items-center gap-5 font-display text-[clamp(2.2rem,5.5vw,5rem)] font-semibold leading-none tracking-[-0.045em] transition-colors group-hover:text-accent">
              {next.client}
              <ArrowRight className="h-9 w-9 shrink-0 transition-transform duration-500 group-hover:translate-x-2 md:h-14 md:w-14" />
            </p>
            <p className="mt-3 text-mute">{next.summary}</p>
          </div>
          <div className="w-full overflow-hidden rounded-2xl md:w-72">
            <CaseCover item={next} className="aspect-[4/3] transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105" />
          </div>
        </Link>
      </section>

      <ContactCta />
    </div>
  );
}
