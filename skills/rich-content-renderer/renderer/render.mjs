#!/usr/bin/env node
/* Rich Content Renderer (Playwright with system Chrome)
 *
 * Renders any local HTML file to PNG at one or more exact pixel sizes
 * using a real browser engine (Chromium) — launched via the user's
 * installed Google Chrome so there is no `npx playwright install`
 * step and no extra browser download.
 *
 * The pipeline:
 *   1. Read the local HTML file.
 *   2. Inline every relative <img src> and CSS url(...) reference as a
 *      data: URL, and strip <style/media-blocking> blockers — so the
 *      page can render fully offline from a file:// URL.
 *   3. Load every font file from --fonts into the page via the
 *      FontFace API (so `font-family: 'Inter'` in CSS resolves
 *      without the user hand-writing @font-face).
 *   4. Set the viewport to width x height (x deviceScaleFactor).
 *   5. page.goto(file://...) with waitUntil 'networkidle'.
 *   6. Await document.fonts.ready.
 *   7. page.screenshot({ clip: {0,0,width,height}, omitBackground:false }).
 *
 * Usage:
 *   node render.mjs --html in.html --out out.png --width 1080 --height 1350 \
 *                   --fonts /path/to/fonts
 *   node render.mjs --html in.html --sizes "1080x1350,1080x1080,1080x1920" \
 *                   --fonts /path/to/fonts --outdir ./out
 *
 * Optional:
 *   --scale N                 deviceScaleFactor (default 1). Use 2 for retina.
 *   --fonts-map '{"file.ttf":["Family",700]}'
 *                             Override family/weight for a font file. Key is
 *                             basename; value is [family, weight]. Files not
 *                             listed fall back to filename stem as family,
 *                             weight 400.
 *   --executable-path <path>  Override the Chrome binary location.
 */

import { promises as fs, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import mime from "mime-types";

// Playwright-core is loaded lazily so a missing dep gives a clear error.
let chromium;
try {
  ({ chromium } = await import("playwright-core"));
} catch (e) {
  process.stderr.write(
    `ERROR: playwright-core is not installed. Run \`npm install\` in the renderer directory.\n` +
      `Underlying error: ${e.message}\n`
  );
  process.exit(2);
}

const FONT_EXTENSIONS = new Set([".ttf", ".otf", ".woff", ".woff2"]);

const DEFAULT_CHROME_PATH =
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/* ---------- arg parsing ---------- */

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const k = argv[i];
    const v = argv[i + 1];
    if (k.startsWith("--")) {
      args[k.slice(2)] = v === undefined || v.startsWith("--") ? true : v;
      if (v !== undefined && !v.startsWith("--")) i++;
    }
  }
  return args;
}

function parseFontsMap(raw) {
  if (!raw || raw === true) return {};
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    throw new Error(`--fonts-map is not valid JSON: ${e.message}`);
  }
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("--fonts-map must be a JSON object");
  }
  const out = {};
  for (const [file, value] of Object.entries(parsed)) {
    if (!Array.isArray(value) || value.length < 2) {
      throw new Error(
        `--fonts-map["${file}"] must be [family, weight] (got ${JSON.stringify(value)})`
      );
    }
    const [family, weight] = value;
    if (typeof family !== "string" || !family) {
      throw new Error(`--fonts-map["${file}"][0] (family) must be a non-empty string`);
    }
    const w = Number(weight);
    if (!Number.isFinite(w) || w < 100 || w > 900) {
      throw new Error(`--fonts-map["${file}"][1] (weight) must be 100-900`);
    }
    out[path.basename(file)] = { family, weight: w };
  }
  return out;
}

/* ---------- font discovery ---------- */

