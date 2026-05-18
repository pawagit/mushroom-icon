# mushroom-icon

A local working repo for designing icons that follow [Lucide's contribution rules](https://lucide.dev/contribute). Anything in `icons/` is structured so it can be dropped straight into the [`lucide-icons/lucide`](https://github.com/lucide-icons/lucide) repo's `icons/` directory as a PR.

## What's in here

```
mushroom-icon/
├── icons/                  # Your icons go here — one .svg + one .json per icon
├── icons_template/         # Starter files to copy from (not part of any PR)
│   ├── _template.svg       # Starter SVG with the required global attributes
│   └── _template.json      # Starter metadata file
├── previews/               # Optional supporting docs (HTML previews, etc.)
├── docs/
│   └── lucide-icon-design-guide.md  # Full Lucide icon-design reference
├── scripts/
│   └── validate.mjs        # Local validator — run before opening a PR
├── icon.schema.json        # Lucide's official metadata schema (vendored)
├── CONTRIBUTING.md         # Lucide's design principles + naming/code rules
├── LICENSE                 # ISC — same license as Lucide
├── .editorconfig
└── .gitignore
```

## Workflow

1. **Design** an icon following [`CONTRIBUTING.md`](./CONTRIBUTING.md). For the full design rules — canvas, padding, stroke, optical volume, naming, code conventions, and a pre-submission checklist — see [`docs/lucide-icon-design-guide.md`](./docs/lucide-icon-design-guide.md). Use [Lucide Studio](https://studio.lucide.dev/) to tidy the SVG (3 decimals of precision).
2. **Copy** `icons_template/_template.svg` to `icons/<icon-name>.svg` and paste in your shapes. Name it in lower-kebab-case, describing what's drawn (not the use case).
3. **Copy** `icons_template/_template.json` to `icons/<icon-name>.json` and fill in tags, categories, and contributors.
4. **Validate** locally (see [Using the validator](#using-the-validator)):
   ```bash
   node scripts/validate.mjs
   ```
5. **Submit** — copy the `.svg` and `.json` pair into a fork of `lucide-icons/lucide` under `icons/`, then open a PR. Submit one icon family per PR (e.g. `arrow-up` + `arrow-down` together; `bicycle` separately). Only the `icons/` pair goes into the PR — `icons_template/` and `previews/` stay here.

## Using the validator

`scripts/validate.mjs` is a zero-dependency Node script (Node 18+, ESM). Run it from the repo root:

```bash
node scripts/validate.mjs
```

It scans **only** the `icons/` directory, pairs every `<name>.svg` with its `<name>.json`, and checks each pair against Lucide's rules:

- **Name** — lower-kebab-case (`a-z`, `0-9`, single hyphens; no leading/trailing/double hyphens).
- **Pairing** — every icon must have *both* a `.svg` and a matching `.json`; an orphan of either is an error.
- **SVG** — required global attributes (`viewBox`, `stroke="currentColor"`, `stroke-width="2"`, etc.); only `path`, `line`, `polygon`, `polyline`, `circle`, `ellipse`, `rect` elements; no `transform`/`fill`/`stroke`/`style` on shapes; no `<use>`/`<g>`/`<defs>`/etc.
- **JSON** — valid JSON with required `$schema`, `categories`, `tags`; categories must be from the schema's allowed list; at least one tag; `contributors` (if present) non-empty and not the placeholder.

Output and exit codes:

- Each icon is listed with `✓` problems as **errors** and `⚠` as **warnings** (e.g. SVG numbers with >3 decimal places — tidy these via Lucide Studio).
- **Exit `0`** when there are no errors (warnings still pass).
- **Exit `1`** when any error is found — fix everything before opening a PR.

Files starting with `_` are skipped, and anything outside `icons/` (including `icons_template/` and `previews/`) is never read — so the validator only ever judges what would actually go into a Lucide PR.

## Notes

- The `$schema` path in your icon JSON points to `../icon.schema.json` — this matches Lucide's repo layout exactly, so the file works unchanged once moved.
- The `_template.*` files live in `icons_template/`, fully outside the validator's scan. They keep a leading `_` so that even if copied into `icons/` they'd still be skipped and won't collide with real icon names.
- `previews/` is for optional supporting material (e.g. an HTML page showcasing an icon). It is ignored by the validator and excluded from Lucide PRs.
- Lucide does **not** accept brand logos. See [their brand-logo statement](https://lucide.dev/brand-logo-statement).

## License

This repo is licensed [ISC](./LICENSE), the same license as [Lucide](https://github.com/lucide-icons/lucide). `icon.schema.json`, the guidance in `CONTRIBUTING.md`, and `docs/lucide-icon-design-guide.md` are derived from the Lucide project (© Lucide Contributors, ISC); see the LICENSE file for attribution.
