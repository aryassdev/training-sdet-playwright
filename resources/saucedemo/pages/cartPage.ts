import { test, expect, type Page, Locator } from "@playwright/test";
import { cartSelectors } from "../selectors/cartSelectors";
import { SharedSelectors } from "../selectors/sharedSelectors";

export class CartPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get itemName(): Locator { return this.page.locator(SharedSelectors.itemName); }

    get openCartButton(): Locator { return this.page.locator(cartSelectors.openCartButton); }
    get cartBadge(): Locator { return this.page.locator(cartSelectors.cartBadge); }
    get checkoutButton(): Locator { return this.page.getByRole(cartSelectors.checkOutButton.role, { name: cartSelectors.checkOutButton.name }); }

    private addToCartButton(itemName: string): Locator {
        return this.page.locator(cartSelectors.addToCartButton(itemName));
    }

    private removeFromCartButton(itemName: string): Locator {
        return this.page.locator(cartSelectors.removeFromCartButton(itemName));
    }

    private itemNameAt(index: number): Locator {
        return this.page.locator(SharedSelectors.itemName).nth(index)
    }

    async addItemsToCart(minItemsCount: number = 1, maxItemsCount: number = 1): Promise<string[]> {
        return await test.step('Add random items to cart', async (): Promise<string[]> => {
            const randomCount = Math.floor(Math.random() * (maxItemsCount - minItemsCount + 1)) + minItemsCount; // Random number between 2 and 6
            const addedItemNames: string[] = [];

            for (let i = 0; i < randomCount; i++) {
                const index = Math.floor(Math.random() * randomCount); // Random index within the selected count

                const itemName = await this.itemNameAt(index).textContent();
                const addToCartButton = this.addToCartButton(itemName!);

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

    async removeItemFromCart(itemIndex: number, itemNames: string[]): Promise<string[]> {
        return await test.step(`Remove item from cart`, async (): Promise<string[]> => {
            const removedItemName = itemNames[itemIndex];
            await this.removeFromCartButton(removedItemName).click();

            const updatedItems = itemNames.filter(name => name !== removedItemName);

            return updatedItems;
        });
    };

    async openCart(): Promise<void> {
        await test.step('Open the cart page', async (): Promise<void> => {
            await this.openCartButton.click();
        });
    }

    async checkOut(): Promise<void> {
        await test.step('Proceed to checkout', async (): Promise<void> => {
            await this.checkoutButton.click();
        });
    }

    async verifyCartItemCount(expectedCount: number): Promise<void> {
        await test.step('Verify cart count', async (): Promise<void> => {
            await this.cartBadge.waitFor({ state: 'visible' });

            const cartCount = await this.cartBadge.textContent();

            expect(cartCount).toBe(expectedCount.toString());
        });
    }

    async verifyCartEmpty(): Promise<void> {
        await test.step('Verify cart is empty', async (): Promise<void> => {
            const cartItemsCount = await this.cartBadge.count();
            
            expect(cartItemsCount).toBe(0);
        });
    }

    async verifyCartItems(expectedItems: string[]): Promise<void> {
        await test.step('Verify cart items', async (): Promise<void> => {
            const cartItems = await this.itemName.allTextContents();
            
            expect(cartItems).toEqual(expectedItems);
        });
    }
}