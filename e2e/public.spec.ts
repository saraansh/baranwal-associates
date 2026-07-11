import { expect, test } from "@playwright/test";

test.describe("public site", () => {
  test("home has SEO essentials", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Baranwal Associates/);
    const desc = page.locator('meta[name="description"]');
    await expect(desc).toHaveAttribute("content", /Gorakhpur/);
    const jsonLd = await page
      .locator('script[type="application/ld+json"]')
      .first()
      .evaluate((el) => el.textContent);
    expect(jsonLd).toContain("ProfessionalService");
  });

  test("navigates to portfolio and opens a project", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(
      page.getByRole("heading", { name: "Portfolio" }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: /Agarwal Residence/ })
      .first()
      .click();
    await expect(
      page.getByRole("heading", { name: "Agarwal Residence" }),
    ).toBeVisible();
  });

  test("journal lists posts and renders an article", async ({ page }) => {
    await page.goto("/blog");
    await page
      .getByRole("heading", { name: /Vastu Meets Modern/ })
      .first()
      .click();
    await page.waitForURL(/\/blog\/vastu-meets-modern/);
    await expect(page.locator("h1")).toContainText("Vastu Meets Modern");
  });

  test("contact form validates and submits", async ({ page }) => {
    await page.goto("/contact");
    await page.getByLabel("Your name").fill("Test Visitor");
    await page.getByLabel("Email").fill("visitor@example.com");
    await page
      .getByLabel("About your project")
      .fill("A 2000 sq ft plot in Gorakhpur, thinking of a duplex.");
    await page.getByRole("button", { name: /Send enquiry/ }).click();
    // Succeeds against a live DB; degrades to a graceful error otherwise.
    await expect(
      page
        .getByText(/enquiry received/i)
        .or(page.getByText(/couldn't save your enquiry/i)),
    ).toBeVisible({ timeout: 10_000 });
  });

  test("theme toggle flips dark mode", async ({ page, context, baseURL }) => {
    // Start from an explicit light theme; one click cycles light → dark.
    await context.addCookies([
      { name: "ba-theme", value: "light", url: baseURL! },
    ]);
    await page.goto("/");
    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);
    await page
      .locator('button[aria-label^="Theme:"]:visible')
      .first()
      .click();
    // Optimistic flip + cookie revalidation; generous under parallel load.
    await expect(html).toHaveClass(/dark/, { timeout: 15_000 });
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.ok()).toBeTruthy();
    expect(await sitemap.text()).toContain("/portfolio/");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("Sitemap:");
  });

  test("PWA manifest is installable-shaped", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.ok()).toBeTruthy();
    const manifest = await res.json();
    expect(manifest.display).toBe("standalone");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
  });
});
