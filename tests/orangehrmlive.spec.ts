import { test, expect } from '@playwright/test';

test('User should be able to Login with valid credentials and verify the correct URL after logged in', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
});

test('User should unable to Login with invalid credentials and verify the “Invalid credentials” message appears', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('some_user');
    await page.locator('input[name="password"]').fill('some_password');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-alert-content-text')).toHaveText('Invalid credentials');
})

test('User should unable to Login with empty fields and verify the “required” message appears', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('');
    await page.locator('input[name="password"]').fill('');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-input-group__message').nth(0)).toHaveText('Required');
    await expect(page.locator('.oxd-input-group__message').nth(1)).toHaveText('Required');
});

test('User should be able to Logout and verify the correct URL after logged out', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await page.locator('.oxd-userdropdown-tab .oxd-userdropdown-name').click();
    await page.locator('a[href="/web/index.php/auth/logout"]').click();

    await expect(page).toHaveURL('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
});
