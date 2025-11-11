import { test } from '@playwright/test';
import { LoginPage } from '../../resources/saucedemo/pages/loginPage';
import { CartPage } from '../../resources/saucedemo/pages/cartPage';
import { commonConfig } from '../../config/saucedemo/common';
import { credentialConfig } from '../../config/saucedemo/credentials';
import { navigateUrl, verifyUrl } from '../../resources/common/helpers/navigation';

test.describe('SauceDemo Cart Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await navigateUrl(page, commonConfig.baseUrl);
        await loginPage.login(credentialConfig.username, credentialConfig.password);

        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    test('Select random item (2-6) Add to Cart and verify the cart shows correct badge number and the item exist when Cart is opened', async ({ page }) => {
        const cartPage = new CartPage(page);

        const addedItemNames = await cartPage.addItemsToCart(2, 6);
        await cartPage.openCart();
        
        await cartPage.verifyCartItemCount(addedItemNames.length);
        await cartPage.verifyCartItems(addedItemNames);
    });

    test('Remove 1 item from cart and verify the cart shows correct badge number and the item exist when Cart is opened', async ({ page }) => {
        const cartPage = new CartPage(page);

        const addedItemNames = await cartPage.addItemsToCart(2, 2);
        await cartPage.openCart();

        const updatedItems = await cartPage.removeItemFromCart(1, addedItemNames);

        await cartPage.verifyCartItemCount(updatedItems.length);
        await cartPage.verifyCartItems(updatedItems);
    });

    test('Remove all items from cart and verify the cart is empty', async ({ page }) => {
        const cartPage = new CartPage(page);

        const addedItemNames = await cartPage.addItemsToCart();

        await cartPage.openCart();

        await cartPage.removeItemFromCart(0, addedItemNames);

        await cartPage.verifyCartEmpty();
        await cartPage.verifyCartItems([]);
    });
});