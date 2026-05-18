#!/usr/bin/env node
/**
 * Lucide contribution validator.
 *
 * Checks every icon pair in ../icons/ against Lucide's contribution rules.
 * Files prefixed with "_" are skipped (templates).
 *
 * Usage:  node scripts/validate.mjs
 *
 * Exits 0 if everything passes, 1 otherwise.
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ICONS_DIR = resolve(__dirname, "..", "icons");
const SCHEMA_PATH = resolve(__dirname, "..", "icon.schema.json");

const ALLOWED_CATEGORIES = new Set(
  JSON.parse(readFileSync(SCHEMA_PATH, "utf8"))
    .properties.categories.items.enum,
);

const ALLOWED_SVG_ELEMENTS = new Set([
  "path",
  "line",
  "polygon",
  "polyline",
  "circle",
  "ellipse",
  "rect",
]);

// Attributes that may legitimately appear on a shape element. Anything else
// (transform, filter, fill, stroke, style, opacity, …) is rejected.
const ALLOWED_SHAPE_ATTRS = new Set([
  // path
  "d",
  // line
  "x1",
  "y1",
  "x2",
  "y2",
  // polygon / polyline
  "points",
  // circle / ellipse
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  // rect
  "x",
  "y",
  "width",
  "height",
]);

const REQUIRED_SVG_ATTRS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "2",
  "stroke-linecap": "round",
  "stroke-linejoin": "round",
};

const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

let errors = 0;
let warnings = 0;
let checked = 0;

function fail(file, msg) {
  console.error(`  \u2717 ${file}: ${msg}`);
  errors++;
}
function warn(file, msg) {
  console.warn(`  \u26a0 ${file}: ${msg}`);
  warnings++;
}

function parseSvgAttrs(svg) {
  const openTag = svg.match(/<svg\b([^>]*)>/i);
  if (!openTag) return null;
  const attrs = {};
  const re = /([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(openTag[1])) !== null) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

function findShapeElements(svg) {
  // Returns [{ tag, attrs, raw }] for every non-svg element.
  const elements = [];
  const re = /<([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*?)\/?>(?!\s*<\/\1>)/g;
  let m;
  while ((m = re.exec(svg)) !== null) {
    const tag = m[1].toLowerCase();
    if (tag === "svg") continue;
    const attrs = {};
    const attrRe = /([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g;
    let a;
    while ((a = attrRe.exec(m[2])) !== null) attrs[a[1]] = a[2];
    elements.push({ tag, attrs, raw: m[0] });
  }
  return elements;
}

function validateSvg(name, svg) {
  // 1. Global SVG attributes
  const attrs = parseSvgAttrs(svg);
  if (!attrs) {
    fail(`${name}.svg`, "no <svg> root element found");
    return;
  }
  for (const [key, expected] of Object.entries(REQUIRED_SVG_ATTRS)) {
    if (attrs[key] !== expected) {
      fail(
        `${name}.svg`,
        `attribute ${key} should be "${expected}", got ${
          attrs[key] === undefined ? "missing" : `"${attrs[key]}"`
        }`,
      );
    }
  }

  // 2. Forbidden elements
  if (/<use\b/i.test(svg)) {
    fail(`${name}.svg`, "<use> is not allowed (ID collisions in HTML)");
  }
  if (/<(g|defs|symbol|mask|clipPath|filter|style|script)\b/i.test(svg)) {
    fail(
      `${name}.svg`,
      "only path, line, polygon, polyline, circle, ellipse, rect are allowed",
    );
  }

  // 3. Per-element attribute whitelist
  for (const el of findShapeElements(svg)) {
    if (!ALLOWED_SVG_ELEMENTS.has(el.tag)) {
      fail(`${name}.svg`, `<${el.tag}> is not an allowed element`);
      continue;
    }
    for (const attr of Object.keys(el.attrs)) {
      if (!ALLOWED_SHAPE_ATTRS.has(attr)) {
        fail(
          `${name}.svg`,
          `<${el.tag}> has forbidden attribute "${attr}" (no transforms, fills, strokes, styles)`,
        );
      }
    }
  }

  // 4. Path precision heuristic — flag numbers with > 3 decimal places
  const overPrecise = svg.match(/\d+\.\d{4,}/g);
  if (overPrecise) {
    warn(
      `${name}.svg`,
      `${overPrecise.length} number(s) with >3 decimal places — tidy via Lucide Studio`,
    );
  }
}

function validateJson(name, jsonRaw) {
  let data;
  try {
    data = JSON.parse(jsonRaw);
  } catch (e) {
    fail(`${name}.json`, `invalid JSON: ${e.message}`);
    return;
  }

  // Required fields per schema
  for (const key of ["$schema", "categories", "tags"]) {
    if (!(key in data)) fail(`${name}.json`, `missing required field "${key}"`);
  }
  if (data.$schema !== "../icon.schema.json") {
    warn(
      `${name}.json`,
      `$schema should be "../icon.schema.json", got "${data.$schema}"`,
    );
  }

  // Categories
  if (Array.isArray(data.categories)) {
    if (data.categories.length === 0) {
      warn(`${name}.json`, "categories array is empty");
    }
    for (const cat of data.categories) {
      if (!ALLOWED_CATEGORIES.has(cat)) {
        fail(`${name}.json`, `unknown category "${cat}"`);
      }
    }
  } else {
    fail(`${name}.json`, "categories must be an array");
  }

  // Tags
  if (Array.isArray(data.tags)) {
    if (data.tags.length < 1) {
      fail(`${name}.json`, "tags must contain at least one item");
    }
  } else {
    fail(`${name}.json`, "tags must be an array");
  }

  // Contributors
  if (data.contributors !== undefined) {
    if (!Array.isArray(data.contributors) || data.contributors.length < 1) {
      fail(`${name}.json`, "contributors, if present, must be a non-empty array");
    } else if (data.contributors.some((c) => c === "your-github-username")) {
      fail(`${name}.json`, 'contributors still contains the placeholder "your-github-username"');
    }
  }
}

function validateName(name) {
  if (!NAME_RE.test(name)) {
    fail(
      `${name}`,
      "name must be lower-kebab-case (a-z, 0-9, single hyphens; no leading/trailing/double hyphens)",
    );
  }
}

// ── Run ───────────────────────────────────────────────────────────────────
console.log(`Validating icons in ${ICONS_DIR}\n`);

const entries = readdirSync(ICONS_DIR);
const svgFiles = new Set(
  entries.filter((f) => f.endsWith(".svg") && !f.startsWith("_")),
);
const jsonFiles = new Set(
  entries.filter((f) => f.endsWith(".json") && !f.startsWith("_")),
);
const names = new Set(
  [...svgFiles, ...jsonFiles].map((f) => f.replace(/\.(svg|json)$/, "")),
);

if (names.size === 0) {
  console.log("No icons to validate yet. Add a .svg + .json pair to icons/.\n");
  process.exit(0);
}

for (const name of [...names].sort()) {
  console.log(`• ${name}`);
  validateName(name);

  if (!svgFiles.has(`${name}.svg`)) {
    fail(name, "missing matching .svg file");
  } else {
    const svg = readFileSync(join(ICONS_DIR, `${name}.svg`), "utf8");
    validateSvg(name, svg);
  }

  if (!jsonFiles.has(`${name}.json`)) {
    fail(name, "missing matching .json metadata file");
  } else {
    const json = readFileSync(join(ICONS_DIR, `${name}.json`), "utf8");
    validateJson(name, json);
  }
  checked++;
}

console.log(
  `\n${checked} icon(s) checked — ${errors} error(s), ${warnings} warning(s)`,
);
process.exit(errors > 0 ? 1 : 0);
