import test, { Page } from "@playwright/test";
import { LoginPage } from "@resources/saucedemo/pages/loginPage";
import { navigateUrl, verifyUrl } from "@resources/common/helpers/navigation";
import { commonConfig } from "@config/saucedemo/common";
import { credentialConfig } from "@config/saucedemo/credentials";
import { SortingPage } from "@resources/saucedemo/pages/sortingPage";
import { CartPage } from "@resources/saucedemo/pages/cartPage";
import { CheckoutInformationPage } from "@resources/saucedemo/pages/checkoutInformationPage";
import { CheckoutOverviewPage } from "@resources/saucedemo/pages/checkoutOverviewPage";
import { CheckoutCompletePage } from "@resources/saucedemo/pages/checkoutCompletePage";
import { selectItemData } from "@resources/saucedemo/data/selectItemData";

const runTest = (data: { name: string; itemIndexes: number[] }) => test(`SauceDemo full user flow @critical: ${data.name}`, async ({ page }) => {
    let addedItemNames: string[] = [];
    const loginPage = new LoginPage(page);
    const sortingPage = new SortingPage(page);
    const cartPage = new CartPage(page);
    const checkoutInformationPage = new CheckoutInformationPage(page);
    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    const checkoutCompletePage = new CheckoutCompletePage(page);
    
    await test.step('Login', async () => {
        await navigateUrl(page, commonConfig.baseUrl);
        await loginPage.login(credentialConfig.username, credentialConfig.password);
        
        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    await test.step('Browse / Filter Products', async () => {
        const expectedItemPrices = await sortingPage.getItemPrices('asc');
        
        await sortingPage.selectSortingOption('lohi','Low-High');
        const sortedItemPrices = await sortingPage.getItemPrices();
        
        await sortingPage.verifyEqual(expectedItemPrices, sortedItemPrices);
    });

    await test.step('Add Products to Cart', async () => {
        addedItemNames = await cartPage.addItemsAtToCart(data.itemIndexes);
        await cartPage.openCart();
                
        await cartPage.verifyCartItemCount(addedItemNames.length);
        await cartPage.verifyCartItems(addedItemNames);
    });

    await test.step('View Cart', async () => {
        const updatedItems = await cartPage.removeItemFromCart(1, addedItemNames);
        addedItemNames = updatedItems;

        await cartPage.verifyCartItemCount(updatedItems.length);
        await cartPage.verifyCartItems(updatedItems);
    });

    await test.step('Checkout', async () => {
        cartPage.checkOut();

        verifyUrl(page, `${commonConfig.baseUrl}/checkout-step-one.html`);

        await checkoutInformationPage.addCheckoutDetails(
            credentialConfig.checkoutFirstname,
            credentialConfig.checkoutLastname,
            credentialConfig.checkoutPostcode
        );

        await verifyUrl(page, `${commonConfig.baseUrl}/checkout-step-two.html`);
    });

    await test.step('Review Order', async () => {
        await cartPage.verifyCartItems(addedItemNames);
        await checkoutOverviewPage.verifyCartItemQuantities(addedItemNames.map(() => '1'));
        
        const totalPrice = await checkoutOverviewPage.getTotalPrice();
        await checkoutOverviewPage.verifyTotalPrice(totalPrice);

        await checkoutOverviewPage.finishCheckout();
    });

    await test.step('Order Confirmation', async () => {
        await checkoutCompletePage.verifyOrderCompletion('Thank you for your order!');

        await checkoutCompletePage.backToHome();
        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    await test.step('Logout', async () => {
        await loginPage.logout();

        await verifyUrl(page, `${commonConfig.baseUrl}/`);
    });
});

selectItemData.forEach(data => runTest(data));