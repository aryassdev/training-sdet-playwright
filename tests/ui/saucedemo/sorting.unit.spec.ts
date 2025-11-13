import { test } from "@playwright/test";
import { LoginPage } from "@resources/saucedemo/pages/loginPage";
import { SortingPage } from "@resources/saucedemo/pages/sortingPage";
import { commonConfig } from "@config/saucedemo/common";
import { credentialConfig } from "@config/saucedemo/credentials";
import { navigateUrl, verifyUrl } from "@resources/common/helpers/navigation";

test.describe('SauceDemo Sorting Tests', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await navigateUrl(page, commonConfig.baseUrl);
        await loginPage.login(credentialConfig.username, credentialConfig.password);

        await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
    });

    test('Sort items as Name A-Z and verify the item is sorted properly @smoke', async ({ page }) => {
        const sortingPage = new SortingPage(page);

        const expectedItemNames = await sortingPage.getItemNames('asc');
        
        await sortingPage.selectSortingOption('az', 'A-Z');
        const sortedItemNames = await sortingPage.getItemNames();

        await sortingPage.verifyEqual(sortedItemNames, expectedItemNames);
    });

    test('Sort items as Name Z-A and verify the item is sorted properly', async ({ page }) => {
        const sortingPage = new SortingPage(page);

        const expectedItemNames = await sortingPage.getItemNames('desc');

        await sortingPage.selectSortingOption('za', 'Z-A');
        const sortedItemNames = await sortingPage.getItemNames();

        await sortingPage.verifyEqual(expectedItemNames, sortedItemNames);
    });

    test('Sort items as Price Low-High and verify the item is sorted properly @smoke', async ({ page }) => {
        const sortingPage = new SortingPage(page);

        const expectedItemPrices = await sortingPage.getItemPrices('asc');

        await sortingPage.selectSortingOption('lohi','Low-High');
        const sortedItemPrices = await sortingPage.getItemPrices();

        await sortingPage.verifyEqual(expectedItemPrices, sortedItemPrices);
    });

    test('Sort items as Price High-Low and verify the item is sorted properly', async ({ page }) => {
        const sortingPage = new SortingPage(page);

        const expectedItemPrices = await sortingPage.getItemPrices('desc');
        
        await sortingPage.selectSortingOption('hilo', 'High-Low');
        const sortedItemPrices = await sortingPage.getItemPrices();

        await sortingPage.verifyEqual(expectedItemPrices, sortedItemPrices);
    });
});
