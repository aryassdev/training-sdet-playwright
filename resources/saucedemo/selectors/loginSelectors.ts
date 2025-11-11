export const loginSelectors = {
    usernameInput: { role: 'textbox' as const, name: 'Username'},
    passwordInput: { role: 'textbox' as const, name: 'Password'},
    loginButton: { role: 'button' as const, name: 'Login' },
    logoutButton: '[data-test="logout-sidebar-link"]',
    errorMessage: '[data-test="error"]',
    burgerMenuButton: '#react-burger-menu-btn'
};