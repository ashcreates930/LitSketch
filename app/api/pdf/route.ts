import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { clientKey, rateLimited, sameOrigin } from "@/lib/rate-limit";

export const maxDuration = 60;

const Body = z.object({
  html: z.string().min(1).max(1_500_000),
  title: z.string().max(200),
  lang: z.enum(["en", "es"]).default("en"),
});

function fail(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

/** Belt and braces: JavaScript is also disabled and network requests are blocked in the browser. */
function sanitize(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<(iframe|object|embed|link|meta|base)[^>]*>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src|xlink:href)\s*=\s*("|')\s*(javascript|https?|file):[^"']*\2/gi, "");
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

let cssCache: string | null = null;
async function pageCss(): Promise<string> {
  if (cssCache) return cssCache;
  const root = process.cwd();
  const fontDir = path.join(root, "node_modules/@fontsource/atkinson-hyperlegible/files");
  const [regular, bold, doodle] = await Promise.all([
    readFile(path.join(fontDir, "atkinson-hyperlegible-latin-400-normal.woff2")),
    readFile(path.join(fontDir, "atkinson-hyperlegible-latin-700-normal.woff2")),
    readFile(path.join(root, "styles/doodle.css"), "utf8"),
  ]);
  cssCache = `
@font-face { font-family: "Atkinson Hyperlegible"; font-weight: 400; src: url(data:font/woff2;base64,${regular.toString("base64")}) format("woff2"); }
@font-face { font-family: "Atkinson Hyperlegible"; font-weight: 700; src: url(data:font/woff2;base64,${bold.toString("base64")}) format("woff2"); }
html, body { margin: 0; padding: 0; background: #fff; }
${doodle}`;
  return cssCache;
}

async function launchBrowser() {
  const puppeteer = (await import("puppeteer-core")).default;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
      executablePath: await chromium.executablePath(),
      headless: "shell",
    });
  }
  // Local development: use an installed Chrome or Edge.
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean) as string[];
  const { access } = await import("node:fs/promises");
  for (const p of candidates) {
    try {
      await access(p);
      return puppeteer.launch({ executablePath: p, headless: true });
    } catch {}
  }
  throw new Error("No Chrome or Edge found for PDF export. Set CHROME_PATH.");
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return fail("This request came from outside LitSketch.", 403);
  if (rateLimited(`pdf:${clientKey(req)}`, 60, 60 * 60 * 1000)) {
    return fail("Too many PDFs this hour. Please wait a few minutes, or use Print instead.", 429);
  }

  let body: z.infer<typeof Body>;
  try {
    body = Body.parse(await req.json());
  } catch {
    return fail("Something went wrong making the PDF. Please try again, or use Print instead.");
  }

  const doc = `<!doctype html><html lang="${body.lang}"><head><meta charset="utf-8"><title>${escapeHtml(body.title)}</title>
<style>${await pageCss()}</style></head><body><main class="ls-print ls-pdf">${sanitize(body.html)}</main></body></html>`;

  let browser: Awaited<ReturnType<typeof launchBrowser>> | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setJavaScriptEnabled(false);
    await page.setRequestInterception(true);
    page.on("request", (r) => (r.url().startsWith("data:") || r.url() === "about:blank" ? r.continue() : r.abort()));
    await page.setContent(doc, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready").catch(() => {});
    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
    });
    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="litsketch.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("pdf failed", err);
    return fail("LitSketch couldn't make the PDF right now. Use the Print button instead, then choose Save as PDF.", 502);
  } finally {
    await browser?.close().catch(() => {});
  }
}
