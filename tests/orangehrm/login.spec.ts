import { test } from '@playwright/test';
import { LoginPage } from '../../resources/orangehrm/pages/loginPage';
import { commonConfig } from '../../config/orangehrm/common';
import { credentialConfig } from '../../config/orangehrm/credentials';

test('User should be able to Login with valid credentials and verify the correct URL after logged in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(`${commonConfig.baseUrl}/auth/login`);

    await loginPage.login(credentialConfig.username, credentialConfig.password);

    await loginPage.verifyUrl(`${commonConfig.baseUrl}/dashboard/index`);
});

test('User should unable to Login with invalid credentials and verify the “Invalid credentials” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(`${commonConfig.baseUrl}/auth/login`);

    await loginPage.login(credentialConfig.wrongUsername, credentialConfig.wrongPassword);

    await loginPage.verifyErrorInformation('Invalid credentials');
})

test('User should unable to Login with empty fields and verify the “required” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(`${commonConfig.baseUrl}/auth/login`);

    await loginPage.login('', '');

    await loginPage.verifyErrorMessage('Required');
});

test('User should be able to Logout and verify the correct URL after logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate(`${commonConfig.baseUrl}/auth/login`);

    await loginPage.login(credentialConfig.username, credentialConfig.password);

    await loginPage.logout();

    await loginPage.verifyUrl(`${commonConfig.baseUrl}/auth/login`);
});
