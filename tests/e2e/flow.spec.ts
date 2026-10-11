import { expect, test } from "@playwright/test";
import { expectAccessible, expectNoHorizontalScroll, expectTouchTargets, freshStart, runSampleFlow } from "./helpers";

test.describe("three-step flow", () => {
  test("sample passage to finished notes, accessible at every step", async ({ page }) => {
    await freshStart(page);
    await expectNoHorizontalScroll(page);
    await expectAccessible(page);
    await expectTouchTargets(page);

    await page.getByRole("button", { name: /try a sample story/i }).click();
    await page.getByRole("button", { name: /next: choose grade/i }).click();
    await expectNoHorizontalScroll(page);
    await expectAccessible(page);
    await expectTouchTargets(page);

    await page.getByRole("button", { name: /next: review/i }).click();
    await expectNoHorizontalScroll(page);
    await expectAccessible(page);

    await page.getByRole("button", { name: /make my doodle notes/i }).click();
    await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeFocused({ timeout: 60_000 });
    await expectNoHorizontalScroll(page);
    await expectAccessible(page);
    await expectTouchTargets(page);
  });

  test("errors appear next to the field and focus moves there", async ({ page }) => {
    await freshStart(page);
    await page.getByRole("button", { name: /next: choose grade/i }).click();
    const passage = page.getByLabel("Passage", { exact: true });
    await expect(passage).toBeFocused();
    await expect(passage).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#passage-error")).toContainText("Please paste a passage");
    await expect(page.locator("#agree-error")).toContainText("check this box");

    await passage.fill("Too short to use.");
    await page.getByRole("button", { name: /next: choose grade/i }).click();
    await expect(page.locator("#passage-error")).toContainText("needs at least 80 words");
  });

  test("benchmark search filters the list", async ({ page }) => {
    await freshStart(page);
    await page.getByRole("button", { name: /try a sample story/i }).click();
    await page.getByRole("button", { name: /next: choose grade/i }).click();
    await page.getByLabel("Grade level", { exact: true }).selectOption("9");
    await page.getByLabel(/search by a word/i).fill("argument");
    await expect(page.getByText("Showing 1 of 15 benchmarks for grade 9.")).toBeVisible();
    await page.getByRole("radio", { name: /ELA\.9\.R\.2\.4/ }).check();
    await page.getByRole("button", { name: /next: review/i }).click();
    await expect(page.getByText("ELA.9.R.2.4", { exact: true })).toBeVisible();
  });

  test("work survives a page refresh", async ({ page }) => {
    await runSampleFlow(page);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible();
  });
});

test.describe("finished notes", () => {
  test.beforeEach(async ({ page }) => runSampleFlow(page));

  test("LitSketch picks the story map for a story benchmark, and every printed sheet carries the code", async ({ page }) => {
    await expect(page.getByRole("button", { name: /^Story map/ })).toHaveAttribute("aria-pressed", "true");
    const sheets = page.locator(".print-root .sheet");
    await expect.poll(() => sheets.count()).toBeGreaterThanOrEqual(2);
    const count = await sheets.count();
    for (let i = 0; i < count; i++) {
      await expect(sheets.nth(i).locator(".namebar .std")).toContainText("ELA.7.R.1.1");
      await expect(sheets.nth(i).locator(".foot")).toContainText("LitSketch by AmplifiED");
    }
    await expect(page.getByText(/too much text to print/)).toHaveCount(0);
  });

  test("every layout prints on one page in both thinker modes", async ({ page }) => {
    for (const layout of ["Doodle vocabulary", "Story map", "Guided notes"]) {
      await page.getByRole("button", { name: new RegExp(`^${layout}`) }).click();
      for (const mode of ["Convergent", "Divergent"]) {
        await page.getByRole("tab", { name: new RegExp(mode) }).click();
        await expect(page.locator(".print-root .sheet").first()).toHaveAttribute("aria-label", new RegExp(mode, "i"));
        await expect(page.getByText(/too much text to print/)).toHaveCount(0);
        if (mode === "Divergent") await expect(page.locator(".ls-screen .ask")).toBeVisible();
        else await expect(page.locator(".ls-screen .ask")).toHaveCount(0);
      }
    }
    await expectAccessible(page);
  });

  test("thinker-mode tabs work with the keyboard", async ({ page }) => {
    await page.getByRole("tab", { name: /Convergent/ }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: /Divergent/ })).toBeFocused();
    await expect(page.getByRole("tab", { name: /Divergent/ })).toHaveAttribute("aria-selected", "true");
  });

  test("Show answers and Preview colored, and print stays black and white", async ({ page }) => {
    await page.getByRole("button", { name: "Show answers" }).click();
    await expect(page.getByRole("button", { name: "Show answers" })).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator(".print-root")).toHaveClass(/answers/);
    await page.getByRole("button", { name: "Preview colored" }).click();
    await expect(page.locator(".ls-screen")).toHaveClass(/colored/);
    await expect(page.locator(".print-root")).not.toHaveClass(/colored/);
    await expectAccessible(page);
  });

  test("the numbered passage is the last page by default and can be left off", async ({ page }) => {
    await expect(page.locator(".print-root .layout-passage")).toHaveCount(1);
    await expect(page.locator(".print-root .layout-passage")).toContainText("¶6");
    await page.getByLabel(/numbered paragraphs as the last page/).uncheck();
    await expect(page.locator(".print-root .layout-passage")).toHaveCount(0);
  });

  test("Teacher edit: off by default with no outlines; on, edits show in print, and outlines never print", async ({ page }) => {
    const toggle = page.getByRole("button", { name: "Teacher edit" });
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await expect(page.locator(".ls-screen [contenteditable]")).toHaveCount(0);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    const link = page.getByRole("textbox", { name: "Arrow phrase 1" });
    await link.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("who longs for…");
    await link.blur();
    await expect(page.locator(".print-root .k1")).toHaveText("who longs for…");
    await expect(page.locator(".print-root [contenteditable], .print-root .editable")).toHaveCount(0);
    await expectAccessible(page);

    await page.reload();
    await expect(page.locator(".ls-screen .k1")).toHaveText("who longs for…");
  });

  test("story map runs Setting, Characters, Conflict, Resolution with the reference connectors", async ({ page }) => {
    await expect(page.locator(".ls-screen .orb h2")).toHaveText(["Setting", "Characters", "Conflict", "Resolution"]);
    await expect(page.locator(".ls-screen .link")).toHaveText(["who wants…", "but…", "so then…"]);
    for (const orb of await page.locator(".print-root .orb").all()) {
      await expect(orb.locator(".cue")).toContainText(/¶[1-6]./);
    }
  });

  test("start over asks first", async ({ page }) => {
    await page.getByRole("button", { name: "Start over" }).click();
    await expect(page.getByRole("button", { name: "Yes, start over" })).toBeFocused();
    await page.getByRole("button", { name: "No, keep my notes" }).click();
    await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible();
    await page.getByRole("button", { name: "Start over" }).click();
    await page.getByRole("button", { name: "Yes, start over" }).click();
    await expect(page.getByRole("heading", { name: "Add your reading passage" })).toBeFocused();
  });

  test("dark and high-contrast modes stay accessible", async ({ page }) => {
    for (const theme of ["dark", "contrast"]) {
      await page.getByLabel("Display").selectOption(theme);
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      await expectAccessible(page);
    }
  });
});

