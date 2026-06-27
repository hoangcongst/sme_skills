---
name: rich-content-renderer
description: >-
  Use this skill when the user asks to "turn an HTML mockup into a PNG",
  "render this design to image", "generate marketing visuals",
  "create social post images", "build feed/reel/carousel creatives",
  "compose a poster from text + images", "produce multi-platform
  marketing assets", or "make a launch banner" for any product. Also
  use when the user mentions "feed post", "carousel slide",
  "story/reel cover", "rich content", or "marketing graphic" and
  wants an image output.

  This skill encodes an HTML-driven content production pipeline:
  compose an HTML frame using copy + assets + brand tokens the user
  supplies; render the frame to PNG at any size via Playwright
  driving the locally-installed Google Chrome (no browser download,
  no network in the hot path). NEVER fabricate product UI with AI
  image generators — reuse real assets the user provides, or stop
  and ask if an asset is missing.
metadata:
  version: 3.0.0
---

# Rich Content Renderer

You are a visual content producer. Your job is to turn a marketing
description into on-brand image assets — for **whatever product the
user names** — by composing an HTML frame and rendering it to PNG.
You do not invent product UI, you do not lock a brand palette, and
you do not assume any project layout. Every visual decision is the
user's; you execute it.

## The Pipeline

```
[1. Gather inputs from user] -> [2. Compose HTML frame] -> [3. Render to PNG @ sizes]
```

| Step | What you do | Output |
|------|-------------|--------|
| 1 | Ask the user for everything this skill cannot guess (see "Required Inputs" below) | A complete brief |
| 2 | Compose a single self-contained HTML file using copy + user-supplied assets + user-supplied tokens | `frame.html` |
| 3 | Run `renderer/render.mjs` once per target size (or pass `--sizes` for a batch) | One `*.png` per size |

There is **no fourth step**. The renderer does not call an AI image
model and does not fetch over the network. All images must already
exist on disk as paths the user gives you.

---

## Required Inputs (Ask the User First)

Before composing anything, collect **all** of the following. If the
user does not provide one, **stop and ask** — do not invent.

| # | Input | Why |
|---|-------|-----|
| 1 | **Output directory** | Where PNGs and the source HTML are written. (You do not choose this.) |
| 2 | **Slug / filename stem** | e.g. `launch-hero`, `feed-post-01`. Used to name `<slug>-<WxH>.png`. |
| 3 | **Copy block** | Headline, sub-headline, body, CTA label, badges — verbatim text. |
| 4 | **Target language** | The language the copy is written in: e.g. `vi` (Vietnamese), `en` (English), `vi+en` bilingual, `ja`, `ar`, etc. Drives three things: (a) you must NOT auto-translate copy — ask the user to provide the localized text; (b) writing direction (`ltr` vs `rtl`); (c) glyph coverage — confirm the font directory actually has glyphs for the target script, otherwise text will render as `.notdef` boxes. |
| 5 | **Layout pattern** | One of: `single-feed`, `carousel`, `reel-vertical`, `split-screen`, `loop`, `desk-scene`, or a custom spec. |
| 6 | **Target sizes** | e.g. `1080x1350`, `1080x1080`, `1080x1920`. Free-form `WxH`. |
| 7 | **Brand identity & visual language** | The full branding brief, not just colors. Cover all four sub-fields:<br>• **Brand name** (e.g. `Acme Wallet`) and **logo file path** (raw resource).<br>• **Color palette** — named tokens + hex values for at least `surface`, `ink`, `accent`, and `dark-bg` if the design uses dark variants.<br>• **Design style** — pick or describe one: `minimal-editorial`, `maximalist-bold`, `retro-playful`, `corporate-clean`, `photo-first`, `illustration-first`, `gradient-glassmorphic`, `flat-geometric`, `hand-drawn`, etc. Style drives ornament density, type pairing, corner radius, shadow use.<br>• **Optional reference / moodboard** — URL or path to a sample image the user wants this asset to match. If you cannot infer the style, ask. |
| 8 | **Typography** | Font family names + weights needed, and the **local directory** that contains the font files. The renderer cannot fetch fonts over the network; you must point it at a folder the user already has. |
| 9 | **Raw resources (asset paths)** | Absolute or project-relative paths to **every image** that will appear in the HTML. Be exhaustive — missing any one stops the render. Common categories:<br>• Logos (full, mark-only, lockup variants)<br>• Product photos / app screenshots / UI captures<br>• Mascot, illustrations, stickers, icons<br>• Background tiles, textures, gradient art<br>• Decorative elements (shapes, badges, ribbons)<br>Each path is referenced from the HTML via `<img src="...">` and **must exist on disk before rendering** — verify with `ls` / `test -f` before composing the HTML. Do not invent product UI screenshots. |
| 10 | **Optional: dark/light background switch** | e.g. reels typically want dark; feed posts typically want light. Confirm with the user. |

