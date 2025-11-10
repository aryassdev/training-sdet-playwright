import { test } from '@playwright/test';
import { LoginPage } from '../../resources/orangehrm/pages/loginPage';

test('User should be able to Login with valid credentials and verify the correct URL after logged in', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('Admin', 'admin123');

    await loginPage.verifyUrl('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
});

test('User should unable to Login with invalid credentials and verify the “Invalid credentials” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('some_user', 'some_password');

    await loginPage.verifyErrorInformation('Invalid credentials');
})

test('User should unable to Login with empty fields and verify the “required” message appears', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('', '');

    await loginPage.verifyErrorMessage('Required');
});

test('User should be able to Logout and verify the correct URL after logged out', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();

    await loginPage.login('Admin', 'admin123');

    await loginPage.logout();

    await loginPage.verifyUrl('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
});
