import { test, expect, type Page } from "@playwright/test";
import { loginPageSelectors } from "../selectors/loginSelectors";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput() { return this.page.locator(loginPageSelectors.usernameInput); }
    get passwordInput() { return this.page.locator(loginPageSelectors.passwordInput); }
    get loginButton() { return this.page.locator(loginPageSelectors.loginButton); }
    get errorMessage() { return this.page.locator(loginPageSelectors.errorMessage); }

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
            await this.page.locator('#react-burger-menu-btn').click();
            await this.page.locator('[data-test="logout-sidebar-link"]').click();
        });
    }

    async navigate() {
        await test.step('Navigate to Login Page', async () => {
            await this.page.goto('https://www.saucedemo.com/');
        });
    }

    async verifyUrl(expectedUrl: string) {
        await test.step(`Verify URL is ${expectedUrl}`, async () => {
            await this.page.waitForURL(expectedUrl);

            expect(this.page).toHaveURL(expectedUrl);
        });
    }

    async verifyErrorMessage(expectedErrorMessage: string) {
        await test.step(`Verify error message is "${expectedErrorMessage}"`, async () => {
            const errorLocator = this.errorMessage;
            await errorLocator.waitFor();

            expect(errorLocator).toContainText(expectedErrorMessage);
        });
    }
}
