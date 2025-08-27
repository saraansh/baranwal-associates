import { expect, takeSnapshot, test } from '@chromatic-com/playwright';

test.describe('Visual testing', () => {
  test.describe('Static pages', () => {
    test('should take screenshot of the homepage', async ({ page }, testInfo) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Transforming Dreams Into Reality' }),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the portfolio page', async ({ page }, testInfo) => {
      await page.goto('/portfolio');

      await expect(
        page.getByText('Welcome to my portfolio page!'),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the about page', async ({ page }, testInfo) => {
      await page.goto('/about');

      await expect(
        page.getByText('Welcome to our About page!'),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the portfolio details page', async ({ page }, testInfo) => {
      await page.goto('/portfolio/2');

      await expect(
        page.getByText('Created a set of promotional'),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });

    test('should take screenshot of the Hindi homepage', async ({ page }, testInfo) => {
      await page.goto('/hi');

      await expect(
        page.getByRole('heading', { name: 'सपनों को वास्तविकता में बदलना' }),
      ).toBeVisible();

      await takeSnapshot(page, testInfo);
    });
  });
});
