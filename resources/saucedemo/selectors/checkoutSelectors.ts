export const checkoutSelectors = {
    firstnameInput: '[data-test="firstName"]',
    lastnameInput: '[data-test="lastName"]',
    postalCodeInput: '[data-test="postalCode"]',

    continueButton: { role: 'button' as const, name: 'Continue' },
    finishButton: { role: 'button' as const, name: 'Finish' },
    backHomeButton: { role: 'button' as const, name: 'Back Home' },

    itemQuantity: '[data-test="item-quantity"]',
    totalPrice: '[data-test="subtotal-label"]',

    orderMessage: { role: 'heading' as const, name: 'Thank you for your order!' },
};