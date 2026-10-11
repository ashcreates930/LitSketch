import { expect, test } from "@playwright/test";
import { BENCHMARKS } from "../../lib/standards";
import { pickLayout } from "../../lib/ai/schema";

test("every Vocabulary (V) benchmark defaults to the vocab layout, for any text type", () => {
  const vCodes = BENCHMARKS.filter((b) => /\.V\./.test(b.code));
  expect(vCodes.length).toBe(21);
  for (const b of vCodes) {
    for (const t of ["narrative", "informational", "poetry", "drama"] as const) {
      expect(pickLayout(b.code, t), `${b.code} / ${t}`).toBe("vocab");
    }
  }
});

test("ELA.6.V.1.1 chosen in the app opens on Doodle vocabulary", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /try a sample story/i }).click();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.getByLabel("Grade level", { exact: true }).selectOption("6");
  await page.getByRole("radio", { name: /ELA\.6\.V\.1\.1/ }).check();
  await page.getByRole("button", { name: /next: review/i }).click();
  await expect(page.getByText("ELA.6.V.1.1", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible({ timeout: 60_000 });
  await expect(page.getByRole("button", { name: /^Doodle vocabulary/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".print-root .sheet").first()).toHaveClass(/layout-vocab/);
});
