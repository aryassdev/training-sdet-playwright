import { test, expect, type Page } from "@playwright/test";
import { cartSelectors } from "../selectors/cartSelectors";
import { SharedSelectors } from "../selectors/sharedSelectors";

export class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get itemName() { return this.page.locator(SharedSelectors.itemName); }

    get openCartButton() { return this.page.locator(cartSelectors.openCartButton); }
    get cartBadge() { return this.page.locator(cartSelectors.cartBadge); }

    async addItemsToCart(minItemsCount: number = 1, maxItemsCount: number = 1) {
        return await test.step('Add random items to cart', async () => {
            const randomCount = Math.floor(Math.random() * (maxItemsCount - minItemsCount + 1)) + minItemsCount; // Random number between 2 and 6
            const addedItemNames: string[] = [];

            for (let i = 0; i < randomCount; i++) {
                const index = Math.floor(Math.random() * randomCount); // Random index within the selected count

                const itemName = await this.page.locator(SharedSelectors.itemName).nth(index).textContent();
                const addToCartButton = this.page.locator(cartSelectors.addToCartButton(itemName!));

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
            await this.page.locator(cartSelectors.removeFromCartButton(removedItemName!)).click();

            const updatedItems = itemNames.filter(name => name !== removedItemName);

            return updatedItems;
        });
    };

    async openCart() {
        await test.step('Open the cart page', async () => {
            await this.openCartButton.click();
        });
    }
    
    async checkOut() {
        await test.step('Proceed to checkout', async () => {
            await this.page.getByRole(cartSelectors.checkOutButton.role, { name: cartSelectors.checkOutButton.name }).click();
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
            const cartItems = await this.itemName.allTextContents();
            
            expect(cartItems).toEqual(expectedItems);
        });
    }
}