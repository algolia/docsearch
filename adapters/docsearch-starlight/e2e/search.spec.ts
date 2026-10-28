import { expect, test } from '@playwright/test';

import { installationHit, mockInstallationSearch } from './fixtures';

test('opens search and returns button focus after Escape', async ({
	page,
}) => {
	await page.goto('/');

	const searchButton = page.getByRole('button', { name: /^Search\b/ });
	await searchButton.click();

	const modal = page.locator('.DocSearch-Modal');
	await expect(modal).toBeVisible();
	await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');
	const input = modal.locator('.DocSearch-Input');
	await expect(input).toBeVisible();
	await expect(input).toBeFocused();

	await page.keyboard.press('Escape');

	await expect(modal).not.toBeVisible();
	await expect(page.locator('body')).not.toHaveClass(/DocSearch--active/);
	await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
	await expect(searchButton).toBeFocused();
});

test('opens one search modal with the keyboard shortcut', async ({ page }) => {
	await page.goto('/');

	const searchButton = page.getByRole('button', { name: /^Search\b/ });
	await searchButton.focus();
	await page.keyboard.press('ControlOrMeta+k');

	const modal = page.locator('.DocSearch-Modal');
	await expect(modal).toHaveCount(1);
	await expect(modal).toBeVisible();
	await expect(modal.locator('.DocSearch-Input')).toBeFocused();
});

test('uses the configured search options and navigates to a result with the keyboard', async ({
	page,
	baseURL,
}) => {
	const destination = new URL(installationHit.url, baseURL).href;
	const hit = {
		...installationHit,
		url: destination,
		url_without_anchor: destination.split('#')[0],
	};

	await mockInstallationSearch(page, hit);
	await page.goto('/');
	await page.getByRole('button', { name: /^Search\b/ }).click();

	const input = page.locator('.DocSearch-Input');
	await expect(input).toBeFocused();
	await expect(input).toHaveAttribute('placeholder', 'Search documentation');

	const searchRequest = page.waitForRequest((request) =>
		request.url().includes('/queries') &&
		request.postDataJSON().requests[0]?.query === 'installation'
	);
	await input.fill('installation');
	const request = await searchRequest;

	expect(request.postDataJSON().requests).toEqual([
		expect.objectContaining({ indexName: 'docsearch', query: 'installation' }),
	]);
	const applicationId = request.headers()['x-algolia-application-id'] ??
		new URL(request.url()).searchParams.get('x-algolia-application-id');
	expect(applicationId).toBe('PMZUYBQDAK');

	const result = page.locator('.DocSearch-Hit').getByRole('link', {
		name: /Installation/,
	});
	await expect(result).toBeVisible();
	await expect(result).toHaveAttribute('href', destination);
	await input.press('ArrowDown');
	await input.press('Enter');
	await expect(page).toHaveURL(destination);
});
