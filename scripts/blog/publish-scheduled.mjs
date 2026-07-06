#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "marketing", "blog");
const TIME_ZONE = "America/Sao_Paulo";

function todayInSaoPaulo() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`Frontmatter ausente em ${file}`);

  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
    if (value) meta[key] = value;
  }

  return { frontmatter: match[1], meta };
}

function publish(raw, frontmatter) {
  const updatedFrontmatter = frontmatter.replace(/^status:\s*scheduled\s*$/m, "status: published");
  return raw.replace(frontmatter, updatedFrontmatter);
}

function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Pasta de posts nao encontrada: ${SRC_DIR}`);
    process.exit(1);
  }

  const today = process.env.BLOG_TODAY || todayInSaoPaulo();
  const files = readdirSync(SRC_DIR).filter(
    (file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md" && !file.startsWith("_")
  );

  let published = 0;
  for (const file of files) {
    const path = join(SRC_DIR, file);
    const raw = readFileSync(path, "utf8");
    const { frontmatter, meta } = parseFrontmatter(raw, file);

    if (meta.status !== "scheduled") continue;
    if (!meta.publishAt) {
      throw new Error(`${file} esta scheduled, mas nao tem publishAt`);
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(meta.publishAt)) {
      throw new Error(`${file} tem publishAt invalido: use YYYY-MM-DD`);
    }
    if (meta.publishAt > today) {
      console.log(`agendado para depois: ${file} (${meta.publishAt})`);
      continue;
    }

    writeFileSync(path, publish(raw, frontmatter), "utf8");
    published++;
    console.log(`publicado: ${file} (${meta.publishAt})`);
  }

  console.log(`${published} post(s) publicado(s) em ${today}.`);
}

main();
