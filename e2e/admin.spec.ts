import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, email: string) {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/portal/);
}

test.describe("system admin console", () => {
  test("overview shows health and metrics", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: /System console/ }),
    ).toBeVisible();
    await expect(page.getByText("Database", { exact: true })).toBeVisible();
    await expect(page.getByText("Users", { exact: true })).toBeVisible();
    await expect(page.getByText("AI generations")).toBeVisible();
    await expect(page.getByText("Drawing storage")).toBeVisible();
  });

  test("events viewer lists telemetry", async ({ page, request }) => {
    // Guarantee at least one event: a public contact-form submission.
    const res = await request.post("/contact", {
      form: {
        name: "Telemetry Probe",
        email: "probe@example.com",
        message: "Checking the events pipeline works end to end.",
      },
    });
    expect(res.ok()).toBeTruthy();

    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/admin/events?name=enquiry.submitted");
    await expect(page.getByText("enquiry.submitted").first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test("logs viewer shows the request ring buffer", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/admin/logs");
    await expect(page.getByText(/ring buffer/)).toBeVisible();
    await expect(page.getByText("GET").first()).toBeVisible();
  });

  test("jobs page reports pg-boss queues", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/admin/jobs");
    await expect(page.getByText(/pg-boss running/)).toBeVisible();
    await expect(page.getByText("supabase-keepalive").first()).toBeVisible();
    await expect(page.getByText("cleanup-old-events").first()).toBeVisible();
  });

  test("settings edit round-trips a runtime constant", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/admin/settings");
    const row = page.locator("form", { hasText: "ai.trial_generations" });
    const input = row.locator('input[name="value"]');
    await expect(input).toHaveValue("2");
    await input.fill("3");
    await row.getByRole("button", { name: "Save" }).click();
    await expect(row.getByText("Saved ✓")).toBeVisible({ timeout: 10_000 });
    await page.reload();
    await expect(
      page
        .locator("form", { hasText: "ai.trial_generations" })
        .locator('input[name="value"]'),
    ).toHaveValue("3");
    // Restore the original value.
    const restore = page.locator("form", { hasText: "ai.trial_generations" });
    await restore.locator('input[name="value"]').fill("2");
    await restore.getByRole("button", { name: "Save" }).click();
    await expect(restore.getByText("Saved ✓")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("non-admin staff cannot reach the console", async ({ page }) => {
    await signIn(page, "priya.srivastava@example.com");
    const res = await page.goto("/admin");
    expect(res?.status()).toBe(404);
    const res2 = await page.goto("/admin/settings");
    expect(res2?.status()).toBe(404);
  });
});
