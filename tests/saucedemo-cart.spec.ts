import { test, expect} from '@playwright/test';

test.describe('SauceDemo Cart Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com/');

        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');

        await page.locator('[data-test="login-button"]').click();
    });

    test('Select random item (2-6) Add to Cart and verify the cart shows correct badge number and the item exist when Cart is opened', async ({ page }) => {
        const randomCount = Math.floor(Math.random() * 5) + 2; // Random number between 2 and 6
        const addedItems: String[] = [];

        await test.step(`Adding ${randomCount} random items to the cart`, async () => {
            for (let i = 0; i < randomCount; i++) {
                const randomItemIndex = Math.floor(Math.random() * randomCount); // Random index within the selected count
    
                const item = page.locator('[data-test="inventory-item-description"]').nth(randomItemIndex);
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
        });

        await test.step('Open the cart page', async () => {
            await page.locator('[data-test="shopping-cart-link"]').click();
        });
        
        const cartCount = await page.locator('[data-test="shopping-cart-badge"]').textContent();
        expect(cartCount).toBe(randomCount.toString());
        
        const cartItems = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        expect(cartItems).toEqual(addedItems);
    });

    test('Remove 1 item from cart and verify the cart shows correct badge number and the item exist when Cart is opened', async ({ page }) => {
        const itemsToAdd = 4;
        const addedItems: String[] = [];
        let updatedItems: String[] = [];

        await test.step('Adding items to the cart', async () => {
            for (let i = 0; i < itemsToAdd; i++) {
                const item = page.locator('[data-test="inventory-item-description"]').nth(i);
                const addToCartButton = item.locator('button[data-test^="add-to-cart-"]'); 
                const itemName = await item.locator('[data-test="inventory-item-name"]').textContent();
    
                await addToCartButton.click();
                if (itemName) {
                    addedItems.push(itemName);
                }
            }
        });

        await test.step('Open the cart page', async () => {
            await page.locator('[data-test="shopping-cart-link"]').click();
        });

        await test.step('Remove one item from the cart and update expected items', async () => {
            const itemToRemove = addedItems[2];
            await page.locator(`[data-test="remove-${itemToRemove?.toLowerCase().replace(/ /g, '-')}"]`).click();

            updatedItems = addedItems.filter(item => item !== itemToRemove);
        });

        // Verify cart count
        const cartCount = await page.locator('[data-test="shopping-cart-badge"]').textContent();
        expect(cartCount).toBe((itemsToAdd - 1).toString());

        // Verify cart items
        const cartItems = await page.locator('[data-test="inventory-item-name"]').allTextContents();
        expect(cartItems).toEqual(updatedItems);
    });

    test('Remove all items from cart and verify the cart is empty', async ({ page }) => {
        const itemsToAdd = 3;
        const addedItems: String[] = [];

        await test.step('Adding items to the cart', async () => {
            for (let i = 0; i < itemsToAdd; i++) {
                const item = page.locator('[data-test="inventory-item-description"]').nth(i);
                const addToCartButton = item.locator('button[data-test^="add-to-cart-"]');
                const itemName = await item.locator('[data-test="inventory-item-name"]').textContent();
    
                await addToCartButton.click();
                if (itemName) {
                    addedItems.push(itemName);
                }
            }
        });

        await test.step('Open the cart page', async () => {
            await page.locator('[data-test="shopping-cart-link"]').click();
        });

        await test.step('Removing all items from the cart', async () => {
            for (let i = 0; i < itemsToAdd; i++) {
                const itemName = addedItems[i];
                if (itemName) {
                    await page.locator(`[data-test="remove-${itemName.toLowerCase().replace(/ /g, '-')}"]`).click();
                }
            }
        });

        // Verify cart is empty
        const cartItemsCount = await page.locator('[data-test="cart-item"]').count();
        expect(cartItemsCount).toBe(0);

        const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        expect(await cartBadge.count()).toBe(0);
    });
});