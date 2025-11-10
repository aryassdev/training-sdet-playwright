import test, { expect, type Page } from "@playwright/test";
import { loginPageSelectors } from "../selectors/loginSelectors";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput() { return this.page.locator(loginPageSelectors.usernameInput); }
    get passwordInput() { return this.page.locator(loginPageSelectors.passwordInput); }
    get dropdownMenu() { return this.page.locator(loginPageSelectors.dropdownMenu); }
    get loginButton() { return this.page.locator(loginPageSelectors.loginButton); }
    get logoutButton() { return this.page.locator(loginPageSelectors.logoutButton); }
    get errorMessage() { return this.page.locator(loginPageSelectors.errorMessage); }
    get errorInformation() { return this.page.locator(loginPageSelectors.errorInformation); }

    async navigate() {
        await test.step('Navigate to Login Page', async () => {
            await this.page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
        });
    }

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
            await this.dropdownMenu.click();
            await this.logoutButton.click();
        });
    }

    async verifyUrl(expectedUrl: string) {
        await this.page.waitForURL(expectedUrl);
        await this.page.waitForLoadState('domcontentloaded');

        const currentUrl = this.page.url();

        expect(currentUrl).not.toBe('');
        expect(currentUrl).toBe(expectedUrl);
    }

    async verifyErrorMessage(expectedErrorMessage: string) {
        await test.step(`Verify error message is "${expectedErrorMessage}"`, async () => {
            const errorLocator = this.errorMessage;
            const errorCount = await errorLocator.count();

            for (let i = 0; i < errorCount; i++) {
                await errorLocator.nth(i).waitFor({ state: 'visible' });
                const actualError = await errorLocator.nth(i).textContent();
                
                expect(actualError).not.toBe('');
                await expect(errorLocator.nth(i)).toHaveText(expectedErrorMessage);
            }
        });
    }

    async verifyErrorInformation(expectedErrorInformation: string) {
        await test.step(`Verify error information is "${expectedErrorInformation}"`, async () => {
            const errorLocator = this.errorInformation;
            await errorLocator.waitFor({ state: 'visible' });

            const actualError = await errorLocator.textContent();

            expect(actualError).not.toBe('');
            await expect(errorLocator).toHaveText(expectedErrorInformation);
        });
    }
}