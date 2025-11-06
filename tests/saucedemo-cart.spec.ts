import { test, expect} from '@playwright/test';

test.describe('SauceDemo Cart Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        await page.locator('[data-test="login-container"] [data-test="username"]').fill('standard_user');
        await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');

        await page.locator('[data-test="login-container"] [data-test="login-button"]').click();
    });

    test('Select random item (2-6) Add to Cart and verify the cart shows correct badge number and the item exist when Cart is opened', async ({ page }) => {
        const randomCount = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6
        const addedItems: String[] = [];

        for (let i = 0; i < randomCount; i++) {
            const randomItemIndex = Math.floor(Math.random() * randomCount); // Random index within the selected count

            const item = page.locator('[data-test="inventory-list"] [data-test="inventory-item-description"]').nth(randomItemIndex);
            const addToCartButton = item.locator('button[data-test^="add-to-cart-"]'); 
            const itemName = await item.locator('[data-test="inventory-item-name"]').textContent();

            if (await addToCartButton.count() === 0) {
                i--;
                continue; // Retry if button not found
            }
            await addToCartButton.click();
            if (itemName) {
                addedItems.push(itemName);
            }
        }
        
        const header = page.locator('[data-test="header-container"]');

        const cartCount = await header.locator('[data-test="shopping-cart-badge"]').textContent();
        expect(cartCount).toBe(randomCount.toString());

        await header.locator('[data-test="shopping-cart-link"]').click();

        const cartItems = await page.locator('[data-test="cart-list"] [data-test="inventory-item-name"]').allTextContents();
        expect(cartItems).toEqual(addedItems);
    });
});