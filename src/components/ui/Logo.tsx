/* eslint-disable @next/next/no-img-element */
import { cn } from "@/lib/utils";

/** Proportions du logo vectorisé (public/brand/logo.svg) */
export const LOGO_RATIO = 786 / 282;

/** Logo Target Agency — version claire (fond sombre) ou encre (fond clair) */
export function Logo({ className, tone = "light" }: { className?: string; tone?: "light" | "ink" }) {
  return (
    <img
      src={tone === "ink" ? "/brand/logo-ink.svg" : "/brand/logo.svg"}
      alt="Target Agency"
      width={112}
      height={40}
      className={cn("h-10 w-auto select-none md:h-12", className)}
      draggable={false}
    />
  );
}

/** Symbole seul : la flèche orange (favicon, petits espaces) */
export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/brand/logo-mark.svg"
      alt=""
      aria-hidden
      width={16}
      height={16}
      className={cn("h-4 w-4 rounded-[4px]", className)}
      draggable={false}
    />
  );
}
