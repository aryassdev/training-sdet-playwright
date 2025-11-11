import { test, expect, type Page } from "@playwright/test";
import { loginSelectors } from "../selectors/loginSelectors";

export class LoginPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get usernameInput() { return this.page.getByRole(loginSelectors.usernameInput.role, { name: loginSelectors.usernameInput.name }); }
    get passwordInput() { return this.page.getByRole(loginSelectors.passwordInput.role, { name: loginSelectors.passwordInput.name }); }
    get loginButton() { return this.page.getByRole(loginSelectors.loginButton.role, { name: loginSelectors.loginButton.name }); }
    get logoutButton() { return this.page.locator(loginSelectors.logoutButton); }
    get errorMessage() { return this.page.locator(loginSelectors.errorMessage); }
    get burgerMenuButton() { return this.page.locator(loginSelectors.burgerMenuButton); }

    async login(username: string, password: string): Promise<void> {
        await test.step('Input username and password', async (): Promise<void> => {
            await this.usernameInput.fill(username);
            await this.passwordInput.fill(password);
        });

        await test.step('Click login button', async (): Promise<void> => {
            await this.loginButton.click();
        });
    }

    async logout(): Promise<void> {
        await test.step('Logout from the site', async (): Promise<void> => {
            await this.burgerMenuButton.click();
            await this.logoutButton.click();
        });
    }

    async verifyErrorMessage(expectedErrorMessage: string): Promise<void> {
        await test.step(`Verify error message is "${expectedErrorMessage}"`, async (): Promise<void> => {
            const errorLocator = this.errorMessage;
            await errorLocator.waitFor({ state: 'visible' });

            const actualError = await errorLocator.textContent();

            expect(actualError?.trim()).not.toBe('');
            expect(actualError).toContain(expectedErrorMessage);
        });
    }
}
