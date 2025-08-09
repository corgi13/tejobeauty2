import { test, expect } from '@playwright/test';

test('home loads', async ({ page }) => {
  await page.goto('/en');
  await expect(page.getByText('Beauty is not a luxury', { exact: false })).toBeVisible();
});


