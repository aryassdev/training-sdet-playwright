import { test, expect } from "@playwright/test";

test.describe('SauceDemo Sorting Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        await page.locator('[data-test="login-container"] [data-test="username"]').fill('standard_user');
        await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');

        await page.locator('[data-test="login-container"] [data-test="login-button"]').click();
    });

    test('Sort items as Name A-Z and verify the item is sorted properly', async ({ page }) => {
        const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        const sortedNames = [...itemNames].sort();
        
        await page.locator('[data-test="product-sort-container"]').selectOption('az');
        const afterSortItemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();

        expect(afterSortItemNames).toEqual(sortedNames);
    });

    test('Sort items as Name Z-A and verify the item is sorted properly', async ({ page }) => {
        const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        const sortedNames = [...itemNames].sort().reverse();

        await page.locator('[data-test="product-sort-container"]').selectOption('za');
        const afterSortItemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();

        expect(afterSortItemNames).toEqual(sortedNames);
    });

    test('Sort items as Price Low-High and verify the item is sorted properly', async ({ page }) => {
        const itemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        const sortedPrices = itemPrices
            .map(price => parseFloat(price.replace('$', '')))
            .sort((a, b) => a - b)
            .map(price => `$${price.toFixed(2)}`);

        await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
        const afterSortItemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();

        expect(afterSortItemPrices).toEqual(sortedPrices);
    });

    test('Sort items as Price High-Low and verify the item is sorted properly', async ({ page }) => {
        const itemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        const sortedPrices = itemPrices
            .map(price => parseFloat(price.replace('$', '')))
            .sort((a, b) => a - b)
            .reverse()
            .map(price => `$${price.toFixed(2)}`);

        await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
        const afterSortItemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        
        expect(afterSortItemPrices).toEqual(sortedPrices);
    });
});
