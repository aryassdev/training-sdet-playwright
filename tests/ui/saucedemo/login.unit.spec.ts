import { test } from '@playwright/test';
import { LoginPage } from '@resources/saucedemo/pages/loginPage';
import { credentialConfig } from '@config/saucedemo/credentials';
import { commonConfig } from '@config/saucedemo/common';
import { navigateUrl, verifyUrl } from '@resources/common/helpers/navigation';

test('User should be able to Login with valid credentials and verify the correct URL after logged in @smoke', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await navigateUrl(page, commonConfig.baseUrl);
    await loginPage.login(credentialConfig.username, credentialConfig.password);

    await verifyUrl(page, `${commonConfig.baseUrl}/inventory.html`);
});

test('User should unable to Login with invalid credentials and verify the “Username and password do not match any user in this service” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await navigateUrl(page, commonConfig.baseUrl);
    await loginPage.login(credentialConfig.wrongUsername, credentialConfig.wrongPassword);

    await loginPage.verifyErrorMessage('Username and password do not match any user in this service');
});

test('User should unable to Login with empty fields and verify the “Username is required” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await navigateUrl(page, commonConfig.baseUrl);
    await loginPage.login('', credentialConfig.password);

    await loginPage.verifyErrorMessage('Username is required');
});

test('User should be able to Logout and verify the correct URL after logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await navigateUrl(page, commonConfig.baseUrl);
    await loginPage.login(credentialConfig.username, credentialConfig.password);

    await loginPage.logout();

    await verifyUrl(page, `${commonConfig.baseUrl}/`);
});