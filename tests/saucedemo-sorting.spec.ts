import { test, expect } from "@playwright/test";

test.describe('SauceDemo Sorting Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        await page.locator('[data-test="login-container"] [data-test="username"]').fill('standard_user');
        await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');

        await page.locator('[data-test="login-container"] [data-test="login-button"]').click();
    });

    test('Sort items as Name A-Z and verify the item is sorted properly', async ({ page }) => {
        let sortedNames: string[] = [];
        let afterSortItemNames: string[] = [];

        await test.step('Get initial item names and sort them', async () => {
            const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
            sortedNames = [...itemNames].sort();
        });
        
        await test.step('Select A-Z sorting option', async () => {
            await page.locator('[data-test="product-sort-container"]').selectOption('az');
            afterSortItemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        });

        expect(afterSortItemNames).toEqual(sortedNames);
    });

    test('Sort items as Name Z-A and verify the item is sorted properly', async ({ page }) => {
        let sortedNames: string[] = [];
        let afterSortItemNames: string[] = [];

        await test.step('Get initial item names and sort them in reverse', async () => {
            const itemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
            sortedNames = [...itemNames].sort().reverse();
        });

        await test.step('Select Z-A sorting option', async () => {
            await page.locator('[data-test="product-sort-container"]').selectOption('za');
            afterSortItemNames = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        });

        expect(afterSortItemNames).toEqual(sortedNames);
    });

    test('Sort items as Price Low-High and verify the item is sorted properly', async ({ page }) => {
        let sortedPrices: string[] = [];
        let afterSortItemPrices: string[] = [];

        await test.step('Get initial item prices and sort them', async () => {
            const itemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
            sortedPrices = itemPrices
                .map(price => parseFloat(price.replace('$', '')))
                .sort((a, b) => a - b)
                .map(price => `$${price.toFixed(2)}`);
        });

        await test.step('Select Low-High sorting option', async () => {
            await page.locator('[data-test="product-sort-container"]').selectOption('lohi');
            afterSortItemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        });

        expect(afterSortItemPrices).toEqual(sortedPrices);
    });

    test('Sort items as Price High-Low and verify the item is sorted properly', async ({ page }) => {
        let sortedPrices: string[] = [];
        let afterSortItemPrices: string[] = [];

        await test.step('Get initial item prices and sort them in reverse', async () => {
            const itemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
            sortedPrices = itemPrices
                .map(price => parseFloat(price.replace('$', '')))
                .sort((a, b) => a - b)
                .reverse()
                .map(price => `$${price.toFixed(2)}`);
        });

        await test.step('Select High-Low sorting option', async () => {
            await page.locator('[data-test="product-sort-container"]').selectOption('hilo');
            afterSortItemPrices = await page.locator('[data-test="inventory-item-price"]').allTextContents();
        });

        expect(afterSortItemPrices).toEqual(sortedPrices);
    });
});
