import { expect, test } from '@playwright/test';

import { mockInstallationSearch } from '../fixtures';

test.use({ baseURL: 'http://127.0.0.1:4323' });

test('cleans up an open search and remounts after client navigation', async ({ page }) => {
	await mockInstallationSearch(page);
	await page.goto('/');
	await page.getByRole('button', { name: /^Search\b/ }).click();
	await expect(page.locator('.DocSearch-Input')).toBeFocused();
	await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

	await page.evaluate(() => {
		document.addEventListener('astro:page-load', () => {
			document.documentElement.dataset.clientNavigation = 'complete';
		}, { once: true });
	});
	await page.getByRole('link', { name: 'Getting Started', exact: true }).first()
		.evaluate((link) => (link as HTMLElement).click());

	await expect(page).toHaveURL(/\/guides\/getting-started\/$/);
	await expect(page.locator('html')).toHaveAttribute('data-client-navigation', 'complete');
	await expect(page.locator('.DocSearch-Modal')).toHaveCount(0);
	await expect(page.locator('body')).not.toHaveClass(/DocSearch--active/);
	await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');

	const searchButton = page.getByRole('button', { name: /^Search\b/ });
	await expect(searchButton).toHaveCount(1);
	await searchButton.focus();
	await page.keyboard.press('ControlOrMeta+k');
	await expect(page.locator('.DocSearch-Modal')).toHaveCount(1);
	await expect(page.locator('.DocSearch-Input')).toBeFocused();
	await page.keyboard.press('Escape');
	await expect(page.locator('.DocSearch-Modal')).toHaveCount(0);
	await expect(searchButton).toBeFocused();
});