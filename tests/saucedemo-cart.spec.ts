import { test } from '@playwright/test';
import { LoginPage } from '../resources/pages/loginPage';
import { CartPage } from '../resources/pages/cartPage';

test.describe('SauceDemo Cart Functionality Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.navigate();
        await loginPage.login('standard_user', 'secret_sauce');

        await loginPage.verifyUrl('https://www.saucedemo.com/inventory.html');
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