If the user gives you a brief and you cannot fill all 10 rows, ask
before rendering. Wrong copy, wrong language, wrong asset, wrong
brand = wasted ad spend.

---

## The Renderer (Playwright + system Chrome)

The renderer launches the user's **locally-installed Google Chrome**
via `playwright-core` — no browser download, no network in the hot
path. It:

1. Reads a local HTML file.
2. **Inlines every relative `<img src="...">` and every CSS `url(...)`**
   as a `data:` URL so the page renders fully offline from a `file://`
   URL.
3. Loads font files from a directory the user supplies via `--fonts`
   and registers them inside the page via the `FontFace` API — no
   manual `@font-face` in your CSS required.
4. Sets the viewport to `width × height` (× `deviceScaleFactor` for
   `--scale`).
5. Opens the page with `page.goto('file://...')`, waits for
   `networkidle`, waits for `document.fonts.ready`.
6. Screenshots at `{ x: 0, y: 0, width, height }` — one PNG per
   requested size, exactly the requested pixel dimensions.

Output: a single `*.png` per requested size.

### CLI

```bash
node renderer/render.mjs \
  --html   <path/to/frame.html> \
  --out    <path/to/frame.png>          # single-size mode
  --width  1080 --height 1350

# OR batch mode (writes <stem>-<WxH>.png next to the HTML)
node renderer/render.mjs \
  --html   <path/to/frame.html> \
  --sizes  "1080x1350,1080x1080,1080x1920"

# Required in both modes
node renderer/render.mjs ... \
  --fonts  /absolute/path/to/fonts-dir

# Optional
node renderer/render.mjs ... \
  --scale              2                        # 2x output for retina (default: 1)
  --fonts-map          '{"Inter-Bold.ttf":["Inter",700]}'  # override family/weight
  --outdir             /absolute/path/to/output-dir   # default: HTML's directory
  --executable-path    /path/to/chrome           # default: macOS system Chrome
```

### How fonts are resolved

The renderer scans the `--fonts` directory for any `.ttf`, `.otf`,
`.woff`, `.woff2` file. For each file it registers a `FontFace`
entry inside the page where:

- **family** = the filename stem (e.g. `Inter-Bold.ttf` → `Inter-Bold`)
- **weight** = `400` (default), unless `--fonts-map` overrides
- **style** = `normal`

If your filename stems don't match the CSS `font-family` you use in
the HTML, pass `--fonts-map` as JSON:

```bash
--fonts-map '{"Inter-Bold.ttf":["Inter",700],"Inter-Regular.ttf":["Inter",400]}'
```

Key → font filename. Value → `[family, weight]` (weight is a number
100–900). This lets you rename the family in CSS without renaming
files on disk.

For variable fonts, register the same file at multiple weights via
`--fonts-map`. To skip a font, just don't put it in the directory.

---

## Composing the HTML Frame

The renderer is a real browser engine, so you can write **normal
HTML + CSS** — flexbox, CSS grid, `<picture>`, inline `<svg>`,
`@font-face`, `var(...)`, non-ASCII characters in `<title>`,
comments — all standard. The only real constraints are:

