import { test, expect, type Page } from "@playwright/test";
import { checkoutSelectors } from "../selectors/checkoutSelectors";
import { SharedSelectors } from "../selectors/sharedSelectors";

export class CheckoutOverviewPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get itemQuantity() { return this.page.locator(checkoutSelectors.itemQuantity); }
    get itemPrice() { return this.page.locator(SharedSelectors.itemPrice); }
    get totalPrice() { return this.page.locator(checkoutSelectors.totalPrice); }
    get finishButton() { return this.page.getByRole(checkoutSelectors.finishButton.role, { name: checkoutSelectors.finishButton.name }); }

    async getTotalPrice(): Promise<string> {
        return await test.step('Get total prices of items', async (): Promise<string> => {
            const itemPrices = await this.itemPrice.allTextContents();
            const totalPrices = itemPrices
                .map(price => parseFloat(price.replace('$', '')))
                .reduce((sum, price) => sum + price, 0);

            return `$${totalPrices.toFixed(2)}`;
        });
    }

    async getItemQuantities(): Promise<string[]> {
        return await test.step('Get list of item quantities', async (): Promise<string[]> => {
            const itemQuantities = await this.itemQuantity.allTextContents();
            return itemQuantities;
        });
    }

    async finishCheckout(): Promise<void> {
        await test.step('Click finish button', async (): Promise<void> => {
            await this.finishButton.click();
        });
    }
    async verifyCartItemQuantities(expectedQuantity: string[]): Promise<void> {
        await test.step('Verify cart items quantity', async (): Promise<void> => {
            const itemQuantities = await this.itemQuantity.allTextContents();

            expect(itemQuantities).toEqual(expectedQuantity);
        });
    }

    async verifyTotalPrice(expectedTotal: string): Promise<void> {
        await test.step('Verify total price', async (): Promise<void> => {
            const totalPrice = await this.totalPrice.textContent();

            expect(totalPrice).toContain(expectedTotal);
        });
    }
}