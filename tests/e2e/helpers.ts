import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export async function freshStart(page: Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await expect(page.getByRole("heading", { name: "Add your reading passage" })).toBeVisible();
}

export async function runSampleFlow(page: Page) {
  await freshStart(page);
  await page.getByRole("button", { name: /try a sample story/i }).click();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await expect(page.getByRole("heading", { name: "Choose grade and benchmark" })).toBeFocused();
  await page.getByRole("button", { name: /next: review/i }).click();
  await expect(page.getByRole("heading", { name: "Ready to make your notes" })).toBeFocused();
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible({ timeout: 60_000 });
}

export async function expectNoHorizontalScroll(page: Page) {
  const { scroll, client } = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(scroll, "page should not scroll sideways").toBeLessThanOrEqual(client);
}

export async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .exclude(".print-root")
    .exclude(".measure-root")
    .analyze();
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length}) ${v.nodes[0]?.target}`);
  expect(summary, "axe violations").toEqual([]);
}

/** Visible buttons, links, and form controls must be at least 44x44 CSS px. */
export async function expectTouchTargets(page: Page) {
  const small = await page.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main button, main a:not(.skip-link), main select, main input:not([type=checkbox]):not([type=radio]):not([type=file]), header button, header select, header a, .choice, .check, .upload",
      ),
    );
    return els
      .filter((el) => el.offsetParent !== null && !el.closest(".print-root, .measure-root, .ls-page"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return { what: (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 40), w: r.width, h: r.height };
      })
      .filter((r) => r.w < 43.5 || r.h < 43.5);
  });
  expect(small, "touch targets under 44px").toEqual([]);
}
