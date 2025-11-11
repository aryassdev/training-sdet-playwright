import test, { expect, type Page } from "@playwright/test";
import { checkoutSelectors } from "../selectors/checkoutSelectors";

export class CheckoutCompletePage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get orderMessage() { return this.page.getByRole(checkoutSelectors.orderMessage.role, { name: checkoutSelectors.orderMessage.name }); }
    get backHomeButton() { return this.page.getByRole(checkoutSelectors.backHomeButton.role, { name: checkoutSelectors.backHomeButton.name }); }

    async verifyOrderCompletion(message: string): Promise<void> {
        test.step(`Verify order completion with message: ${message}`, async (): Promise<void> => {
            await this.orderMessage.waitFor({ state: 'visible' });
    
            await expect(this.orderMessage).toBeVisible();
            await expect(this.orderMessage).toHaveText(message);
        });
    }

    async backToHome(): Promise<void> {
        test.step('Navigate back to home page from order completion page', async (): Promise<void> => {
            await this.backHomeButton.click();
        });
    }
}