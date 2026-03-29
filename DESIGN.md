# Design Guidelines — cyber-dashboard

## 1. Visual Style

Cyber-dashboard is a homelab monitoring dashboard with a **glassy, data-dense** aesthetic. The design language is:

- **Card-based** — all content lives inside frosted-glass panels with translucent backgrounds and subtle borders
- **Light/dark adaptive** — every color uses `light-dark()` and the OKLCH color space; the theme switches automatically via a `data-theme` attribute on `<html>`
- **Minimal chrome** — muted labels, understated borders, generous negative space; color is used sparingly and carries semantic meaning
- **Status-driven glows** — radial gradient overlays on cards shift color to reflect live status (success, warning, error)

The body background is a subtle dot-grid over a diagonal luminance gradient. Everything is styled with **Vanilla Extract** (`.css.ts` files); never add Tailwind classes.

---

## 2. Color Usage

Colors come from `vars.color.*` tokens. Don't hardcode values. The key semantic buckets and when to use each:

| Token                        | Use for                                                              |
| ---------------------------- | -------------------------------------------------------------------- |
| `vars.color.background`      | Page/root background                                                 |
| `vars.color.backgroundAlt`   | Inset surfaces, stat cells, input fills                              |
| `vars.color.panel`           | Card surfaces (semi-transparent, pairs with `backdrop-filter: blur`) |
| `vars.color.foreground`      | Primary text, large values, headings                                 |
| `vars.color.foregroundAlt`   | Secondary text, selected state text                                  |
| `vars.color.foregroundMuted` | Labels, metadata, captions, empty states, icons at rest              |
| `vars.color.border`          | Standard interactive borders (focus rings, inputs, avatar outlines)  |
| `vars.color.borderSubtle`    | Dividers, card outlines, separator lines                             |
| `vars.color.primary`         | Links on hover, focus outline color, active accent                   |
| `vars.color.success`         | Healthy/available status — dots, glows, tinted card backgrounds      |
| `vars.color.warning`         | Degraded/warning status                                              |
| `vars.color.error`           | Failure/unavailable status                                           |

For tinted card backgrounds (e.g. a success-state card), use a very low-opacity mix of the semantic color — don't apply it at full saturation. Status dots and glows use `box-shadow` with the same color at ~35–60% opacity.

AQI-specific colors live in `vars.color.aqi.*` (good → extremelyPoor) and are only used for air quality contexts.

---

## 3. Typography

Font: **Inter Variable** (`vars.font.sans`). Always reference the token, never hardcode.

### Text size guide

| Scale token      | Size | Use for                                            |
| ---------------- | ---- | -------------------------------------------------- |
| `vars.text.xxs`  | 10px | Eyebrow labels, stat category labels, timestamps   |
| `vars.text.xs`   | 12px | Metadata, badge text, tooltips, secondary row info |
| `vars.text.sm`   | 14px | Body text, list rows, descriptions                 |
| `vars.text.base` | 16px | Default, stat fractions in mixed-size displays     |
| `vars.text.xl`   | 20px | Widget section headings, summary stat values       |
| `vars.text.2xl`  | 24px | Secondary hero values, status labels               |
| `vars.text.4xl`  | 36px | Gauge-style live values (CPU %, memory %)          |
| `vars.text.5xl`  | 48px | Primary hero values (temperature, AQI score)       |

### Typography conventions

- **Uppercase + letter-spacing** (`textTransform: 'uppercase'`, `letterSpacing: '0.08–0.12em'`) on all category labels, eyebrows, and group headings
- **`fontVariantNumeric: 'tabular-nums'`** on every numeric display to prevent layout shift with streaming data
- **Weight 700–800** for hero/gauge numbers; **600** for section labels; **500** for list items; **400** for descriptions and secondary text

---

## 4. Layout & Spacing

- **Dashboard grid**: 6 columns (mobile) → 12 columns (≥1024px), `gap: vars.spacing[4]` (16px), `align-items: start`. Widgets span columns via `gridColumn: span N`.
- **Page padding**: `vars.spacing[6]` (24px) on all sides
- **Card internal padding**: `vars.spacing[4]` (16px) for standard content, `vars.spacing[5]` (20px) for roomier widgets
- **Inset cells** (stat grids, summary rows): `vars.spacing[2]–[3]` padding, `vars.spacing[1]–[2]` gap
- Don't use arbitrary pixel values — always pick the nearest spacing token

---

## 5. Cards & Surfaces

Cards are the primary container for every widget and UI panel:

- `border-radius: vars.radius.xl` (12px)
- `border: 1px solid vars.color.borderSubtle`
- `background: vars.color.panel` (semi-transparent)
- `backdrop-filter: blur(10px)`
- Transition `border-color`, `box-shadow`, `transform`, and `background-color` at `0.2s ease`

**Interactive cards** (clickable links): lift `translateY(-2px)` and apply `vars.shadow.panel` on hover, border becomes `vars.color.border`.

**Tone variants**: `success`, `warning`, `danger` cards use a tinted background and matching border at very low opacity. The card content color shifts to match (e.g. red text on danger).

**Status glows**: use `radial-gradient(ellipse at corner, color @ 15–20% opacity, transparent 70%)` as an absolute overlay — not a solid fill — to softly color the card environment based on live state.

---

## 6. Icons

Icon library: **Lucide React**. Use consistent sizing:

- **16px** — card header icons inside icon badges
- **14–16px** — inline action/control icons (buttons, toggles)
- **18px** — list row icons, command palette items
- **20px** — search input icons
- **24px+** — standalone status/alert icons

Icon badges (small icon + label in a card header) are 30×30px containers with `radius.md`, a subtle border, and a faintly transparent background.

---

## 7. Animations & Transitions

Keep motion subtle and fast. Standard pattern is `0.2s ease` on color/border/background. Use `0.15s ease` for background changes on list rows.

For dialog overlays: fade in with `opacity 0.3s ease`. For dialog popups: add a short directional translate (5–8px) at `0.2s ease`.

**Status transitions** should be slightly slower (`0.3–0.4s ease`) because they represent real state changes the user should notice.

**Pulsing skeletons/pending states**: use a keyframe animation cycling `opacity 0.4 → 1 → 0.4` over `1.5s ease-in-out infinite`.

Wrap tooltip/decorative animations in `@media (prefers-reduced-motion: no-preference)`.

---

## 8. Design Tokens Quick Reference

All tokens are in `src/theme.css.ts` and imported via `vars` from `#theme.css`. Never hardcode values.

- **Colors**: `vars.color.*` — see Section 2
- **Text sizes**: `vars.text.*` — see Section 3
- **Spacing**: `vars.spacing[N]` where N corresponds to `N × 4px` (e.g. `vars.spacing[4]` = 16px)
- **Border radius**: `vars.radius.{sm|md|lg|xl|2xl|full}` → 2 / 6 / 8 / 12 / 16 / 9999px
- **Shadows**: `vars.shadow.panel` (deep drop shadow for floating surfaces), `vars.shadow.glowBlue/Emerald/Red` (colored glow effects)
- **Fonts**: `vars.font.sans`
- **Breakpoints**: `media.{sm|md|lg|xl}` → 640 / 768 / 1024 / 1280px (import `media` from `#theme.css`)
