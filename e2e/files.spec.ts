import path from "node:path";
import { expect, test, type Page } from "@playwright/test";

const PROJECT_URL = "/portal/projects/aaaa0014-0000-0000-0000-000000000014";

async function signIn(page: Page, email: string) {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/portal/);
}

test.describe("drawing files", () => {
  test("staff uploads an OBJ: browser converts to glTF, previews, versions", async ({
    page,
  }) => {
    await signIn(page, "priya.srivastava@example.com");
    await page.goto(PROJECT_URL);

    // Create a fresh drawing set to version into.
    const title = `E2E Massing ${Date.now()}`;
    await page.locator('input[name="title"]#drawing-title').fill(title);
    await page
      .locator('form:has(#drawing-title) select[name="kind"]')
      .selectOption("sketchup_3d");
    await page
      .locator("form:has(#drawing-title)")
      .getByRole("button", { name: "Add" })
      .click();
    const card = page.locator("div.rounded-sm", { hasText: title }).first();
    await expect(card).toBeVisible({ timeout: 10_000 });

    // Upload an OBJ — conversion happens client-side with a live preview.
    await card.getByRole("button", { name: "+ Upload new version" }).click();
    await card
      .locator('input[type="file"]')
      .first()
      .setInputFiles(path.join(import.meta.dirname, "fixtures/cube.obj"));
    await expect(
      card.getByText("exactly what clients will see", { exact: false }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(card.locator("canvas")).toBeVisible();

    await card
      .locator('input[placeholder^="Version notes"]')
      .fill("Cube massing test");
    await card.getByRole("button", { name: "Upload version" }).click();

    // The recorded version appears with a 3D preview affordance.
    const row = card.locator("li", { hasText: "Cube massing test" });
    await expect(row).toBeVisible({ timeout: 20_000 });
    await expect(row.getByRole("button", { name: "view 3D" })).toBeVisible();

    // And the client can see + open it too.
    await page.getByRole("button", { name: "Sign out" }).click();
    await signIn(page, "ramesh.agarwal@example.com");
    await page.goto(PROJECT_URL);
    const clientRow = page.locator("li", { hasText: "Cube massing test" }).first();
    await expect(clientRow).toBeVisible();
    await clientRow.getByRole("button", { name: "view 3D" }).click();
    await expect(page.locator("li canvas").first()).toBeVisible({
      timeout: 20_000,
    });
  });

  test("download link is issued for originals", async ({ page }) => {
    await signIn(page, "ramesh.agarwal@example.com");
    await page.goto(PROJECT_URL);
    const row = page.locator("li", { hasText: "Cube massing test" }).first();
    const downloadPromise = page.waitForEvent("download", { timeout: 15_000 });
    await row.getByRole("button", { name: "download" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain("cube");
  });

  test("presign rejects unsupported types and foreign projects", async ({
    page,
    request,
  }) => {
    await signIn(page, "neha.khanna@example.com");
    const cookies = await page.context().cookies();
    const cookieHeader = cookies
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    const bad = await request.post("/api/uploads/presign", {
      headers: { Cookie: cookieHeader },
      data: {
        projectId: "aaaa0003-0000-0000-0000-000000000003",
        filename: "malware.exe",
        contentType: "application/octet-stream",
        sizeBytes: 100,
        purpose: "original",
      },
    });
    expect(bad.status()).toBe(400);

    // Neha is not on the Agarwal Residence project.
    const foreign = await request.post("/api/uploads/presign", {
      headers: { Cookie: cookieHeader },
      data: {
        projectId: "aaaa0014-0000-0000-0000-000000000014",
        filename: "plan.pdf",
        contentType: "application/pdf",
        sizeBytes: 100,
        purpose: "original",
      },
    });
    expect(foreign.status()).toBe(404);

    const anon = await request.post("/api/uploads/presign", {
      data: {
        projectId: "aaaa0003-0000-0000-0000-000000000003",
        filename: "plan.pdf",
        contentType: "application/pdf",
        sizeBytes: 100,
        purpose: "original",
      },
    });
    expect(anon.status()).toBe(401);
  });
});
