import { expect, test, type Page } from "@playwright/test";

/**
 * Portal flows against the seeded local Supabase stack, using the dev-only
 * password login (seed users all use password123).
 */

async function signIn(page: Page, email: string) {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/portal/);
}

test.describe("client portal", () => {
  test("client sees only their own projects", async ({ page }) => {
    await signIn(page, "neha.khanna@example.com");
    await expect(page.getByText("Namaste, Neha")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Khanna Apartment Interiors/ }),
    ).toBeVisible();
    // Another client's project must not leak through RLS.
    await expect(
      page.getByRole("link", { name: /Agarwal Residence/ }),
    ).toHaveCount(0);
  });

  test("staff sees all projects and enquiries panel", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await expect(
      page.getByRole("link", { name: /Agarwal Residence/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Jaiswal Haveli Restoration/ }),
    ).toBeVisible();
    await expect(page.getByText("Recent enquiries")).toBeVisible();
  });

  test("project page shows milestones, drawings and team", async ({
    page,
  }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.getByRole("link", { name: /Agarwal Residence/ }).click();
    await expect(page.getByText("First-floor slab cast")).toBeVisible();
    await expect(page.getByText("AGR-BNG_floor-plans.dwg")).toHaveCount(0); // notes shown instead
    await expect(page.getByText("VDA sanction set", { exact: false })).toBeVisible();
    await expect(page.getByText("Er. Alok Verma")).toBeVisible();
  });

  test("messaging: send appears in thread", async ({ page }) => {
    await signIn(page, "ramesh.agarwal@example.com");
    await page.getByRole("link", { name: /Agarwal Residence/ }).click();
    await page.getByRole("link", { name: /project chat/i }).click();
    await expect(
      page.getByText(/slab casting this Friday/),
    ).toBeVisible();
    const msg = `Checking portal message ${Date.now()}`;
    await page.locator('textarea[name="body"]').fill(msg);
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByText(msg)).toBeVisible({ timeout: 10_000 });
  });

  test("accountant records a cash payment", async ({ page }) => {
    await signIn(page, "manoj.gupta@example.com");
    await page.goto("/portal/payments");
    await expect(page.getByText("Payments ledger")).toBeVisible();
    await page.locator('select[name="user_id"]').selectOption({
      label: "Ramesh Agarwal",
    });
    await page.locator('input[name="amount_inr"]').fill("25000");
    const receipt = `RCPT-E2E-${Date.now()}`;
    const notes = page.locator('input[name="notes"]');
    await notes.fill(receipt);
    // Submit via Enter: mobile emulation offsets the visual viewport while
    // an input is focused, which breaks coordinate-based clicks.
    await notes.press("Enter");
    await expect(page.getByText(receipt)).toBeVisible({ timeout: 10_000 });
  });

  test("client cannot open payments or invites", async ({ page }) => {
    await signIn(page, "neha.khanna@example.com");
    const payments = await page.goto("/portal/payments");
    expect(payments?.status()).toBe(404);
    const invites = await page.goto("/portal/invites");
    expect(invites?.status()).toBe(404);
  });

  test("staff creates an invite link", async ({ page }) => {
    await signIn(page, "saraansh.baranwal@example.com");
    await page.goto("/portal/invites");
    const email = `e2e-${Date.now()}@example.com`;
    await page.locator('input[name="email"]').fill(email);
    await page.locator('select[name="role"]').selectOption("collaborator");
    await page.getByRole("button", { name: "Create invite link" }).click();
    await expect(page.getByText(email)).toBeVisible({ timeout: 10_000 });
    await expect(page.getByText(/\/invite\//).first()).toBeVisible();
  });

  test("settings shows profile and 2FA recommendation", async ({ page }) => {
    await signIn(page, "neha.khanna@example.com");
    await page.goto("/portal/settings");
    await expect(page.locator('input[name="full_name"]')).toHaveValue(
      "Neha Khanna",
    );
    await expect(page.getByText("recommended")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Set up 2FA" }),
    ).toBeVisible();
  });

  test("unauthenticated portal access redirects to login", async ({
    page,
  }) => {
    await page.goto("/portal");
    await page.waitForURL(/\/auth\/login/);
    await expect(page.getByText("Client portal", { exact: false })).toBeVisible();
  });
});