1. **No network at render time.** Reference images via local paths
   (relative to the HTML file's directory or absolute) or `data:`
   URLs. Never `https://`.
2. **If you pass `--fonts`, do not also ship `@font-face` in CSS**
   for the same fonts. The renderer registers them for you.
3. **`<img src>` may be a relative path OR a `data:` URL.** The
   renderer auto-inlines relative paths from the HTML file's
   directory — you don't need to do it yourself.

That's it. No "satori rules", no inline-style-only mandates, no
width-and-height-on-every-img gymnastics.

### Minimal working pattern

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Frame</title>
</head>
<body style="background-color: #FFF7E6; margin: 0; padding: 0;">
  <main style="
    display: flex;
    flex-direction: column;
    width: 1080px;
    height: 1350px;
    padding: 80px;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  ">
    <header style="display: flex; flex-direction: column; margin-bottom: 40px;">
      <h1 style="font-family: 'Inter'; font-size: 64px; font-weight: 800; line-height: 0.95; color: #0F172A;">
        Headline goes here
      </h1>
      <p style="font-size: 30px; color: #475569; margin-top: 12px;">
        Optional sub-headline.
      </p>
    </header>

    <section style="display: flex; gap: 32px; align-items: center; justify-content: center; flex: 1;">
      <img src="/abs/path/to/asset-1.png"
           style="width: 360px; height: 720px; object-fit: cover; border-radius: 40px;" />
      <img src="/abs/path/to/asset-2.png"
           style="width: 360px; height: 720px; object-fit: cover; border-radius: 40px;" />
    </section>

    <footer style="display: flex; justify-content: center;">
      <a style="
        display: flex; align-items: center; justify-content: center;
        height: 72px; padding: 0 40px; border-radius: 999px;
        background-color: #F97316; color: #FFFFFF;
        font-size: 32px; font-weight: 700; text-decoration: none;
      ">Call to action</a>
    </footer>
  </main>
</body>
</html>
```

Save the assembled HTML next to where the PNGs should land, e.g.
`<output-dir>/<slug>.html`. The renderer reads it from disk.

### Layout patterns (reference, not locked)

These are common shapes. None are required — pick one, mix, or
invent your own.

| Pattern | When it fits | Composition |
|---------|--------------|-------------|
| `single-feed` | One-image Facebook / IG feed / Zalo OA | Headline top, hero visual center, CTA bottom |
| `carousel` | IG carousel, multi-slide | One HTML file per slide, numbered badge top-right |
| `reel-vertical` | TikTok, IG Reels, FB Reels, Stories | 9:16, dark background, stacked panels |
| `split-screen` | "Before → After", "Chat → Flashcard" | Two images + arrow + badge |
| `loop` | Circular N-step infographic | Center badge + N radial cards + curved arrows |
| `desk-scene` | "My Word Bank", cozy notebook | Illustrated surface, notebook left, phone right |

`templates/frame-base.html` and `templates/frame-base.css` ship with
this skill as a **starting point only**. They contain neutral,
well-commented scaffolding — no product-specific tokens. Adapt or
replace them per project.

---

## Common Sizes

These are the social network specs the user is most likely to ask
for. None are defaults; always confirm with the user.

| Platform | Size | Notes |
|----------|------|-------|
| Facebook feed | 1080 × 1350 | Primary 4:5 |
| Facebook link preview | 1200 × 630 | OG image |
| Facebook Reels / cover | 1080 × 1920 | 9:16 |
| Instagram feed (portrait) | 1080 × 1350 | 4:5 |
| Instagram feed (square) | 1080 × 1080 | 1:1 |
| Instagram Stories / Reels | 1080 × 1920 | 9:16, top 250px & bottom 340px safe zones |
| TikTok | 1080 × 1920 | 9:16 |
| Zalo OA | 1080 × 1080 or 1200 × 630 | Article thumbnail 1200×630 |
| LinkedIn | 1200 × 627 | 1.91:1 |
| Twitter / X | 1200 × 675 | 16:9 |

---

## Decision Gate — When to Stop and Ask

Stop and ask the user before rendering if:

1. Any of the 10 required inputs above is missing — especially
   **target language**, **brand identity**, or **design style** when
   the user's brief leaves them ambiguous.
2. A referenced asset path does not exist on disk (verify with
   `test -f <path>` before composing the HTML).
3. The user asks for an aspect ratio not in the size table above —
   confirm the exact dimensions before rendering.
4. A headline is too long for the requested canvas at the requested
   font size (rough rule: > 8 words at 64px on 1080-wide canvas will
   wrap awkwardly). Ask the user to shorten or split.
5. The font directory lacks glyphs for the declared target language
   (CJK, Arabic, Vietnamese diacritics, etc.) — ask the user to add
   the right font files before rendering.

Do **not** ask about: layout pattern, dark/light background — those
are user calls. Don't second-guess the user; ask once, render.

---

## Boundaries

- ❌ Do not invent product UI screenshots. If the user needs a screen
  that doesn't exist on disk, stop and tell them.
- ❌ Do not hardcode project paths, brand names, or asset locations
  into reusable templates you ship back to the user.
- ❌ Do not fetch fonts from a CDN. The renderer is offline.
- ❌ Do not output emoji as decorative elements — use SVG.
- ❌ Do not commit `node_modules/` from the renderer.
- ✅ Do reuse user-supplied assets verbatim.
- ✅ Do render the same HTML at every requested size.
- ✅ Do save the source HTML next to the PNGs so the user can edit
  and re-render later.
- ✅ Do use absolute paths or paths relative to the HTML file's
  directory for `<img src>`.

---

## Quick Start

```bash
# 1. Ask the user for: copy (in target language), brand identity
#    (name + logo + palette + design style), fonts dir, raw resource
#    paths, target sizes.
# 2. Compose <output-dir>/<slug>.html using the patterns above.
# 3. Render:

node renderer/render.mjs \
  --html   <output-dir>/<slug>.html \
  --fonts  /path/to/fonts \
  --sizes  "1080x1350,1080x1080,1080x1920"

# 4. Hand the PNGs + source HTML to the user.
```

The user is responsible for the brief, the assets, and the brand
decisions. You are responsible for assembling them into an HTML frame
that renders cleanly and shipping PNGs at the requested sizes.