async function discoverFonts(fontDir, fontsMap) {
  const entries = await fs.readdir(fontDir, { withFileTypes: true });
  const fonts = [];
  const seen = new Set();
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (!FONT_EXTENSIONS.has(ext)) continue;
    if (seen.has(entry.name)) continue;
    seen.add(entry.name);
    const filePath = path.join(fontDir, entry.name);
    const override = fontsMap[entry.name];
    const family = override?.family ?? path.basename(entry.name, ext);
    const weight = override?.weight ?? 400;
    let data;
    try {
      data = await fs.readFile(filePath);
    } catch (e) {
      console.warn(`warning: could not read font ${filePath}: ${e.message}`);
      continue;
    }
    fonts.push({
      family,
      weight,
      dataBase64: data.toString("base64"),
      mimeType: mime.lookup(filePath) || "font/ttf",
    });
  }
  if (fonts.length === 0) {
    throw new Error(
      `No font files (.ttf/.otf/.woff/.woff2) found in ${fontDir}.`
    );
  }
  return fonts;
}

/**
 * Build a <style> block that registers every discovered font via the
 * FontFace API at the top of the page. The block is injected before
 * any other <style> in the document, so user CSS resolves the
 * families correctly without hand-writing @font-face.
 *
 * We use FontFace (not raw @font-face) because it lets us put() the
 * font inside document.fonts and console-warn if loading fails.
 */
function buildFontBootstrap(fonts) {
  const entries = fonts
    .map(
      (f) =>
        `        { family: ${JSON.stringify(f.family)}, weight: ${JSON.stringify(
          f.weight
        )}, data: "data:${f.mimeType};base64,${f.dataBase64}" }`
    )
    .join(",\n");
  return `
<style id="__rcr_font_bootstrap__">
  /* injected by render.mjs; safe to ignore */
</style>
<script id="__rcr_font_bootstrap_script__">
  (async function () {
    const fonts = [
${entries}
    ];
    await Promise.all(fonts.map(function (f) {
      try {
        const face = new FontFace(f.family, "url('" + f.data + "')", {
          weight: f.weight,
          style: "normal",
          display: "block"
        });
        return face.load().then(function () {
          document.fonts.add(face);
        }).catch(function (err) {
          console.warn("font load failed:", f.family, f.weight, err && err.message);
        });
      } catch (e) {
        console.warn("font construct failed:", f.family, e && e.message);
      }
    }));
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
  })();
</script>
`;
}

/* ---------- asset inlining ---------- */

/**
 * Pre-process the HTML so every <img src="..."> and every CSS url(...)
 * that points at a local file becomes a data: URL. Chrome loaded
 * via file:// *can* read sibling files, but inlining is more
 * predictable and survives go-betweens that strip relative refs.
 *
 * We keep <title>, HTML comments, @font-face (browser supports them),
 * CSS grid, flex, inline SVG — everything a normal HTML page would
 * have. The browser handles them correctly.
 */
