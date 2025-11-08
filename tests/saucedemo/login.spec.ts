import { test } from '@playwright/test';
import { LoginPage } from '../../resources/saucedemo/pages/loginPage';

test('User should be able to Login with valid credentials and verify the correct URL after logged in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');

    await loginPage.verifyUrl('https://www.saucedemo.com/inventory.html');
});

test('User should unable to Login with invalid credentials and verify the “Username and password do not match any user in this service” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('wrong_user', 'wrong_password');

    await loginPage.verifyErrorMessage('Username and password do not match any user in this service');
});

test('User should unable to Login with empty fields and verify the “Username is required” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('', 'secret_sauce');

    await loginPage.verifyErrorMessage('Username is required');
});

test('User should be able to Logout and verify the correct URL after logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    
    await loginPage.navigate();
    await loginPage.login('standard_user', 'secret_sauce');
    
    await loginPage.logout();

    await loginPage.verifyUrl('https://www.saucedemo.com/');
});