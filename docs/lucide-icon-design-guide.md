# Lucide Icon Design Guide

> Reference for designing icons that follow Lucide's official guidelines.
> Source: https://lucide.dev/contribute/icon-design-guide

---

## Icon Design Principles

These are the core rules that must be followed to keep quality and consistency across the Lucide icon set.

### 1. Canvas size
Icons must be designed on a **24 × 24 pixel** canvas.

### 2. Padding
Icons must have **at least 1 pixel of padding** within the canvas (i.e., the artwork should sit inside a 22×22 area at minimum).

### 3. Stroke width
Icons must have a **stroke width of 2 pixels**.

### 4. Joins
Icons must use **round joins** (`stroke-linejoin="round"`).

### 5. Caps
Icons must use **round caps** (`stroke-linecap="round"`).

### 6. Stroke alignment
Icons must use **centered strokes** (stroke is centered on the path, not inside or outside).

### 7. Border radius
Shapes (such as rectangles) must use a border radius based on size:

- **2 pixels** if the shape is **at least 8 pixels** in size.
- **1 pixel** if the shape is **smaller than 8 pixels**.

### 8. Element spacing
Distinct elements must have **2 pixels of spacing between each other**.

This applies whether elements are separate, connected, or abruptly cut.

### 9. Optical volume
Icons should have a **similar optical volume to `circle` and `square`** — they should feel like they take up the same amount of visual weight as these baseline shapes.

> **Tip:** Place your icon next to the `circle` or `square` icon and blur them both. Your icon should not feel much darker (heavier) or lighter than the base shape.

### 10. Visual centering
Icons should be **visually centered by their center of gravity**, not by their bounding box.

> **Tip:** Place your icon both above/below and next to the `square` or `circle` icon and check if it feels off-center. Symmetrical icons should always be aligned to the geometric center.

### 11. Visual density
Icons should have **similar visual density and level of detail** to the rest of the set.

> **Tip:** Try to make abstractions where elements are dense. Blur your icon — when blurred, it should not feel overly dark compared to other icons.

### 12. Smooth curves
**Continuous curves should join smoothly** — no uneven curvature.

> **Tip:** Use arcs or quadratic curves. When using cubic curves, control points should have mirrored angles to ensure smooth transitions.

### 13. Pixel perfection
Icons should aim to be **pixel perfect** so they remain sharp on low-DPI displays.

> **Tip:** Whenever possible, align elements and arc centers to the pixel grid.

### 14. Shared shapes
Icons should **share common shapes** within groups and variants. Create consistency, reuse shapes, and aim for uniformity across related icons.

- Consistency inside groups and variants has a **lower priority** than the rules above.
- **Example:** All `-off` icons should look the same — unless doing so would violate the optical volume rule.

> **Tip:** Try to avoid moving the base shape, so icons work well in toggle contexts (e.g., on/off states).

---

## Naming Conventions

1. **Lower kebab-case.** Use `arrow-up`, not `Arrow Up`.
2. **International English.** Use `color`, not `colour`.
3. **Name by depiction, not by use case.** Use `floppy-disk` instead of `save`; use `circle-slash` instead of `ban`.
4. **Group variants follow `<group>-<variant>`.** E.g., `badge-plus` is based on `badge`.
5. **Alternates describe what's unique, not numbered.** Use `send-horizontal`, not `send-2`.
6. **No numerals in names** unless the number itself appears in the icon. E.g., `arrow-down-0-to-1` is valid because both numerals are depicted.
7. **Multiple elements of different sizes: largest first.** If the circle is bigger than the person → `circle-person`. If the person is bigger → `person-circle`.
8. **Multiple elements of equal size: front-to-back, otherwise English reading order** (top to bottom, left to right). If the pencil is in front of, above, or left of the ruler → `pencil-ruler`; otherwise → `ruler-pencil`.
9. **Variations use `[element]-[modifier]`.** A dashed circle is `circle-dashed` (not `dashed-circle`). Combined: a dashed circle containing a broken heart → `circle-dashed-heart-broken`.

---

## Code Conventions

### Global SVG attributes
Every icon SVG must use these exact attributes:

```xml
<svg
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <!-- SVG elements -->
</svg>
```

### Minify paths
Path data can become large. Tidy paths to **3 points of precision** to keep file size low. Lucide recommends [Lucide Studio](https://studio.lucide.dev/) for this.

### Allowed elements
SVG files may only contain simple path and shape elements, with **no attributes other than sizing/spacing**:

- `<path d>`
- `<line x1 x2>` (also `y1 y2`)
- `<polygon points>`
- `<polyline points>`
- `<circle cx cy r>`
- `<ellipse cx cy rx ry>`
- `<rect x y width height rx>`

### Disallowed
- No `transform`, `filter`, `fill`, or explicit `stroke` attributes on elements.
- **Never use `<use>`** — IDs cannot be guaranteed unique once SVGs are embedded in HTML.

---

## JSON Metadata Descriptor

Each icon must be accompanied by a JSON file with tags and categories:

```json
{
  "$schema": "../icon.schema.json",
  "contributors": [
    "github-username",
    "another-github-username"
  ],
  "tags": [
    "foo",
    "bar"
  ],
  "categories": [
    "devices"
  ]
}
```

---

## Quick Checklist

Before submitting an icon, verify:

- [ ] 24×24 canvas with ≥1 px padding
- [ ] 2 px centered stroke, round caps, round joins
- [ ] Shape border radii: 2 px (≥8 px shapes), 1 px (<8 px shapes)
- [ ] 2 px spacing between distinct elements
- [ ] Optical volume matches `circle` / `square`
- [ ] Visually centered by center of gravity
- [ ] Density consistent with the rest of the set
- [ ] Curves join smoothly (mirrored cubic control points)
- [ ] Elements snapped to the pixel grid where possible
- [ ] Consistent with related group/variant icons
- [ ] Name in lower kebab-case, depicts what is drawn, follows ordering rules
- [ ] SVG uses only allowed elements with no transforms/fills/strokes
- [ ] Global SVG attributes set correctly
- [ ] Paths minified to 3 decimal points
- [ ] JSON metadata file included
