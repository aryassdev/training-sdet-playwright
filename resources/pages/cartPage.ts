import test, { expect, type Page } from "@playwright/test";
import { cartPageSelectors } from "../selectors/cartSelectors";

export class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get inventoryItemName() { return this.page.locator(cartPageSelectors.inventoryItemName); }

    get openCartButton() { return this.page.locator(cartPageSelectors.openCartButton); }
    get cartBadge() { return this.page.locator(cartPageSelectors.cartBadge); }

    async addItemsToCart(minItemsCount: number = 1, maxItemsCount: number = 1) {
        return await test.step('Add random items to cart', async () => {
            const randomCount = Math.floor(Math.random() * (maxItemsCount - minItemsCount + 1)) + minItemsCount; // Random number between 2 and 6
            const addedItemNames: string[] = [];

            for (let i = 0; i < randomCount; i++) {
                const itemName = await this.page.locator(cartPageSelectors.inventoryItemName).nth(i).textContent();
                const addToCartButton = this.page.locator(cartPageSelectors.addToCartButton(itemName!));

                if (await addToCartButton.count() === 0) {
                    i--;
                    continue; // Retry if button not found
                }
                await addToCartButton.click();
                if (itemName) {
                    addedItemNames.push(itemName);
                }
            }

            return addedItemNames;
        });
    }

    async removeItemFromCart(itemIndex: number, itemNames: string[]) {
        return await test.step(`Remove item from cart`, async () => {
            const removedItemName = itemNames[itemIndex];
            await this.page.locator(cartPageSelectors.removeFromCartButton(removedItemName!)).click();

            const updatedItems = itemNames.filter(name => name !== removedItemName);

            return updatedItems;
        });
    };

    async openCart() {
        await test.step('Open the cart page', async () => {
            await this.openCartButton.click();
        });
    }

    async verifyCartItemCount(expectedCount: number) {
        await test.step('Verify cart count', async () => {
            await this.cartBadge.waitFor({ state: 'visible' });

            const cartCount = await this.cartBadge.textContent();

            expect(cartCount).toBe(expectedCount.toString());
        });
    }

    async verifyCartEmpty() {
        await test.step('Verify cart is empty', async () => {
            const cartItemsCount = await this.cartBadge.count();
            
            expect(cartItemsCount).toBe(0);
        });
    }

    async verifyCartItems(expectedItems: string[]) {
        await test.step('Verify cart items', async () => {
            const cartItems = await this.inventoryItemName.allTextContents();
            
            expect(cartItems).toEqual(expectedItems);
        });
    }
}