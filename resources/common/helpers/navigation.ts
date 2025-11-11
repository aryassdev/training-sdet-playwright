import { test, expect, type Page } from "@playwright/test";

export async function navigateUrl(page: Page, url: string) {
    await test.step(`Navigate to ${url}`, async () => {
        await page.goto(url);
    });
}
    
export async function verifyUrl(page: Page, expectedUrl: string) {
    await test.step(`Verify URL is ${expectedUrl}`, async () => {
        await page.waitForURL(expectedUrl);
        await page.waitForLoadState('domcontentloaded');
        
        const currentUrl = page.url();
        
        expect(currentUrl).not.toBe('');
        expect(currentUrl).toBe(expectedUrl);
    });
}