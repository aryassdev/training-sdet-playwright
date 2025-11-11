import { test, expect, type Page } from "@playwright/test";
import { sortingSelectors } from "../selectors/sortingSelectors";
import { SharedSelectors } from "../selectors/sharedSelectors";

export class SortingPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    get itemName() { return this.page.locator(SharedSelectors.itemName); }
    get itemPrice() { return this.page.locator(SharedSelectors.itemPrice); }
    get sortingOptions() { return this.page.locator(sortingSelectors.sortingOptions); }

    async selectSortingOption(sortingValue: string, sortingLabel: string): Promise<void> {
        await test.step(`Select ${sortingLabel} sorting option`, async (): Promise<void> => {
            await this.sortingOptions.selectOption(sortingValue)
        });
    }

    async getItemNames(sortOrder?: string): Promise<string[]> {
        return await test.step('Get list of item names, and optionally sort them', async (): Promise<string[]> => {
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

    async getItemPrices(sortOrder?: string): Promise<string[]> {
        return await test.step('Get list of item prices, and optionally sort them', async (): Promise<string[]> => {
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

    async verifyEqual(expectedItem: string[], actualItem: string[]): Promise<void> {
        await test.step('Verify content is equal', async (): Promise<void> => {
            expect(actualItem).toEqual(expectedItem)
        });
    }
}