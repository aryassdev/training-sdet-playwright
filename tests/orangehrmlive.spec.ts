import { test, expect } from '@playwright/test';

test('user can log in to orangehrmlive', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await expect(page.url()).toBe('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
});

test('user can not login to orangehrmlive with invalid credentials', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('some_user');
    await page.locator('input[name="password"]').fill('some_password');
    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-alert-content--error .oxd-alert-content-text')).toHaveText('Invalid credentials');
})

test('user can not login with empty credentials', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('');
    await page.locator('input[name="password"]').fill('');

    await page.locator('button[type="submit"]').click();

    await expect(page.locator('.oxd-input-group__message').nth(0)) .toHaveText('Required');
    await expect(page.locator('.oxd-input-group__message').nth(1)) .toHaveText('Required');
});

test('user can log out from orangehrmlive', async ({ page }) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');

    await page.locator('input[name="username"]').fill('Admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('button[type="submit"]').click();

    await page.locator('.oxd-userdropdown-tab .oxd-userdropdown-name').click();
    await page.locator('a[href="/web/index.php/auth/logout"]').click();

    await expect(page.url()).toBe('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
});
