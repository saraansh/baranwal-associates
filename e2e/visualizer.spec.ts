import { expect, test, type Page } from "@playwright/test";

async function signIn(page: Page, email: string) {
  await page.goto("/auth/login");
  await page.locator('input[name="email"]').fill(email);
  await page.locator('input[name="password"]').fill("password123");
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForURL(/\/portal/);
}

async function readBalance(page: Page) {
  const text = await page
    .locator("aside p", { hasText: "credits" })
    .first()
    .innerText();
  return Number(text.replace(/[^0-9-]/g, ""));
}

test.describe("AI interior visualizer", () => {
  test("generates a redesign and appends it to the chat", async ({ page }) => {
    test.slow(); // upload + generation + two navigations under suite load
    // Neha is not used by any other test in this spec — the balance
    // assertion must not race the concurrent purchase tests.
    await signIn(page, "neha.khanna@example.com");
    await page.goto("/portal/visualizer");

    const before = await readBalance(page);
    // force: mobile emulation's visual-viewport offset breaks hit-testing;
    // the aria-checked assertion below proves the tap registered.
    const chip = page.getByRole("radio", { name: "Modern Minimal" });
    await chip.click({ force: true });
    await expect(chip).toHaveAttribute("aria-checked", "true");
    const composer = page.locator("textarea");
    await composer.fill("Warm evening light, add a jute rug near the seating.");
    // Enter submits — mobile emulation offsets the visual viewport while
    // the textarea is focused, so a coordinate click can miss the button.
    await composer.press("Enter");

    // AI reply lands in the chat with the generated image.
    await expect(page.getByText("✨", { exact: false })).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator("section img").first()).toBeVisible({
      timeout: 20_000,
    });

    // Either a trial was consumed (balance unchanged) or one credit spent.
    await expect
      .poll(
        async () => {
          const after = await readBalance(page);
          return after === before || after === before - 1;
        },
        { timeout: 10_000 },
      )
      .toBe(true);

    // The session persists into history.
    await page.reload();
    await expect(page.getByText("✨", { exact: false }).first()).toBeVisible({
      timeout: 15_000,
    });
  });

  test("buying a credit pack (mock Razorpay) raises the balance", async ({
    page,
  }) => {
    await signIn(page, "sunil.jaiswal@example.com");
    await page.goto("/portal/visualizer");
    const before = await readBalance(page);
    await page.getByRole("button", { name: /\+5 · ₹/ }).click();
    await expect
      .poll(() => readBalance(page), { timeout: 15_000 })
      .toBe(before + 5);
  });

  test("paywall: generation returns 402 once trial and credits run out", async ({
    page,
    request,
  }) => {
    // The accountant starts with zero credits and only the free trial.
    await signIn(page, "manoj.gupta@example.com");
    const cookieHeader = (await page.context().cookies())
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");

    let sawPaywall = false;
    for (let i = 0; i < 5 && !sawPaywall; i++) {
      const res = await request.post("/api/ai/generate", {
        headers: { Cookie: cookieHeader, "Content-Type": "application/json" },
        data: { presets: { style: "japandi" }, prompt: "test" },
      });
      if (res.status() === 402) {
        const body = await res.json();
        expect(body.error).toContain("out of credits");
        sawPaywall = true;
      } else {
        expect(res.ok()).toBeTruthy();
      }
    }
    expect(sawPaywall).toBe(true);
  });

  test("accountant cash entry can grant credits to a client", async ({
    page,
  }) => {
    // Read Ramesh's balance…
    await signIn(page, "ramesh.agarwal@example.com");
    await page.goto("/portal/visualizer");
    const before = await readBalance(page);
    await page.getByRole("button", { name: "Sign out" }).click();

    // …accountant records cash with 3 credits…
    await signIn(page, "manoj.gupta@example.com");
    await page.goto("/portal/payments");
    await page
      .locator('select[name="user_id"]')
      .selectOption({ label: "Ramesh Agarwal" });
    await page.locator('input[name="amount_inr"]').fill("297");
    const receipt = `RCPT-CREDITS-${Date.now()}`;
    const notes = page.locator('input[name="notes"]');
    await notes.fill(receipt);
    await page.locator('input[name="grant_credits"]').fill("3");
    await notes.press("Enter");
    await expect(page.getByText(receipt)).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: "Sign out" }).click();

    // …and Ramesh's balance went up by exactly 3.
    await signIn(page, "ramesh.agarwal@example.com");
    await page.goto("/portal/visualizer");
    await expect
      .poll(() => readBalance(page), { timeout: 15_000 })
      .toBe(before + 3);
  });
});
