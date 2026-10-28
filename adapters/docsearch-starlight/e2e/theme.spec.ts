import { expect, test } from '@playwright/test';

test('inherits light theme colors and a custom keyboard focus accent', async ({
	page,
}) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.emulateMedia({ colorScheme: 'light' });
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');

	const background = await page.locator('body').evaluate((body) =>
		getComputedStyle(body).backgroundColor
	);
	const searchButton = page.getByRole('button', { name: /^Search\b/ });
	await expect(searchButton).toHaveCSS('background-color', background);

	await page.evaluate(() => {
		document.documentElement.style.setProperty('--sl-color-accent', '#c02670');
	});
	await searchButton.focus();
	await page.keyboard.press('Shift+Tab');
	await page.keyboard.press('Tab');
	await expect(searchButton).toBeFocused();
	await expect(searchButton).toHaveCSS('outline', 'rgb(192, 38, 112) solid 2px');

	await page.keyboard.press('Enter');
	const modal = page.locator('.DocSearch-Modal');
	await expect(modal).toBeVisible();
	await expect(modal).toHaveCSS('background-color', background);
	await expect(modal.locator('.DocSearch-Input')).toBeFocused();
});

test('fits the search button and dark modal within a mobile viewport', async ({
	page,
}) => {
	await page.setViewportSize({ width: 375, height: 812 });
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/');
	await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

	const background = await page.locator('body').evaluate((body) =>
		getComputedStyle(body).backgroundColor
	);
	const searchButton = page.getByRole('button', { name: /^Search\b/ });
	await expect(searchButton).toBeInViewport({ ratio: 1 });
	await expect(searchButton).toHaveCSS('background-color', background);

	await searchButton.click();
	const modal = page.locator('.DocSearch-Modal');
	await expect(modal).toBeInViewport({ ratio: 1 });
	await expect(modal.locator('.DocSearch-Input')).toBeFocused();
	await expect(modal).toHaveCSS('background-color', background);
	expect(await page.locator('html').evaluate((root) => root.scrollWidth))
		.toBeLessThanOrEqual(375);
});