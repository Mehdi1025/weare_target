"use client";

import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { cn } from "@/lib/utils";

/**
 * Fond animé du hero : fumée rouge + ondes de « cible » qui partent d'un
 * centre attiré par la souris, anneaux qui respirent, anneau d'accent pulsé,
 * anneau en pointillés qui tourne, réticule, grain et vignettage.
 *
 * Deux moteurs, même rendu :
 *  - "gl" : shader WebGL (par défaut)
 *  - "2d" : Canvas 2D, utilisé automatiquement si WebGL est absent, échoue
 *           ou perd son contexte. Fonctionne partout, sans GPU.
 * Il n'y a plus de repli statique : le hero est toujours animé.
 *
 * Debug : ajouter ?hero=2d ou ?hero=gl à l'URL pour forcer un moteur.
 * Le moteur utilisé est écrit dans la console ([HeroShader]) et dans
 * l'attribut data-hero-mode du canvas.
 */

type Mode = "gl" | "2d";
type Props = {
  className?: string;
  /** 0 → 1 : apparition (piloté par le hero) */
  intro: MutableRefObject<number>;
  /** 0 → 1 : progression du scroll dans le hero */
  scroll: MutableRefObject<number>;
};

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;
uniform float u_intro;
uniform float u_grain;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i+vec2(1.,0.)), c = hash(i+vec2(0.,1.)), d = hash(i+vec2(1.,1.));
  vec2 u = f*f*(3.-2.*f);
  return mix(a,b,u.x) + (c-a)*u.y*(1.-u.x) + (d-b)*u.x*u.y;
}
float fbm(vec2 p){
  float v = 0., a = .5;
  mat2 r = mat2(.8,.6,-.6,.8);
  for(int i=0;i<5;i++){ v += a*vnoise(p); p = r*p*2.02; a *= .5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_res.xy;
  float asp = u_res.x / u_res.y;
  vec2 p = vec2(uv.x*asp, uv.y);
  float t = u_time*.06;

  vec2 q = vec2(fbm(p*1.4 + t), fbm(p*1.4 + vec2(5.2,1.3) - t));
  vec2 r = vec2(fbm(p*1.6 + 3.*q + vec2(1.7,9.2) + t*1.3), fbm(p*1.6 + 3.*q + vec2(8.3,2.8) - t*1.1));
  float smoke = fbm(p*1.2 + 2.6*r);

  vec3 ink   = vec3(.090,.090,.090);
  vec3 ember = vec3(.29,.07,.05);
  vec3 acc   = vec3(1.,.227,.141);
  vec3 bone  = vec3(.95,.93,.9);

  vec2 c = mix(vec2(.70*asp,.56), vec2(u_mouse.x*asp, u_mouse.y), .45);
  vec2 d = p - c;
  float dist = length(d) + (smoke-.5)*.07;
  float ang = atan(d.y, d.x);

  float wave = fract(dist*16. - u_time*.55);
  float ring = smoothstep(.0, .045, wave) * smoothstep(.12, .05, wave);
  float fade = smoothstep(1.25, .05, dist);
  ring *= fade * (.35 + .65*smoothstep(.2,.9,smoke));

  float rings = 0.;
  for(int i=1;i<5;i++){
    float fi = float(i);
    float rr = fi*.11 + .02*sin(u_time*.4 + fi);
    float w = i == 2 ? 1. : .45;
    rings += smoothstep(.006,.0, abs(dist - rr)) * w;
  }
  float pulse = .5 + .5*sin(u_time*1.6);
  float accent = smoothstep(.012,.0, abs(dist - (.22 + .015*pulse)));
  float dash = step(.5, fract(ang*6./3.14159 + u_time*.08));
  float dashed = smoothstep(.004,.0, abs(dist - .44)) * dash;

  vec3 col = mix(ink, ember, smoothstep(.35, .95, smoke) * (.55 + .45*fade));
  col += acc * ring * .22;
  col += bone * (rings*.10 + dashed*.08);
  col += acc * accent * (.55 + .45*pulse);
  col += acc * .55 * smoothstep(.06,.0, dist) * (.6 + .4*pulse);
  col += acc * .10 * smoothstep(.9, .0, dist) * (1. + u_scroll*1.5);

  float reticle = (smoothstep(.0015,.0, abs(d.x)) + smoothstep(.0015,.0, abs(d.y))) * smoothstep(.75,.25,dist) * smoothstep(.03,.06,dist);
  col += bone * reticle * .06;

  float vig = smoothstep(1.35, .35, length((uv-.5)*vec2(asp*.9,1.)));
  col *= .55 + .45*vig;
  col += (hash(gl_FragCoord.xy + fract(u_time)*100.*u_grain) - .5) * .045;

  col = mix(ink, col, u_intro);
  gl_FragColor = vec4(col, 1.);
}
`;

const log = (...a: unknown[]) => console.info("[HeroShader]", ...a);

/* --------------------------------------------------------------------------
 * Composant
 * ------------------------------------------------------------------------ */

export function HeroShader({ className, intro, scroll }: Props) {
  const [mode, setMode] = useState<Mode>("gl");

  // Forçage via ?hero=2d / ?hero=gl
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("hero");
    if (q === "2d" || q === "gl") setMode(q);
  }, []);

  return (
    <HeroCanvas
      key={mode} // nouveau <canvas> à chaque changement de moteur
      mode={mode}
      onFail={(reason) => {
        console.warn("[HeroShader] WebGL indisponible → moteur 2D :", reason);
        setMode("2d");
      }}
      className={className}
      intro={intro}
      scroll={scroll}
    />
  );
}

function HeroCanvas({
  mode,
  onFail,
  className,
  intro,
  scroll,
}: Props & { mode: Mode; onFail: (reason: string) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const failRef = useRef(onFail);
  failRef.current = onFail;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // ---------- état partagé (souris, visibilité, mouvement réduit) ----------
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = mq.matches;
    const onMq = () => (reduced = mq.matches);
    mq.addEventListener?.("change", onMq);

    const goal = { x: 0.7, y: 0.56 }; // repère bas-gauche, 0..1
    const mouse = { x: 0.7, y: 0.56 };
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      if (!b.width || !b.height) return;
      goal.x = (e.clientX - b.left) / b.width;
      goal.y = 1 - (e.clientY - b.top) / b.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);

    // Apparition : suit `intro`, mais ne reste jamais bloquée à 0
    const mounted = performance.now();
    const introValue = (now: number) => {
      const safety = Math.min(1, Math.max(0, (now - mounted - 1800) / 1600));
      return Math.max(intro.current, safety);
    };

    // Horloge (ralentie si mouvement réduit)
    let simTime = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      simTime += dt * (reduced ? 0.25 : 1);
      const follow = reduced ? 0.015 : 0.045;
      mouse.x += (goal.x - mouse.x) * follow;
      mouse.y += (goal.y - mouse.y) * follow;
      return simTime;
    };

    const engine = mode === "gl" ? startGL(el, (r) => failRef.current(r)) : start2D(el);
    if (!engine) {
      cleanupShared();
      return;
    }
    el.dataset.heroMode = mode;
    log("moteur :", mode === "gl" ? "WebGL" : "Canvas 2D", reduced ? "(mouvement réduit)" : "");

    let raf = 0;
    let smoothScroll = scroll.current;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || document.hidden) {
        last = now;
        return;
      }
      const t = tick(now);
      smoothScroll += (scroll.current - smoothScroll) * 0.14;
      engine.draw({ t, mouse, scroll: smoothScroll, intro: introValue(now), grain: !reduced });
    };
    raf = requestAnimationFrame(frame);

    function cleanupShared() {
      mq.removeEventListener?.("change", onMq);
      window.removeEventListener("pointermove", onMove);
      io.disconnect();
    }

    return () => {
      cancelAnimationFrame(raf);
      cleanupShared();
      engine.destroy();
    };
  }, [mode, intro, scroll]);

  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 block h-full w-full transform-gpu", className)}
      style={{ background: "#171717" }}
    />
  );
}

/* --------------------------------------------------------------------------
 * Moteurs
 * ------------------------------------------------------------------------ */

type DrawArgs = { t: number; mouse: { x: number; y: number }; scroll: number; intro: number; grain: boolean };
type Engine = { draw: (a: DrawArgs) => void; destroy: () => void };

/** Taille du canvas suivie par ResizeObserver */
function trackSize(el: HTMLCanvasElement, maxDpr: () => number, onResize?: (w: number, h: number) => void) {
  const apply = () => {
    const dpr = maxDpr();
    const w = Math.max(1, Math.floor(el.clientWidth * dpr));
    const h = Math.max(1, Math.floor(el.clientHeight * dpr));
    if (el.width !== w || el.height !== h) {
      el.width = w;
      el.height = h;
      onResize?.(w, h);
    }
  };
  const ro = new ResizeObserver(apply);
  ro.observe(el);
  apply();
  return { apply, stop: () => ro.disconnect() };
}

/* ---------------------------------- WebGL --------------------------------- */

function startGL(el: HTMLCanvasElement, fail: (reason: string) => void): Engine | null {
  const opts: WebGLContextAttributes = {
    antialias: false,
    alpha: false,
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
    powerPreference: "default",
    failIfMajorPerformanceCaveat: false,
  };
  const gl = (el.getContext("webgl", opts) || el.getContext("experimental-webgl", opts)) as WebGLRenderingContext | null;
  if (!gl) {
    fail("getContext('webgl') a renvoyé null (accélération matérielle désactivée ?)");
    return null;
  }

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type);
    if (!s) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS) && !gl.isContextLost()) {
      fail(`compilation ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} : ${gl.getShaderInfoLog(s)}`);
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = vs && compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    fail(`édition de liens : ${gl.getProgramInfoLog(prog)}`);
    return null;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = {
    res: gl.getUniformLocation(prog, "u_res"),
    time: gl.getUniformLocation(prog, "u_time"),
    mouse: gl.getUniformLocation(prog, "u_mouse"),
    scroll: gl.getUniformLocation(prog, "u_scroll"),
    intro: gl.getUniformLocation(prog, "u_intro"),
    grain: gl.getUniformLocation(prog, "u_grain"),
  };

  // Résolution adaptative : si c'est lent, on baisse la définition
  let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const size = trackSize(el, () => dpr, (w, h) => gl.viewport(0, 0, w, h));
  let frames = 0;
  let acc = 0;
  let prev = 0;

  // Contexte perdu → moteur 2D
  let lost = false;
  const onLost = (e: Event) => {
    e.preventDefault();
    lost = true;
    fail("contexte WebGL perdu");
  };
  el.addEventListener("webglcontextlost", onLost);

  return {
    draw({ t, mouse, scroll, intro, grain }) {
      if (lost) return;
      const now = performance.now();
      if (prev) {
        acc += now - prev;
        frames++;
        if (frames === 60) {
          const avg = acc / frames;
          if (avg > 40 && dpr > 0.75) {
            dpr = dpr > 1 ? 1 : 0.75;
            size.apply();
            log("rendu lent, définition réduite →", dpr);
          }
          frames = 0;
          acc = 0;
        }
      }
      prev = now;
      gl.uniform2f(U.res, el.width, el.height);
      gl.uniform1f(U.time, t);
      gl.uniform2f(U.mouse, mouse.x, mouse.y);
      gl.uniform1f(U.scroll, scroll);
      gl.uniform1f(U.intro, intro);
      gl.uniform1f(U.grain, grain ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    destroy() {
      size.stop();
      el.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}

/* -------------------------------- Canvas 2D ------------------------------- */

function start2D(el: HTMLCanvasElement): Engine | null {
  const ctx = el.getContext("2d", { alpha: false });
  if (!ctx) return null;

  // Définition plafonnée : léger même sans GPU
  const dprFor = () => Math.min(window.devicePixelRatio || 1, 1.25, 1800 / Math.max(1, el.clientWidth));
  const size = trackSize(el, dprFor);

  // Texture de grain (générée une fois)
  const grainCv = document.createElement("canvas");
  grainCv.width = grainCv.height = 160;
  const g = grainCv.getContext("2d")!;
  const img = g.createImageData(160, 160);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255;
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  g.putImageData(img, 0, 0);
  const grainPattern = ctx.createPattern(grainCv, "repeat");

  const BONE = "244,243,239";
  const ACC = "255,58,36";
  const TAU = Math.PI * 2;
  const SEG = 120;

  // Déformation organique d'un cercle (remplace la fumée du shader)
  const wobble = (a: number, t: number, k: number) =>
    Math.sin(a * 2 - t * 0.35 + k * 0.6) * 0.4 +
    Math.sin(a * 3 + t * 0.7 + k) * 0.3 +
    Math.sin(a * 7 - t * 0.9 + k * 1.7) * 0.12 +
    Math.sin(a * 17 + t * 1.3 + k * 2.3) * 0.06 +
    Math.sin(a * 31 - t * 2.1 + k * 3.1) * 0.035;

  const ringPath = (cx: number, cy: number, r: number, amp: number, t: number, k: number) => {
    ctx.beginPath();
    for (let i = 0; i <= SEG; i++) {
      const a = (i / SEG) * TAU;
      const rr = r + amp * wobble(a, t, k);
      const x = cx + Math.cos(a) * rr;
      const y = cy + Math.sin(a) * rr;
      if (i) ctx.lineTo(x, y);
      else ctx.moveTo(x, y);
    }
    ctx.closePath();
  };

  const smooth = (e0: number, e1: number, x: number) => {
    const k = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
    return k * k * (3 - 2 * k);
  };

  return {
    draw({ t, mouse, scroll, intro, grain }) {
      const W = el.width;
      const H = el.height;
      const u = H; // unité = hauteur, comme dans le shader

      // Centre : à droite, attiré par la souris (repère haut-gauche)
      const cx = (0.7 * (1 - 0.45) + mouse.x * 0.45) * W;
      const cy = (1 - (0.56 * (1 - 0.45) + mouse.y * 0.45)) * H;
      const pulse = 0.5 + 0.5 * Math.sin(t * 1.6);

      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);
      ctx.fillStyle = "#171717";
      ctx.fillRect(0, 0, W, H);

      // Fumée : nappes braises qui dérivent
      ctx.globalCompositeOperation = "lighter";
      const blobs = [
        { x: 0.66, y: 0.42, r: 0.95, s: 0.07, a: 0.55 },
        { x: 0.82, y: 0.7, r: 0.7, s: 0.05, a: 0.4 },
        { x: 0.45, y: 0.25, r: 0.6, s: 0.09, a: 0.28 },
        { x: 0.9, y: 0.2, r: 0.55, s: 0.06, a: 0.3 },
      ];
      blobs.forEach((b, i) => {
        const bx = (b.x + Math.sin(t * b.s * 3 + i * 2.1) * 0.08) * W;
        const by = (b.y + Math.cos(t * b.s * 2.4 + i * 1.3) * 0.08) * H;
        const br = b.r * u * (1 + 0.12 * Math.sin(t * b.s * 4 + i));
        const gr = ctx.createRadialGradient(bx, by, 0, bx, by, br);
        gr.addColorStop(0, `rgba(74,18,13,${b.a})`);
        gr.addColorStop(0.55, `rgba(50,12,8,${b.a * 0.45})`);
        gr.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      });

      // Halo (grandit au scroll)
      const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.9 * u);
      halo.addColorStop(0, `rgba(${ACC},${0.1 * (1 + scroll * 1.5)})`);
      halo.addColorStop(1, `rgba(${ACC},0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, W, H);

      // Ondes qui partent du centre (longueur d'onde 1/16 de la hauteur)
      const lambda = u / 16;
      const offset = ((t * 0.55) % 1) * lambda;
      const maxR = 1.25 * u;
      for (let r = offset; r < maxR; r += lambda) {
        const d = r / u;
        const fade = smooth(1.25, 0.05, d) * smooth(0, 0.04, d);
        if (fade < 0.02) continue;
        const k = Math.floor((r - offset) / lambda) - Math.floor((t * 0.55) % 1e6);
        ringPath(cx, cy, r, u * (0.006 + 0.03 * d), t * 0.6, k * 0.37);
        ctx.strokeStyle = `rgba(${ACC},${0.05 * fade})`;
        ctx.lineWidth = Math.max(1, 0.012 * u);
        ctx.stroke();
        ctx.strokeStyle = `rgba(${ACC},${0.14 * fade})`;
        ctx.lineWidth = Math.max(1, 0.003 * u);
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "source-over";

      // Anneaux « cible » qui respirent
      for (let i = 1; i < 5; i++) {
        const rr = (i * 0.11 + 0.02 * Math.sin(t * 0.4 + i)) * u;
        ringPath(cx, cy, rr, 0.01 * u, t * 0.5, i * 1.9);
        ctx.strokeStyle = `rgba(${BONE},${i === 2 ? 0.16 : 0.08})`;
        ctx.lineWidth = Math.max(1, 0.004 * u);
        ctx.stroke();
      }

      // Anneau d'accent pulsé (lueur + trait)
      const ar = (0.22 + 0.015 * pulse) * u;
      ringPath(cx, cy, ar, 0.016 * u, t * 0.8, 4.2);
      ctx.strokeStyle = `rgba(${ACC},${0.12 * (0.55 + 0.45 * pulse)})`;
      ctx.lineWidth = 0.035 * u;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${ACC},${0.22 * (0.55 + 0.45 * pulse)})`;
      ctx.lineWidth = 0.016 * u;
      ctx.stroke();
      ctx.strokeStyle = `rgba(${ACC},${0.5 + 0.4 * pulse})`;
      ctx.lineWidth = Math.max(1.5, 0.006 * u);
      ctx.stroke();

      // Anneau en pointillés qui tourne (6 tirets)
      const dr = 0.44 * u;
      const per = (Math.PI / 3) * dr;
      ctx.beginPath();
      ctx.arc(cx, cy, dr, 0, TAU);
      ctx.setLineDash([per / 2, per / 2]);
      ctx.lineDashOffset = -((t * 0.08) % 1) * per;
      ctx.strokeStyle = `rgba(${BONE},0.09)`;
      ctx.lineWidth = Math.max(1, 0.003 * u);
      ctx.stroke();
      ctx.setLineDash([]);

      // Réticule
      const rIn = 0.045 * u;
      const rOut = 0.75 * u;
      const line = (x0: number, y0: number, x1: number, y1: number) => {
        const lg = ctx.createLinearGradient(x0, y0, x1, y1);
        lg.addColorStop(0, `rgba(${BONE},0.07)`);
        lg.addColorStop(1, `rgba(${BONE},0)`);
        ctx.strokeStyle = lg;
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
      };
      ctx.lineWidth = 1;
      line(cx + rIn, cy, cx + rOut, cy);
      line(cx - rIn, cy, cx - rOut, cy);
      line(cx, cy + rIn, cx, cy + rOut);
      line(cx, cy - rIn, cx, cy - rOut);

      // Cœur
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, 0.07 * u);
      core.addColorStop(0, `rgba(${ACC},${0.75 * (0.6 + 0.4 * pulse)})`);
      core.addColorStop(0.35, `rgba(${ACC},${0.3 * (0.6 + 0.4 * pulse)})`);
      core.addColorStop(1, `rgba(${ACC},0)`);
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, 0.07 * u, 0, TAU);
      ctx.fill();
      ctx.fillStyle = `rgb(${ACC})`;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.max(2, 0.008 * u), 0, TAU);
      ctx.fill();

      // Vignettage
      const vig = ctx.createRadialGradient(W / 2, H / 2, 0.2 * u, W / 2, H / 2, Math.hypot(W, H) * 0.62);
      vig.addColorStop(0, "rgba(0,0,0,0)");
      vig.addColorStop(1, "rgba(0,0,0,0.5)");
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Grain
      if (grainPattern) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.globalCompositeOperation = "overlay";
        const ox = grain ? Math.floor(Math.random() * 160) : 0;
        const oy = grain ? Math.floor(Math.random() * 160) : 0;
        ctx.translate(-ox, -oy);
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, W + 160, H + 160);
        ctx.restore();
      }

      // Apparition
      if (intro < 1) {
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1 - intro;
        ctx.fillStyle = "#171717";
        ctx.fillRect(0, 0, W, H);
        ctx.globalAlpha = 1;
      }
    },
    destroy() {
      size.stop();
    },
  };
}
