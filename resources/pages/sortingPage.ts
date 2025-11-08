import test, { expect, type Page } from "@playwright/test";
import { sortingPageSelectors } from "../selectors/sortingSelectors";

export class SortingPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get itemName() { return this.page.locator(sortingPageSelectors.itemName); }
    get itemPrice() { return this.page.locator(sortingPageSelectors.itemPrice); }
    get sortingOptions() { return this.page.locator(sortingPageSelectors.sortingOptions); }

    async selectSortingOption(sortingValue: string, sortingLabel: string) {
        await test.step(`Select ${sortingLabel} sorting option`, async () => {
            await this.sortingOptions.selectOption(sortingValue)
        });
    }

    async getItemNames(sortOrder?: string) {
        return await test.step('Get list of item names, and optionally sort them', async () => {
            const itemNames = await this.itemName.allTextContents();

            switch (sortOrder) {
                case 'asc':
                    return [...itemNames].sort();
                case 'desc':
                    return [...itemNames].sort().reverse();
                default:
                    return itemNames;
            }
        });
    }

    async getItemPrices(sortOrder?: string) {
        return await test.step('Get list of item prices, and optionally sort them', async () => {
            const itemPrices = await this.itemPrice.allTextContents();

            switch (sortOrder) {
                case 'asc':
                    return itemPrices
                        .map(price => parseFloat(price.replace('$', '')))
                        .sort((a, b) => a - b)
                        .map(price => `$${price.toFixed(2)}`);
                case 'desc':
                    return itemPrices
                        .map(price => parseFloat(price.replace('$', '')))
                        .sort((a, b) => a - b)
                        .reverse()
                        .map(price => `$${price.toFixed(2)}`);
                default:
                    return itemPrices
            }
        });
    }

    async verifyEqual(expectedItem: string[], actualItem: string[]) {
        await test.step('Verify content is equal', async () => {
            expect(actualItem).toEqual(expectedItem)
        });
    }
}