async function inlineAssets(htmlString, htmlFileDir) {
  let out = htmlString;

  // 0. Strip HTML comments so placeholders like <img src="..."> inside
  //     documentation comments don't get treated as real assets.
  //     A real browser does not render comments either.
  out = out.replace(/<!--[\s\S]*?-->/g, "");

  // 1. <img src="..."> — resolve relative to htmlFileDir.
  const imgRe = /<img\b[^>]*\bsrc\s*=\s*"([^"]+)"/gi;
  for (const m of [...out.matchAll(imgRe)]) {
    const original = m[1];
    if (/^(data:|https?:|file:|#)/i.test(original)) continue;
    const abs = path.isAbsolute(original)
      ? original
      : path.resolve(htmlFileDir, original);
    try {
      const data = await fs.readFile(abs);
      const mimeType = mime.lookup(abs) || "image/png";
      const dataUrl = `data:${mimeType};base64,${data.toString("base64")}`;
      out = out.replace(m[0], m[0].replace(original, dataUrl));
    } catch (e) {
      throw new Error(`Failed to inline image ${abs}: ${e.message}`);
    }
  }

  // 2. url(...) in <style> blocks — same treatment.
  const urlRe = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  out = out.replace(styleRe, (whole, css) => {
    return whole.replace(
      css,
      css.replace(urlRe, (m, q, raw) => {
        const cleaned = raw.replace(/^['"]|['"]$/g, "").trim();
        if (/^(data:|https?:|file:|#)/i.test(cleaned)) return m;
        const abs = path.isAbsolute(cleaned)
          ? cleaned
          : path.resolve(htmlFileDir, cleaned);
        try {
          const data = readFileSync(abs);
          const mimeType = mime.lookup(abs) || "application/octet-stream";
          return `url(${q}data:${mimeType};base64,${data.toString("base64")}${q})`;
        } catch (e) {
          console.warn(`warning: could not inline url(${cleaned}): ${e.message}`);
          return m;
        }
      })
    );
  });

  return out;
}

/* ---------- rendering ---------- */

async function renderOne({
  browser,
  htmlPath,
  outPath,
  width,
  height,
  scale,
  fontBootstrap,
}) {
  const raw = await fs.readFile(htmlPath, "utf8");
  const htmlFileDir = path.dirname(path.resolve(htmlPath));
  const inlinedHtml = await inlineAssets(raw, htmlFileDir);

  // Inject the font bootstrap right after <head ...>. If there's no
  // <head>, inject at the very top so fonts are registered before
  // anything else parses.
  let finalHtml;
  const headOpen = inlinedHtml.match(/<head\b[^>]*>/i);
  if (headOpen) {
    finalHtml = inlinedHtml.replace(
      headOpen[0],
      headOpen[0] + fontBootstrap
    );
  } else {
    finalHtml = fontBootstrap + inlinedHtml;
  }

  // Write the prepared page to a temp file so we can load it via
  // file:// (Chrome handles data: URLs too, but file:// is the most
  // boring path and keeps relative refs deterministic).
  const tmpHtml = path.join(
    htmlFileDir,
    `.rcr-render-${process.pid}-${width}x${height}.html`
  );
  await fs.writeFile(tmpHtml, finalHtml, "utf8");

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: scale,
  });
  // Silence any unexpected page error noise but keep fatal ones.
  context.setDefaultTimeout(30000);

  const page = await context.newPage();
  try {
    const errors = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (msg) => {
      if (msg.type() === "warning" || msg.type() === "error") {
        const t = msg.text();
        if (t.includes("__rcr")) return;
        if (t.includes("font")) return;
        process.stderr.write(`[page ${msg.type()}] ${t}\n`);
      }
    });

    await page.goto("file://" + tmpHtml, { waitUntil: "networkidle" });

    // Make sure the FontFace bootstrap finished and the document is
    // using the registered fonts.
    await page.evaluate(async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
    });

    // Force a final layout flush.
    await page.evaluate(() => {
      // read a layout property to force a reflow
      void document.documentElement.getBoundingClientRect();
    });

    if (errors.length) {
      // Don't fail hard on page errors — many marketing templates
      // throw harmlessly. Surface them.
      for (const e of errors) {
        process.stderr.write(`[pageerror] ${e}\n`);
      }
    }

    await page.screenshot({
      path: outPath,
      clip: { x: 0, y: 0, width, height },
      omitBackground: false,
    });

    process.stdout.write(
      `rendered ${width}x${height}@${scale}x -> ${outPath}\n`
    );
  } finally {
    await context.close().catch(() => {});
    await fs.unlink(tmpHtml).catch(() => {});
  }
}

/* ---------- CLI ---------- */

function usageAndExit(code = 2) {
  process.stderr.write(
    [
      "Usage:",
      "  node render.mjs --html <file.html> --fonts <dir> \\",
      "                  [--out <file.png> | --sizes \"WxH,WxH\"] [--outdir <dir>]",
      "                  [--width W --height H] [--scale N]",
      "                  [--fonts-map '{\"file.ttf\":[\"Family\",700]}']",
      "                  [--executable-path <path-to-chrome>]",
      "",
    ].join("\n")
  );
  process.exit(code);
}

async function findExecutablePath(args) {
  if (args["executable-path"] && args["executable-path"] !== true) {
    return args["executable-path"];
  }
  // Reasonable set of fallbacks; the user env on this machine has
  // Chrome at DEFAULT_CHROME_PATH. We never call `npx playwright
  // install`, so this must already exist on disk.
  const candidates = [
    DEFAULT_CHROME_PATH,
    process.env.CHROME_PATH,
    process.env.PW_CHROMIUM_PATH,
  ].filter(Boolean);
  for (const c of candidates) {
    if (await fs.stat(c).catch(() => null)) return c;
  }
  return null;
}

async function main() {
  const args = parseArgs(process.argv);

  if (args.help || args.h) usageAndExit(0);

  if (!args.html) {
    process.stderr.write("ERROR: --html <path-to-html-file> is required\n");
    usageAndExit(2);
  }
  if (!args.fonts) {
    process.stderr.write(
      "ERROR: --fonts <path-to-fonts-dir> is required (the renderer is offline)\n"
    );
    usageAndExit(2);
  }

  const htmlPath = path.resolve(args.html);
  if (!(await fs.stat(htmlPath).catch(() => null))) {
    process.stderr.write(`ERROR: HTML file not found: ${htmlPath}\n`);
    process.exit(2);
  }

  const fontDir = path.resolve(args.fonts);
  if (!(await fs.stat(fontDir).catch(() => null))) {
    process.stderr.write(`ERROR: fonts directory not found: ${fontDir}\n`);
    process.exit(2);
  }

  const scale = args.scale ? Number(args.scale) : 1;
  const outdir = args.outdir ? path.resolve(args.outdir) : path.dirname(htmlPath);

  if (Number.isNaN(scale) || scale <= 0) {
    process.stderr.write("ERROR: --scale must be a positive number\n");
    process.exit(2);
  }

  let sizes = [];
  if (args.sizes) {
    sizes = String(args.sizes)
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean)
      .map((s) => {
        const m = s.match(/^(\d+)\s*[x*×]\s*(\d+)$/);
        if (!m) throw new Error(`Bad size: ${s} (expected e.g. 1080x1350)`);
        return { width: Number(m[1]), height: Number(m[2]) };
      });
  } else if (args.width && args.height) {
    sizes = [{ width: Number(args.width), height: Number(args.height) }];
  } else if (args.out) {
    // Single --out without explicit dims: caller must also pass --width/--height.
    process.stderr.write(
      "ERROR: provide either --sizes WxH,WxH or --out + --width + --height\n"
    );
    usageAndExit(2);
  } else {
    process.stderr.write(
      "ERROR: provide either --sizes WxH,WxH or --out + --width + --height\n"
    );
    usageAndExit(2);
  }

  if (sizes.length === 0) {
    process.stderr.write("ERROR: no sizes resolved\n");
    usageAndExit(2);
  }

  await fs.mkdir(outdir, { recursive: true });

  const fontsMap = parseFontsMap(args["fonts-map"]);
  process.stdout.write(
    `using fonts: ${fontDir}${
      Object.keys(fontsMap).length
        ? ` (with ${Object.keys(fontsMap).length} override(s))`
        : ""
    }\n`
  );
  const fonts = await discoverFonts(fontDir, fontsMap);
  const fontBootstrap = buildFontBootstrap(fonts);

  const executablePath = await findExecutablePath(args);
  if (!executablePath) {
    process.stderr.write(
      `ERROR: Chrome not found. Expected it at ${DEFAULT_CHROME_PATH}.\n` +
        `       Pass --executable-path <path> or set CHROME_PATH.\n`
    );
    process.exit(2);
  }
  process.stdout.write(`using Chrome: ${executablePath}\n`);

  const browser = await chromium.launch({
    executablePath,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
    headless: true,
  });

  try {
    const stem = path.basename(htmlPath, path.extname(htmlPath));
    for (const { width, height } of sizes) {
      const outName =
        args.out && sizes.length === 1
          ? path.basename(args.out)
          : `${stem}-${width}x${height}.png`;
      const outPath =
        args.out && sizes.length === 1
          ? path.resolve(args.out)
          : path.join(outdir, outName);
      await renderOne({
        browser,
        htmlPath,
        outPath,
        width,
        height,
        scale,
        fontBootstrap,
      });
    }
    process.stdout.write("done.\n");
  } finally {
    await browser.close().catch(() => {});
  }
}

main().catch((err) => {
  process.stderr.write(
    `render failed: ${err && err.stack ? err.stack : err}\n`
  );
  process.exit(1);
});