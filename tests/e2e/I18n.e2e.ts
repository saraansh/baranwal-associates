import { expect, test } from '@playwright/test';

test.describe('I18n', () => {
  test.describe('Language Switching', () => {
    test('should switch language from English to Hindi using dropdown and verify text on the homepage', async ({ page }) => {
      await page.goto('/');

      await expect(
        page.getByRole('heading', { name: 'Transforming Dreams Into Reality' }),
      ).toBeVisible();

      await page.getByLabel('lang-switcher').selectOption('hi');

      await expect(
        page.getByRole('heading', { name: 'सपनों को वास्तविकता में बदलना' }),
      ).toBeVisible();
    });

    test('should switch language from English to Hindi using URL and verify text on the sign-in page', async ({ page }) => {
      await page.goto('/sign-in');

      await expect(page.getByText('Email address')).toBeVisible();

      await page.goto('/hi/sign-in');

      await expect(page.getByText('ईमेल पता')).toBeVisible();
    });
  });
});