test("PDF export downloads a real PDF on desktop", async ({ page, browserName, isMobile }) => {
  test.skip(browserName !== "chromium" || !!isMobile, "download path is checked once on desktop Chromium");
  await runSampleFlow(page);
  const download = page.waitForEvent("download", { timeout: 60_000 });
  await page.getByRole("button", { name: "Save or share PDF" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("the-keeper-s-light-story-map-convergent.pdf");
  const path = await file.path();
  const { readFile } = await import("node:fs/promises");
  const bytes = await readFile(path!);
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator("#pdf-msg")).toContainText("Saved");
});

test("illustration review page: every object and icon, labeled, with Preview colored", async ({ page }) => {
  await page.goto("/illustrations");
  await expect(page.getByRole("heading", { name: "Illustration library" })).toBeVisible();
  await expect(page.locator(".gallery-grid").first().locator(".gallery-card")).toHaveCount(29);
  await expect(page.locator(".gallery-grid-icons .gallery-card")).toHaveCount(19);
  await page.getByRole("button", { name: "Preview colored" }).click();
  await expect(page.locator(".ls-screen")).toHaveClass(/colored/);
  await expectNoHorizontalScroll(page);
  await expectAccessible(page);
});

test.describe("print type size", () => {
  test.beforeEach(async ({ page }) => runSampleFlow(page));

  test("every printed note page keeps all text at 11pt or larger; pages grow instead", async ({ page }) => {
    for (const layout of ["Doodle vocabulary", "Story map", "Guided notes"]) {
      await page.getByRole("button", { name: new RegExp(`^${layout}`) }).click();
      for (const mode of ["Convergent", "Divergent"]) {
        await page.getByRole("tab", { name: new RegExp(mode) }).click();
        await page.waitForTimeout(300);
        const result = await page.locator(".print-root").evaluate((root) => {
          let smallest = Infinity;
          let where = "";
          root.querySelectorAll(".sheet *").forEach((el) => {
            const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
            if (!hasText || !(el as HTMLElement).getClientRects().length) return;
            const px = parseFloat(getComputedStyle(el).fontSize);
            if (px < smallest) {
              smallest = px;
              where = `${el.className || el.tagName}: ${el.textContent!.trim().slice(0, 30)}`;
            }
          });
          const shrunk = [...root.querySelectorAll<HTMLElement>(".sheet")].some((s) => s.style.fontSize);
          const fits = [...root.querySelectorAll<HTMLElement>(".sheet")].every((s) => s.scrollHeight <= s.clientHeight + 1);
          return { pt: smallest * 0.75, where, shrunk, fits };
        });
        expect(result.pt, `${layout} ${mode}: smallest text is ${result.where}`).toBeGreaterThanOrEqual(10.99);
        expect(result.shrunk).toBe(false);
        expect(result.fits, `${layout} ${mode}: every printed sheet fits`).toBe(true);
      }
    }
  });

  test("convergent vocab keeps two words on page 1 and moves the third to page 2", async ({ page }) => {
    await page.getByRole("button", { name: /^Doodle vocabulary/ }).click();
    const notes = page.locator(".print-root .layout-vocab");
    await expect(notes).toHaveCount(2);
    await expect(notes.nth(0).locator(".vrow")).toHaveCount(2);
    await expect(notes.nth(1).locator(".vrow")).toHaveCount(1);
    await expect(notes.nth(1).locator(".contd")).toContainText("continued");
    await expect(notes.nth(1).locator(".foot")).toContainText("page 2 of 2");
  });
});
