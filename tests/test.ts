import { expect, test } from '@playwright/test';

test.describe('MapExplorer tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('Map loads on page visit', async ({ page }) => {
		const mapContainer = page.locator('aside');
		await expect(mapContainer).toBeVisible();
	});

	test('Footer city links navigate correctly', async ({ page }) => {
		await page.click('text=Paris');
		await expect(page).toHaveURL('/city/paris');
	});

	test('Footer monument links navigate correctly', async ({ page }) => {
		await page.click('text=Michelin Boulogne-Billancourt');
		await expect(page).toHaveURL('/monument/michelin');
	});
});
