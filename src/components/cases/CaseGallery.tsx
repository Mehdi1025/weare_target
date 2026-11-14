"use client";

import Image from "next/image";
import type { CaseStudy } from "@/content/cases";
import { clipUp } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/ui/Reveal";
import { Parallax } from "@/components/motion/Parallax";

/**
 * Galerie asymétrique : pleine largeur / demi-colonnes décalées,
 * révélation par rideau, parallax interne et zoom lent au survol.
 */
export function CaseGallery({ items }: { items: NonNullable<CaseStudy["gallery"]> }) {
  let half = 0;
  return (
    <div className="grid gap-5 md:grid-cols-2 md:gap-8">
      {items.map((im, i) => {
        const isHalf = im.span === "half";
        const offset = isHalf && half++ % 2 === 1;
        return (
          <figure
            key={im.src}
            data-cursor="view"
            data-cursor-label="Voir"
            className={cn("group", !isHalf && "md:col-span-2", offset && "md:mt-28")}
          >
            <Reveal variants={clipUp} className="overflow-hidden rounded-[22px] bg-ink-2 md:rounded-[28px]">
              <Parallax amount={4} className="w-full" style={{ aspectRatio: `${im.w} / ${im.h}` }}>
                <div className="absolute inset-0 transition-transform duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]">
                  <Image
                    src={im.src}
                    alt={im.alt}
                    fill
                    sizes={isHalf ? "(max-width: 768px) 92vw, 46vw" : "(max-width: 1440px) 92vw, 1360px"}
                    className="object-cover"
                  />
                </div>
              </Parallax>
            </Reveal>
            <figcaption className="label mt-3 flex gap-3">
              <span className="text-[var(--tint)]">({String(i + 1).padStart(2, "0")})</span>
              <span className="normal-case tracking-normal">{im.alt}</span>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
