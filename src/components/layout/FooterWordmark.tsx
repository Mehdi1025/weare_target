"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Logo géant du footer, en filigrane : le mot monte avec le scroll,
 * puis la flèche et l'aiguille de la cible arrivent en orange.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const wordY = useTransform(scrollYProgress, [0, 0.8], ["55%", "0%"]);
  const accentY = useTransform(scrollYProgress, [0.35, 1], ["40%", "0%"]);
  const accentX = useTransform(scrollYProgress, [0.35, 1], ["-6%", "0%"]);
  const accentO = useTransform(scrollYProgress, [0.35, 0.8], [0, 1]);

  const mask = (src: string) => ({
    WebkitMaskImage: `url(${src})`,
    maskImage: `url(${src})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  });

  return (
    <div ref={ref} aria-hidden className="pointer-events-none mt-24 select-none overflow-hidden">
      <div className="relative w-full" style={{ aspectRatio: "786 / 282" }}>
        <motion.div style={{ y: wordY, ...mask("/brand/logo-word.svg") }} className="absolute inset-0 bg-ink-3" />
        <motion.div
          style={{ y: accentY, x: accentX, opacity: accentO, ...mask("/brand/logo-accent.svg") }}
          className="absolute inset-0 bg-accent/40"
        />
      </div>
    </div>
  );
}
