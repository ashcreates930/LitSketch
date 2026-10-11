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

  test("every printed page carries the benchmark code and fits one sheet", async ({ page }) => {
    const pages = page.locator(".print-root .ls-page");
    await expect.poll(() => pages.count()).toBeGreaterThanOrEqual(6);
    const count = await pages.count();
    for (let i = 0; i < count; i++) {
      await expect(pages.nth(i).locator(".ls-code")).toContainText("ELA.7.R.1.1");
      await expect(pages.nth(i).locator(".ls-foot")).toContainText("ELA.7.R.1.1");
    }
    await expect(page.getByText(/too much text to fit/)).toHaveCount(0);
  });

  test("both thinker modes and an answer key, switchable by tab and keyboard", async ({ page }) => {
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(page.locator(".ls-screen .ls-tag-mode").first()).toHaveText("Convergent");
    await page.getByRole("tab", { name: /divergent/i }).click();
    await expect(page.locator(".ls-screen .ls-tag-mode").first()).toHaveText("Divergent");
    await page.getByRole("tab", { name: /divergent/i }).press("ArrowRight");
    await expect(page.getByRole("tab", { name: /answer key/i })).toBeFocused();
    await expect(page.locator(".ls-screen .ls-tag-mode").first()).toHaveText("Teacher key");
    await expectAccessible(page);
  });

  test("teacher edits show up in the print copy", async ({ page }) => {
    const bigQ = page.getByRole("textbox", { name: "Big question" });
    await bigQ.click();
    await page.keyboard.press("ControlOrMeta+A");
    await page.keyboard.type("Why does Mara keep the lamp lit?");
    await bigQ.blur();
    await expect(page.locator(".print-root [data-doc-wrap=convergent] .ls-bigq-text")).toHaveText(
      "Why does Mara keep the lamp lit?",
    );
    await page.reload();
    await expect(page.getByRole("textbox", { name: "Big question" })).toHaveText("Why does Mara keep the lamp lit?");
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
  expect(file.suggestedFilename()).toBe("the-keeper-s-light-convergent-notes.pdf");
  const path = await file.path();
  const { readFile } = await import("node:fs/promises");
  const bytes = await readFile(path!);
  expect(bytes.subarray(0, 5).toString()).toBe("%PDF-");
  await expect(page.locator("#pdf-msg")).toContainText("Saved");
});
