export const cartSelectors = {
    addToCartButton: (name: string) => `button[data-test="add-to-cart-${name?.toLowerCase().replace(/ /g, '-')}"]`,
    removeFromCartButton: (name: string) => `button[data-test="remove-${name?.toLowerCase().replace(/ /g, '-')}"]`,

    openCartButton: '[data-test="shopping-cart-link"]',
    cartBadge: '[data-test="shopping-cart-badge"]',

    checkOutButton: { role: 'button' as const, name: 'Checkout' },
};