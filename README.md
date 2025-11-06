# Training SDET Playwright

A Playwright-based automated testing project for practicing SDET skills. This project contains end-to-end tests for web applications.

## Installation

### Prerequisites
- Node.js (version 24 or higher)
- npm package manager

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/aryassdev/training-sdet-playwright.git
   cd training-sdet-playwright
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Setup

### Configuration
The project is configured via `playwright.config.ts` with the following settings:
- **Test Directory**: `./tests`
- **Browsers**: Chromium and Firefox
- **Parallel Execution**: Enabled
- **Retries**: 2 retries on CI, 0 locally
- **Reporter**: HTML report
- **Trace**: Captured on first retry

### Environment Variables
Currently, the project doesn't require environment variables. If needed in the future, uncomment the dotenv configuration in `playwright.config.ts`.

## Running Tests

### Run all tests:
```bash
npx playwright test
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests in a specific browser:
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### Run a specific test file:
```bash
npx playwright test tests/saucedemo.spec.ts
```

### Run tests in debug mode:
```bash
npx playwright test --debug
```
### Run using UI
```bash
npx playwright test --ui
```

### View HTML report:
```bash
npx playwright show-report
```

## Changelog

For a detailed history of changes and releases, see [CHANGELOG.md](./CHANGELOG.md).