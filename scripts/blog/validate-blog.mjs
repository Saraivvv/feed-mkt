#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");
const SRC_DIR = join(ROOT, "marketing", "blog");

const REQUIRED = ["title", "slug", "description", "date", "status"];
const PUBLISHED_REQUIRED = [
  "seoTitle",
  "keyword",
  "category",
  "stage",
  "contentType",
  "readerQuestion",
  "painPoint",
  "businessOutcome",
  "heroSummary",
  "cardLabel",
  "cardTakeaway",
  "readingPromise",
];

function unquote(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function parseFrontmatter(raw, file) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) throw new Error(`Frontmatter ausente em ${file}`);

  const meta = {};
  let activeList = null;
  for (const line of match[1].split(/\r?\n/)) {
    const listItem = line.match(/^\s+-\s+(.+)$/);
    if (listItem && activeList) {
      meta[activeList].push(unquote(listItem[1].trim()));
      continue;
    }

    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (!value) {
      meta[key] = [];
      activeList = key;
    } else {
      meta[key] = unquote(value);
      activeList = null;
    }
  }

  return { meta, body: raw.slice(match[0].length) };
}

function wordCount(markdown) {
  return markdown.split(/\s+/).filter(Boolean).length;
}

function validatePost(file, meta, body) {
  const errors = [];
  const warnings = [];

  for (const field of REQUIRED) {
    if (!meta[field]) errors.push(`campo obrigatorio ausente: ${field}`);
  }

  if (meta.date && !/^\d{4}-\d{2}-\d{2}$/.test(meta.date)) {
    errors.push("date deve usar YYYY-MM-DD");
  }

  if (meta.status && !["draft", "scheduled", "published", "planned"].includes(meta.status)) {
    errors.push("status deve ser draft, scheduled, published ou planned");
  }

  if (meta.publishAt && !/^\d{4}-\d{2}-\d{2}$/.test(meta.publishAt)) {
    errors.push("publishAt deve usar YYYY-MM-DD");
  }

  if (meta.status === "scheduled" && !meta.publishAt) {
    errors.push("post scheduled precisa de publishAt");
  }

  if (meta.status === "published") {
    for (const field of PUBLISHED_REQUIRED) {
      if (!meta[field] || (Array.isArray(meta[field]) && meta[field].length === 0)) {
        errors.push(`post publicado sem campo editorial: ${field}`);
      }
    }

    if (wordCount(body) < 800) warnings.push("post publicado com menos de 800 palavras");
    if (meta.seoTitle && meta.seoTitle.length > 60) warnings.push(`seoTitle com ${meta.seoTitle.length} caracteres`);
    if (meta.description && meta.description.length > 165) {
      warnings.push(`description com ${meta.description.length} caracteres`);
    }
    if (Array.isArray(meta.readingPromise) && meta.readingPromise.length < 3) {
      warnings.push("readingPromise deveria ter pelo menos 3 itens");
    }
  }

  return { file, errors, warnings, slug: meta.slug };
}

function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`Pasta de posts nao encontrada: ${SRC_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(SRC_DIR).filter(
    (file) => file.endsWith(".md") && file.toLowerCase() !== "readme.md" && !file.startsWith("_")
  );
  const seenSlugs = new Map();
  const results = [];

  for (const file of files) {
    const raw = readFileSync(join(SRC_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw, file);
    const result = validatePost(file, meta, body);
    if (result.slug) {
      if (seenSlugs.has(result.slug)) {
        result.errors.push(`slug duplicado com ${seenSlugs.get(result.slug)}: ${result.slug}`);
      }
      seenSlugs.set(result.slug, file);
    }
    results.push(result);
  }

  let errorCount = 0;
  let warningCount = 0;
  for (const result of results) {
    for (const error of result.errors) {
      console.error(`[erro] ${result.file}: ${error}`);
      errorCount++;
    }
    for (const warning of result.warnings) {
      console.warn(`[aviso] ${result.file}: ${warning}`);
      warningCount++;
    }
  }

  console.log(`${files.length} post(s) verificado(s), ${errorCount} erro(s), ${warningCount} aviso(s).`);
  if (errorCount > 0) process.exit(1);
}

main();
