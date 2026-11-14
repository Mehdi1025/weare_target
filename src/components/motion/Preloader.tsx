"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from "motion/react";
import { ease } from "@/lib/motion";
import { useTransitionState } from "./TransitionProvider";


function Counter({ onDone }: { onDone: () => void }) {
  const v = useMotionValue(0);
  const rounded = useTransform(v, (n) => String(Math.round(n)).padStart(3, "0"));
  const width = useTransform(v, (n) => `${n}%`);
  const [text, setText] = useState("000");

  useEffect(() => {
    const unsub = rounded.on("change", setText);
    const controls = animate(v, 100, { duration: 1.6, ease: [0.65, 0, 0.35, 1], onComplete: onDone });
    return () => {
      unsub();
      controls.stop();
    };
  }, [v, rounded, onDone]);

  return (
    <>
      <motion.div style={{ width }} className="absolute bottom-0 left-0 h-[3px] bg-accent" />
      <span className="font-mono text-sm tabular-nums text-mute">{text}</span>
    </>
  );
}

export function Preloader() {
  const { phase, endIntro } = useTransitionState();

  return (
    <AnimatePresence>
      {phase === "intro" && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-5 md:p-10"
          exit={{ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 1, ease: ease.quart } }}
          style={{ clipPath: "inset(0% 0% 0% 0%)" }}
        >
          <div className="flex items-start justify-between">
            <span className="label text-accent">(qtf® — 00)</span>
            <span className="label">Agence de marketing digital & de communication</span>
          </div>
          {/* Logo : le mot se dévoile de gauche à droite, puis la flèche et l'aiguille de la cible jaillissent */}
          <motion.div
            role="img"
            aria-label="Target Agency"
            className="relative w-[min(86vw,920px)]"
            style={{ aspectRatio: "786 / 282" }}
            exit={{ y: "-20%", opacity: 0, transition: { duration: 0.6, ease: ease.quart } }}
          >
            <motion.img
              src="/brand/logo-word.svg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
              initial={{ clipPath: "inset(0% 100% 0% 0%)" }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
              transition={{ duration: 1.2, ease: ease.quart, delay: 0.1 }}
            />
            <motion.img
              src="/brand/logo-accent.svg"
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full"
              initial={{ opacity: 0, x: "-6%", y: "18%", scale: 0.92 }}
              animate={{ opacity: 1, x: "0%", y: "0%", scale: 1 }}
              transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.85 }}
            />
          </motion.div>
          <div className="relative flex items-end justify-between pb-4">
            <span className="label">Votre image. Notre cible.</span>
            <Counter onDone={endIntro} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
