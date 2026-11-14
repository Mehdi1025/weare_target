"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { site } from "@/content/site";
import { Index } from "@/components/ui/Section";
import { Parallax } from "@/components/motion/Parallax";

const text =
  "Chaque entreprise a une histoire, une ambition, une vision. Notre rôle : en faire une marque qui inspire confiance et impose sa présence. Nous ne créons rien au hasard.";

function Word({ word, i, total, progress }: { word: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, start + 1 / total], [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {word}
    </motion.span>
  );
}

export function Vision() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");

  return (
    <section className="shell py-28 md:py-40">
      <div className="grid gap-10 md:grid-cols-12 md:items-start md:gap-12 lg:gap-16">
        <div className="md:col-span-5 lg:col-span-4">
          <Parallax amount={10} className="aspect-[4/5] w-full max-w-md rounded-2xl bg-ink-2 md:max-w-none">
            <Image
              src="/team/adam.png"
              alt={`${site.founder.name}, ${site.founder.role} — Target Agency`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-[center_18%]"
            />
          </Parallax>
        </div>

        <div className="md:col-span-7 lg:col-span-8">
          <Index n="02">Notre vision de la marque</Index>
          <p ref={ref} className="display-md mt-8 leading-[1.12]! tracking-[-0.03em] md:mt-10">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} total={words.length} progress={scrollYProgress} />
            ))}
          </p>
          <div className="mt-12 flex flex-col gap-6 border-t hairline pt-10 sm:flex-row sm:items-center sm:gap-8">
            <div>
              <p className="font-medium">{site.founder.name}</p>
              <p className="label mt-1">{site.founder.role}</p>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-mute sm:ml-auto">
              Nous analysons votre vision, votre audience et vos objectifs pour construire une marque avec un
              véritable impact.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}