import { test, expect, type Page } from "@playwright/test";
import { loginSelectors } from "../selectors/loginSelectors";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput() { return this.page.locator(loginSelectors.usernameInput); }
    get passwordInput() { return this.page.locator(loginSelectors.passwordInput); }
    get loginButton() { return this.page.locator(loginSelectors.loginButton); }
    get logoutButton() { return this.page.locator(loginSelectors.logoutButton); }
    get errorMessage() { return this.page.locator(loginSelectors.errorMessage); }
    get burgerMenuButton() { return this.page.locator(loginSelectors.burgerMenuButton); }

    async login(username: string, password: string) {
        await test.step('Input username and password', async () => {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
        });

        await test.step('Click login button', async () => {
            await this.loginButton.click();
        });
    }

    async logout() {
        await test.step('Logout from the site', async () => {
            await this.burgerMenuButton.click();
            await this.logoutButton.click();
        });
    }

    async navigate(url: string) {
        await test.step(`Navigate to ${url}`, async () => {
            await this.page.goto(url);
        });
    }

    async verifyUrl(expectedUrl: string) {
        await test.step(`Verify URL is ${expectedUrl}`, async () => {
            await this.page.waitForURL(expectedUrl);
            await this.page.waitForLoadState('domcontentloaded');

            const currentUrl = this.page.url();

            expect(currentUrl).not.toBe('');
            expect(currentUrl).toBe(expectedUrl);
        });
    }

    async verifyErrorMessage(expectedErrorMessage: string) {
        await test.step(`Verify error message is "${expectedErrorMessage}"`, async () => {
            const errorLocator = this.errorMessage;
            await errorLocator.waitFor({ state: 'visible' });

            const actualError = await errorLocator.textContent();

            expect(actualError?.trim()).not.toBe('');
            expect(actualError).toContain(expectedErrorMessage);
        });
    }
}
