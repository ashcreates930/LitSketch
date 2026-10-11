import { expect, test } from "@playwright/test";
import { TEST_ACCESS_CODE } from "../../playwright.config";
import { expectAccessible } from "./helpers";

async function toStepThree(page: import("@playwright/test").Page) {
  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.getByRole("button", { name: /try a sample story/i }).click();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.getByRole("button", { name: /next: review/i }).click();
  await expect(page.getByRole("heading", { name: "Ready to make your notes" })).toBeVisible();
}

test("a wrong code shows a plain message next to the field and nothing is generated", async ({ page }) => {
  await toStepThree(page);
  const field = page.getByLabel("Teacher access code");
  await expect(field).toBeVisible();

  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.locator("#access-error")).toContainText("Please type the teacher access code");
  await expect(field).toBeFocused();

  await field.fill("not-the-code");
  await page.getByRole("button", { name: /make my doodle notes|try again/i }).click();
  await expect(page.locator("#access-error")).toContainText("didn't match");
  await expect(field).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toHaveCount(0);
  await expectAccessible(page);
});

test("the right code generates notes and is remembered on this device", async ({ page }) => {
  await toStepThree(page);
  await page.getByLabel("Teacher access code").fill(TEST_ACCESS_CODE);
  await page.getByRole("button", { name: /make my doodle notes/i }).click();
  await expect(page.getByRole("heading", { name: "Your notes are ready" })).toBeVisible({ timeout: 60_000 });

  // Start again: the code is already filled in.
  await page.getByRole("button", { name: "Start over" }).click();
  await page.getByRole("button", { name: "Yes, start over" }).click();
  await page.getByRole("button", { name: /try a sample story/i }).click();
  await page.getByRole("button", { name: /next: choose grade/i }).click();
  await page.getByRole("button", { name: /next: review/i }).click();
  await expect(page.getByLabel("Teacher access code")).toHaveValue(TEST_ACCESS_CODE);
});

test("the server refuses a request with no code, even without the page", async ({ request }) => {
  const res = await request.post("/api/generate", {
    data: { title: "x", paragraphs: ["word ".repeat(120)], grade: 7, benchmarkCode: "ELA.7.R.1.1" },
  });
  expect(res.status()).toBe(401);
  expect((await res.json()).field).toBe("accessCode");
});
