/**
 * Récupère les visuels des réalisations depuis le portfolio Framer et les enregistre
 * dans /public (une seule fois : les fichiers déjà présents sont ignorés).
 *
 * Lancé automatiquement avant `npm run dev` et `npm run build` (predev / prebuild),
 * donc aussi sur Vercel. Ne bloque jamais le build : en cas d'échec, un avertissement.
 *
 * Manuel : `npm run images` (ajouter --force pour tout retélécharger).
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const manifest = JSON.parse(await readFile(join(root, "scripts/portfolio-images.json"), "utf8"));

const exists = async (p) => {
  try {
    return (await stat(p)).size > 0;
  } catch {
    return false;
  }
};

const entries = Object.entries(manifest);
const todo = [];
for (const [rel, url] of entries) if (force || !(await exists(join(root, rel)))) todo.push([rel, url]);

if (todo.length === 0) {
  console.log(`✓ Visuels des réalisations : ${entries.length}/${entries.length} déjà présents`);
  process.exit(0);
}

console.log(`↓ Récupération de ${todo.length} visuel(s) depuis le portfolio Framer…`);
let ok = 0;
const failed = [];
const queue = [...todo];
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length) {
      const [rel, url] = queue.shift();
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        const dest = join(root, rel);
        await mkdir(dirname(dest), { recursive: true });
        await writeFile(dest, buf);
        ok++;
      } catch (e) {
        failed.push(`${rel} (${e.message})`);
      }
    }
  }),
);

console.log(`✓ ${ok}/${todo.length} visuel(s) enregistré(s) dans /public/cases`);
if (failed.length) {
  console.warn(`⚠ ${failed.length} visuel(s) non récupéré(s) — relancez \`npm run images\` avec une connexion :`);
  for (const f of failed) console.warn("   · " + f);
}
process.exit(0);
