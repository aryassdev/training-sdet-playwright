import { test, type Page } from "@playwright/test";
import { checkoutSelectors } from "../selectors/checkoutSelectors";

export class CheckoutInformationPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get firstnameInput() { return this.page.locator(checkoutSelectors.firstnameInput); }
    get lastnameInput() { return this.page.locator(checkoutSelectors.lastnameInput); }
    get postalCodeInput() { return this.page.locator(checkoutSelectors.postalCodeInput); }
    get continueButton() { return this.page.getByRole(checkoutSelectors.continueButton.role, { name: checkoutSelectors.continueButton.name }); }

    async addCheckoutDetails(firstName: string, lastName: string, postalCode: string) {
        await test.step('Input checkout detals', async () => {
            await this.firstnameInput.fill(firstName);
            await this.lastnameInput.fill(lastName);
            await this.postalCodeInput.fill(postalCode);
        });

        await test.step('Click continue button', async () => {
            await this.continueButton.click();
        });
    }
}