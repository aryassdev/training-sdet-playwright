import test from "@playwright/test";
import { LoginPage } from "../../resources/saucedemo/pages/loginPage";
import { navigateUrl, verifyUrl } from "../../resources/common/helpers/navigation";
import { commonConfig } from "../../config/saucedemo/common";
import { credentialConfig } from "../../config/saucedemo/credentials";
import { SortingPage } from "../../resources/saucedemo/pages/sortingPage";
import { CartPage } from "../../resources/saucedemo/pages/cartPage";
import { CheckoutInformationPage } from "../../resources/saucedemo/pages/checkoutInformationPage";
import { CheckoutOverviewPage } from "../../resources/saucedemo/pages/checkoutOverviewPage";
import { CheckoutCompletePage } from "../../resources/saucedemo/pages/checkoutCompletePage";

test('SauceDemo full user flow', async ({ page }) => {
    let addedItemNames: string[] = [];
    
    await test.step('Login', async () => {
        const loginPage = new LoginPage(page);
        
        await navigateUrl(page, commonConfig.baseUrl);
        await loginPage.login(credentialConfig.username, credentialConfig.password);
        
        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    await test.step('Browse / Filter Products', async () => {
        const sortingPage = new SortingPage(page);
        
        const expectedItemPrices = await sortingPage.getItemPrices('asc');
        
        await sortingPage.selectSortingOption('lohi','Low-High');
        const sortedItemPrices = await sortingPage.getItemPrices();
        
        await sortingPage.verifyEqual(expectedItemPrices, sortedItemPrices);
    });

    await test.step('Add Products to Cart', async () => {
        const cartPage = new CartPage(page);
        
        addedItemNames = await cartPage.addItemsToCart(2, 6);
        await cartPage.openCart();
                
        await cartPage.verifyCartItemCount(addedItemNames.length);
        await cartPage.verifyCartItems(addedItemNames);
    });

    await test.step('View Cart', async () => {
        const cartPage = new CartPage(page);
        
        const updatedItems = await cartPage.removeItemFromCart(1, addedItemNames);
        addedItemNames = updatedItems;

        await cartPage.verifyCartItemCount(updatedItems.length);
        await cartPage.verifyCartItems(updatedItems);
    });

    await test.step('Checkout', async () => {
        const cartPage = new CartPage(page);
        const checkoutInformationPage = new CheckoutInformationPage(page);

        cartPage.checkOut();

        verifyUrl(page, `${commonConfig.baseUrl}/checkout-step-one.html`);

        await checkoutInformationPage.addCheckoutDetails('John', 'Doe', '12345');

        await verifyUrl(page, `${commonConfig.baseUrl}/checkout-step-two.html`);
    });

    await test.step('Review Order', async () => {
        const cartPage = new CartPage(page);
        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        
        await cartPage.verifyCartItems(addedItemNames);
        await checkoutOverviewPage.verifyCartItemQuantities(addedItemNames.map(() => '1'));
        
        const totalPrice = await checkoutOverviewPage.getTotalPrice();
        await checkoutOverviewPage.verifyTotalPrice(totalPrice);

        await checkoutOverviewPage.finishCheckout();
    });

    await test.step('Order Confirmation', async () => {
        const checkoutCompletePage = new CheckoutCompletePage(page);
        
        await checkoutCompletePage.verifyOrderCompletion('Thank you for your order!');

        await checkoutCompletePage.backToHome();
        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    await test.step('Logout', async () => {
        const loginPage = new LoginPage(page);
    
        await loginPage.logout();

        await verifyUrl(page, `${commonConfig.baseUrl}/`);
    });
});