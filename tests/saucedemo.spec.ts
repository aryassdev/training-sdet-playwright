import { test, expect} from '@playwright/test';

test('user can log in to saucedemo', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="login-container"] [data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-container"] [data-test="login-button"]').click();

    await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});

test('user cannot log in with invalid credentials', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.locator('[data-test="login-container"] [data-test="username"]').fill('wrong_user');
    await page.locator('[data-test="login-container"] [data-test="password"]').fill('wrong_password');
    await page.locator('[data-test="login-container"] [data-test="login-button"]').click();

    await expect(page.locator('[data-test="login-container"] [data-test="error"]')).toContainText('Username and password do not match any user in this service');
});

test('user cannot log in with empty username', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    
    await page.locator('[data-test="login-container"] [data-test="username"]').fill('');
    await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-container"] [data-test="login-button"]').click();

    await expect(page.locator('[data-test="login-container"] [data-test="error"]')).toContainText('Username is required');
});

test('user can log out', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');

    await page.locator('[data-test="login-container"] [data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-container"] [data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-container"] [data-test="login-button"]').click();
    
    await page.locator('#menu_button_container #react-burger-menu-btn').click();
    await page.locator('#menu_button_container [data-test="logout-sidebar-link"]').click();
    
    await expect(page).toHaveURL('https://www.saucedemo.com/');
});