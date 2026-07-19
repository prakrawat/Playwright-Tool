# Playwright Tutorial

## Introduction

### What is Playwright?

**Playwright** is a modern, open-source automation library developed by Microsoft for end-to-end testing and browser automation. It allows developers and QA engineers to write automated tests that interact with web applications just like a real user would.

**Definition:** Playwright is a Node.js library that provides a high-level API to control browsers over the DevTools Protocol. It supports three major browser engines: Chromium, Firefox, and WebKit.

### Why Use Playwright?

Playwright addresses common challenges in web automation:
- **Cross-browser testing** - Test on Chromium, Firefox, and Safari simultaneously
- **Fast execution** - Tests run significantly faster than traditional tools like Selenium
- **Reliable** - Built-in waits eliminate flaky tests caused by timing issues
- **Multi-page support** - Handle multiple tabs, windows, and context scenarios easily
- **Network control** - Mock API responses, intercept requests, and simulate network conditions
- **Debugging** - Powerful debugging tools including UI mode, trace viewer, and inspector

### Common Use Cases

1. **End-to-End Testing** - Verify complete user workflows across your application
2. **Visual Regression Testing** - Compare screenshots to detect unintended UI changes
3. **Performance Testing** - Monitor page load times and performance metrics
4. **API Testing** - Intercept and mock API calls during tests
5. **Web Scraping** - Extract data from websites programmatically

## Table of Contents

1. [Installation](#installation)
2. [Key Concepts](#key-concepts)
3. [Getting Started](#getting-started)
4. [Basic Navigation](#basic-navigation)
5. [Selectors and Locators](#selectors-and-locators)
6. [User Interactions](#user-interactions)
7. [Assertions and Waiting](#assertions-and-waiting)
8. [Test Organization](#test-organization)
9. [Advanced Techniques](#advanced-techniques)
10. [Best Practices](#best-practices)
11. [Configuration](#configuration)

## Key Concepts

Before diving into the practical guide, let's understand the fundamental concepts:

### Browser, Context, and Page

**Browser**
- **Definition:** A Playwright object that represents an instance of a browser engine (Chrome, Firefox, or Safari)
- **Purpose:** Manages browser-level settings, and can create multiple contexts
- **Example Use:** Starting an automated browser instance

```javascript
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
// Browser is now running
```

**Context**
- **Definition:** An isolated environment within a browser instance, similar to an "incognito window"
- **Purpose:** Allows testing with multiple user sessions, cookies, and storage without interference
- **Example Use:** Testing two users logged in simultaneously

```javascript
const context1 = await browser.newContext();
const context2 = await browser.newContext();
// Each context has separate cookies, localStorage, sessionStorage
```

**Page**
- **Definition:** A tab or window within a context that you interact with
- **Purpose:** The main object you use to perform actions like navigation, clicks, and assertions
- **Example Use:** Navigating to URLs and interacting with elements

```javascript
const page = await context.newPage();
await page.goto('https://example.com');
```

### Locator

**Definition:** A way to find and interact with elements on a page. Locators are the foundation of element selection in Playwright.

**Why Locators?** Unlike other tools that return elements directly, Playwright locators are "lazy" - they don't fetch elements until they're actually used. This makes tests more resilient to DOM changes.

```javascript
// These locators are defined but not executed yet
const submitButton = page.getByRole('button', { name: 'Submit' });
const usernameInput = page.getByLabel('Username');

// Only when we interact with them are elements located
await submitButton.click(); // Now the locator finds the element
```

### Assertion

**Definition:** A statement that verifies an expected condition is true. If the assertion fails, the test stops and reports a failure.

**Purpose:** Assertions validate that your application behaves as expected.

```javascript
// This assertion checks that the button is visible
// If it's not visible, the test fails
await expect(page.locator('button')).toBeVisible();
```

### Wait (Auto-waiting)

**Definition:** Playwright automatically waits for elements and conditions before taking action. This eliminates the need for manual sleep/timeout calls.

**Types:**
- **Implicit waits** - Automatically wait for elements to be ready (default behavior)
- **Explicit waits** - Manually wait for specific conditions

- Auto-waiting in Playwright is a feature that automatically waits for elements to be ready before interacting with them. This ensures your test scripts are stable, reliable, and free from common timing issues.

Example:
- await page.click(‘button#submit’);
- You do not need to manually add waits like waitForSelector or setTimeout. Playwright will automatically wait for the button to become stable and clickable.



```javascript
// Implicit wait - automatically waits up to 30s for element
await page.locator('button').click();

// Explicit wait - manually wait for specific condition
await page.waitForLoadState('networkidle');
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### What You'll Learn

Installing Playwright sets up the testing framework and browser binaries needed to run your tests. Unlike other tools that rely on system-installed browsers, Playwright downloads and manages its own browser versions to ensure consistency.

### Setup Steps

```bash
# Step 1: Initialize a new npm project (if needed)
npm init -y

# Step 2: Install Playwright as a dev dependency
# The -D flag means it's only installed for development
npm install -D @playwright/test

# Step 3: Download browser binaries
# This installs Chromium, Firefox, and WebKit
# Takes a few minutes on first install
npx playwright install

# Optional: Install specific browser only
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### Verify Installation

```bash
# Check if Playwright is installed
npm list @playwright/test

# Check if browsers are installed
npx playwright install --with-deps

# Test that everything works
npx playwright --version
```

### Project Structure

After installation, your project should look like:

```
project/
├── node_modules/          # Dependencies
├── tests/                 # Your test files
│   └── example.spec.js
├── playwright.config.js   # Configuration
├── package.json
└── package-lock.json
```

## Getting Started

### Understanding Test Structure

**Definition:** A Playwright test is a JavaScript function that uses the Playwright API to interact with a web page and verify expected outcomes.

**Test Anatomy:**
1. **Setup** - Navigate to a page or configure initial state
2. **Action** - Perform user interactions (clicks, typing, etc.)
3. **Assertion** - Verify the expected outcome

### Creating Your First Test

Create a file `tests/example.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

// test() defines a single test case
test('basic test example', async ({ page }) => {
  // SETUP: Navigate to the website
  await page.goto('https://example.com');
  
  // ACTION: Find the page title
  const title = page.locator('title');
  
  // ASSERTION: Verify the title text
  await expect(title).toHaveText('Example Domain');
});
```

**What's Happening:**
- `test()` - Declares a test case with a description
- `async ({ page })` - Receives a `page` object from Playwright's test fixture
- `await page.goto()` - Navigates to a URL and waits for the page to load
- `page.locator()` - Finds elements on the page
- `expect()` - Asserts that a condition is true

### Running Your First Test

```bash
# Run all tests in the tests directory
npx playwright test

# Run a specific test file
npx playwright test tests/example.spec.js

# Run tests in headed mode (see the browser)
npx playwright test --headed

# Run a single test with debug mode (opens inspector)
npx playwright test tests/example.spec.js --debug

# Run with UI mode (interactive)
npx playwright test --ui
```

### Understanding Test Output

When tests run, you'll see output like:

```
Running 1 test using 1 worker
  ✓ [chromium] › tests/example.spec.js:3 › basic test example (2.3s)

1 passed (3.2s)
```

**Output Explanation:**
- `✓` - Test passed
- `[chromium]` - Browser used to run the test
- `tests/example.spec.js:3` - File and line number
- `2.3s` - Time taken to run the test

### Common Test Patterns

**Pattern 1: Testing a User Login Flow**

```javascript
test('user can login successfully', async ({ page }) => {
  // Navigate to login page
  await page.goto('https://myapp.com/login');
  
  // Enter credentials
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  
  // Submit form
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Verify successful login
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

**Pattern 2: Testing a Form Validation**

```javascript
test('form shows validation error for empty email', async ({ page }) => {
  await page.goto('https://myapp.com/signup');
  
  // Try to submit without filling email
  await page.getByRole('button', { name: 'Sign Up' }).click();
  
  // Verify error message appears
  await expect(page.getByText('Email is required')).toBeVisible();
});
```

## Basic Navigation

### Navigation Concepts

**Definition:** Navigation is the process of moving between pages and loading resources. Playwright handles navigation waits automatically.

### Understanding Page Navigation

```javascript
// Most basic navigation
await page.goto('https://example.com');

// Navigation with wait conditions
// waitUntil specifies when goto() should return:
// - 'load': Wait for the load event (default)
// - 'domcontentloaded': Wait for the DOM to be ready
// - 'networkidle': Wait for all network requests to finish
await page.goto('https://example.com', { waitUntil: 'networkidle' });

// Go back in browser history
await page.goBack();

// Go forward in browser history
await page.goForward();

// Reload the current page
await page.reload();

// Close the page
await page.close();
```

### Example: Complete Navigation Flow

```javascript
test('navigate through pages', async ({ page }) => {
  // Navigate to homepage
  await page.goto('https://example.com/');
  console.log('On homepage');
  
  // Navigate to about page
  await page.goto('https://example.com/about');
  console.log('On about page');
  
  // Go back to homepage
  await page.goBack();
  
  // Verify we're back on homepage
  await expect(page).toHaveURL(/.*\/$|.*\/$/);
});
```

### Getting Page Information

```javascript
// Get the current URL
const url = page.url();
console.log('Current URL:', url);

// Get the page title
const title = await page.title();
console.log('Page title:', title);

// Get entire page HTML
const content = await page.content();
console.log('Page HTML:', content.substring(0, 100));

// Get page title element
const titleElement = page.locator('title');

// Example: Verify navigation
test('verify page title changes', async ({ page }) => {
  await page.goto('https://example.com/');
  await expect(page).toHaveTitle(/Example/);
  
  const currentUrl = page.url();
  expect(currentUrl).toContain('example.com');
});
```

## Selectors and Locators

### What Are Locators?

**Definition:** Locators are Playwright's way of finding elements on a page. Unlike traditional selectors that return elements immediately, locators are lazy - they only find elements when you actually use them.

**Why This Matters:** This makes tests more resilient. If an element temporarily disappears and reappears, the locator will wait for it automatically.

### The Locator Priority (Recommended Order)

Playwright recommends using locators in this priority order:

#### 1. Role-Based Locators (BEST)

**Definition:** Find elements by their accessibility role and label. This is the most resilient method because it mirrors how users find elements.

```javascript
// Button by role and text
const submitButton = page.getByRole('button', { name: 'Submit' });

// Input by role
const searchInput = page.getByRole('searchbox');

// Heading by role
const mainHeading = page.getByRole('heading', { level: 1 });

// Link by role
const homeLink = page.getByRole('link', { name: 'Home' });

// Common roles: button, textbox, checkbox, radio, heading, link, etc.

test('role-based locator example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click using role
  await page.getByRole('button', { name: 'Start' }).click();
  
  // Fill input using role
  await page.getByRole('textbox', { name: 'Username' }).fill('john');
});
```

#### 2. Label-Based Locators

**Definition:** Find form inputs by their associated label text. Great for form fields.

```javascript
// Find input by label
const emailInput = page.getByLabel('Email Address');
const passwordInput = page.getByLabel('Password');

// Example HTML:
// <label for="email">Email Address</label>
// <input id="email" type="email" />

test('label-based locator example', async ({ page }) => {
  await page.goto('https://example.com/form');
  
  await page.getByLabel('Email Address').fill('user@example.com');
  await page.getByLabel('Password').fill('secret123');
});
```

#### 3. Placeholder Locators

**Definition:** Find inputs by their placeholder text.

```javascript
// Find by placeholder
const nameInput = page.getByPlaceholder('Enter your name');
const phoneInput = page.getByPlaceholder('Phone number');

test('placeholder-based locator example', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  await page.getByPlaceholder('Enter your name').fill('John Doe');
  await page.getByPlaceholder('Enter your email').fill('john@example.com');
});
```

#### 4. Text-Based Locators

**Definition:** Find elements by their visible text content.

```javascript
// Find button by text
const deleteButton = page.getByText('Delete Account');

// Find heading by text
const title = page.getByText('Welcome to Our App');

// Partial text match using regex
const anyLink = page.getByText(/Sign Up|Register/);

test('text-based locator example', async ({ page }) => {
  await page.goto('https://example.com');
  
  await page.getByText('Create Account').click();
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

#### 5. Test ID Locators

**Definition:** Find elements by a `data-testid` attribute. Good when you can modify HTML.

```javascript
// HTML: <button data-testid="submit-btn">Submit</button>
const submitButton = page.getByTestId('submit-btn');

// HTML: <div data-testid="user-profile">...</div>
const userProfile = page.getByTestId('user-profile');

test('test-id locator example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Requires adding data-testid to your HTML
  await page.getByTestId('login-form').fill('credentials');
});
```

#### 6. CSS Selectors (If Needed)

**Definition:** Traditional CSS selector approach. Use as a fallback.

```javascript
// Class selector
const primaryButton = page.locator('.button-primary');

// ID selector
const submitBtn = page.locator('#submit-btn');

// Attribute selector
const disabledInput = page.locator('input[disabled]');

// Descendant combinator
const containerButton = page.locator('div.container button');

// Combination
const activeMenuItem = page.locator('nav li.active a');

test('css-selector example', async ({ page }) => {
  await page.goto('https://example.com');
  
  await page.locator('#email').fill('user@example.com');
  await page.locator('.login-btn').click();
});
```

#### 7. XPath Selectors (LAST RESORT)

**Definition:** XPath is powerful but fragile. Only use when other options don't work.

```javascript
// XPath that contains text
const button = page.locator('//button[contains(text(), "Click me")]');

// XPath with complex conditions
const row = page.locator('//tr[td[1][text()="John"] and td[2][text()="Doe"]]');

// XPath parent traversal
const parentDiv = page.locator('//input[@name="email"]/../..');

// Example: Use only when necessary
test('xpath example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // XPath find by partial text (when CSS won't work)
  await page.locator('//span[contains(text(), "Next")]').click();
});
```

### Filtering and Chaining Locators

```javascript
// Filter locators by text
const submitButtons = page.locator('button').filter({ hasText: 'Submit' });

// Filter by other conditions
const visibleButtons = page.locator('button').filter({ has: page.locator('.icon') });

// Get first, last, or nth element
const firstButton = page.locator('button').first();
const lastButton = page.locator('button').last();
const thirdButton = page.locator('button').nth(2);

// Count elements
const buttonCount = await page.locator('button').count();

test('filtering example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Find first active tab
  const firstTab = page.locator('[role="tab"]').filter({ has: page.locator('.active') }).first();
  await firstTab.click();
  
  // Get total number of items
  const itemCount = await page.locator('.item').count();
  console.log(`Found ${itemCount} items`);
});
```

### Locator Best Practices

```javascript
// GOOD: Use role-based
await page.getByRole('button', { name: 'Submit' }).click();

// GOOD: Use label for forms
await page.getByLabel('Email').fill('user@example.com');

// AVOID: Brittle XPath
await page.locator('//html/body/div[1]/form/div[3]/input').fill('data');

// AVOID: Complex CSS chains
await page.locator('body > div:nth-child(1) > form > div > input').click();

// GOOD: Test IDs when implementing
await page.getByTestId('user-avatar').click();
```

## User Interactions

### Understanding User Actions

**Definition:** User interactions are the simulated actions a user would perform on a website - clicking buttons, typing text, selecting options, dragging elements, etc.

### Clicking

**Definition:** Simulates a mouse click on an element. Playwright automatically waits for the element to be visible and clickable before clicking.

```javascript
// Simple single click
await page.getByRole('button', { name: 'Submit' }).click();

// Double click (useful for selecting text)
await page.locator('text').dblclick();

// Right click (context menu)
await page.locator('element').click({ button: 'right' });

// Multiple clicks
await page.locator('button').click({ clickCount: 3 });

// Click with delay between actions
await page.locator('button').click({ delay: 100 });

test('clicking example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Single click
  await page.getByRole('button', { name: 'Open Menu' }).click();
  
  // Wait for menu to appear and click menu item
  await page.getByRole('menuitem', { name: 'Settings' }).click();
  
  // Double click on text to select it
  await page.locator('#textarea').dblclick();
});
```

### Typing and Text Input

**Definition:** Simulates a user typing text into an input field or textarea.

```javascript
// Clear field first, then type
await page.getByLabel('Email').clear();
await page.getByLabel('Email').type('user@example.com');

// Or use fill() which automatically clears first
await page.getByLabel('Email').fill('user@example.com');

// Type with delay between each character (simulates realistic typing)
await page.getByLabel('Password').type('secret123', { delay: 50 });

// Select all and delete
await page.getByLabel('Field').focus();
await page.keyboard.press('Control+A');
await page.keyboard.press('Delete');

test('typing example', async ({ page }) => {
  await page.goto('https://example.com/contact');
  
  // Fill form fields
  await page.getByLabel('Name').fill('John Doe');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByPlaceholder('Message').fill('Hello, this is a test message');
  
  // Submit form
  await page.getByRole('button', { name: 'Send' }).click();
});
```

### Working with Forms

**Definition:** Forms are collections of input fields that users fill out. Playwright makes form testing straightforward.

```javascript
// Select option in dropdown
await page.locator('select#country').selectOption('USA');

// Multiple select
await page.locator('select[multiple]').selectOption(['option1', 'option2']);

// Get selected value
const selected = await page.locator('select').inputValue();

// Check checkbox
await page.getByLabel('I agree to terms').check();

// Uncheck checkbox
await page.getByLabel('Remember me').uncheck();

// Get checkbox state
const isChecked = await page.locator('input[type="checkbox"]').isChecked();

// Select radio button
await page.getByLabel('Yes').click();  // Radio buttons work like regular clicks

test('form interaction example', async ({ page }) => {
  await page.goto('https://example.com/signup');
  
  // Text fields
  await page.getByLabel('First Name').fill('John');
  await page.getByLabel('Last Name').fill('Doe');
  
  // Email
  await page.getByLabel('Email').fill('john@example.com');
  
  // Select dropdown
  await page.getByLabel('Country').selectOption('USA');
  
  // Check checkbox
  await page.getByLabel('I agree to the terms').check();
  
  // Select radio
  await page.getByLabel('Newsletter: Yes').click();
  
  // Submit
  await page.getByRole('button', { name: 'Sign Up' }).click();
});
```

### Drag and Drop

**Definition:** Simulate dragging an element from one location to another.

```javascript
// Simple drag and drop
await page.locator('#source').dragTo(page.locator('#target'));

// Drag with custom options
await page.locator('.item').dragTo(page.locator('.trash'), {
  sourcePosition: { x: 10, y: 10 },
  targetPosition: { x: 20, y: 20 }
});

// Manual drag (more control)
await page.locator('#source').hover();
await page.mouse.down();
await page.locator('#target').hover();
await page.mouse.up();

test('drag and drop example', async ({ page }) => {
  await page.goto('https://example.com/kanban');
  
  // Drag task from "To Do" to "Done"
  const taskCard = page.locator('.task', { hasText: 'Complete feature' });
  const doneColumn = page.locator('[data-column="done"]');
  
  await taskCard.dragTo(doneColumn);
  
  // Verify task moved
  await expect(doneColumn.locator('.task', { hasText: 'Complete feature' })).toBeVisible();
});
```

### Keyboard Events

**Definition:** Simulate keyboard input including special keys like Enter, Tab, arrow keys, and modifier keys.

```javascript
// Press single key
await page.keyboard.press('Enter');
await page.keyboard.press('Tab');
await page.keyboard.press('Escape');
await page.keyboard.press('ArrowDown');

// Type multiple keys
await page.keyboard.press('Control+A');  // Select all
await page.keyboard.press('Control+C');  // Copy
await page.keyboard.press('Control+V');  // Paste

// Mac commands
await page.keyboard.press('Meta+A');     // Cmd+A on Mac

// Type text character by character
await page.keyboard.type('Hello World');

// Focus an element then type
await page.getByLabel('Search').focus();
await page.keyboard.type('search term');

test('keyboard interaction example', async ({ page }) => {
  await page.goto('https://example.com/search');
  
  // Click search input and type
  await page.getByPlaceholder('Search').click();
  await page.keyboard.type('playwright');
  
  // Press Enter to search
  await page.keyboard.press('Enter');
  
  // Wait for results
  await expect(page.getByText('Results')).toBeVisible();
});
```

### Hovering Over Elements

**Definition:** Move the mouse cursor over an element without clicking (useful for tooltips and hover menus).

```javascript
// Simple hover
await page.locator('.menu-trigger').hover();

// Hover and wait for element to appear
await page.locator('.trigger').hover();
await expect(page.locator('.submenu')).toBeVisible();

test('hover example', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Hover over user avatar
  await page.locator('.user-avatar').hover();
  
  // Dropdown menu should appear
  await expect(page.getByRole('menu')).toBeVisible();
  
  // Click on profile option
  await page.getByRole('menuitem', { name: 'Profile' }).click();
});
```

## Assertions and Waiting

### Understanding Assertions

**Definition:** An assertion is a statement that checks if a condition is true. If the condition fails, the test stops and reports a failure.

**Why Important:** Assertions are how you verify that your application behaves correctly. Without assertions, your test just clicks buttons but doesn't verify anything happened.

### Common Assertions Explained

```javascript
// VISIBILITY ASSERTIONS
// Check if element is visible
await expect(page.locator('button')).toBeVisible();

// Check if element is hidden/not visible
await expect(page.locator('.hidden-menu')).not.toBeVisible();

// TEXT ASSERTIONS
// Check exact text match
await expect(page.locator('h1')).toHaveText('Welcome');

// Check if text contains substring
await expect(page.locator('p')).toContainText('Hello');

// Use regex for flexible matching
await expect(page.locator('p')).toHaveText(/Welcome|Hi/);

// ATTRIBUTE ASSERTIONS
// Check if element has an attribute
await expect(page.locator('button')).toHaveAttribute('disabled');

// Check attribute value
await expect(page.locator('input')).toHaveAttribute('type', 'email');

// Check CSS class
await expect(page.locator('button')).toHaveClass('primary');
await expect(page.locator('button')).toHaveClass(/primary|secondary/);

// VALUE ASSERTIONS
// Check input value
await expect(page.locator('input')).toHaveValue('John Doe');

// COUNT ASSERTIONS
// Check number of elements
await expect(page.locator('li')).toHaveCount(5);

// STATE ASSERTIONS
// Check if input is editable
await expect(page.locator('input')).toBeEditable();

// Check if input is disabled
await expect(page.locator('button')).toBeDisabled();

// Check if input is enabled
await expect(page.locator('button')).toBeEnabled();

// Check if checkbox is checked
await expect(page.locator('input[type="checkbox"]')).toBeChecked();

// Check if checkbox is unchecked
await expect(page.locator('input[type="checkbox"]')).not.toBeChecked();

// Check if input is focused
await expect(page.locator('input')).toBeFocused();

// Check if element is in viewport
await expect(page.locator('button')).toBeInViewport();

// URL ASSERTIONS
// Check if page URL matches
await expect(page).toHaveURL('https://example.com/dashboard');

// Check if URL contains text
await expect(page).toHaveURL(/example\.com/);

// TITLE ASSERTIONS
// Check page title
await expect(page).toHaveTitle('My App - Dashboard');
```

### Practical Assertion Examples

```javascript
test('complete assertion example', async ({ page }) => {
  await page.goto('https://example.com/product/123');
  
  // Verify correct page
  await expect(page).toHaveTitle(/Product/);
  
  // Verify product name
  await expect(page.getByRole('heading')).toHaveText('Premium Widget');
  
  // Verify price is displayed
  await expect(page.getByText(/\$\d+\.\d+/)).toBeVisible();
  
  // Verify add to cart button is enabled
  await expect(page.getByRole('button', { name: 'Add to Cart' })).toBeEnabled();
  
  // Click add to cart
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  
  // Verify success message appears
  await expect(page.getByText('Added to cart')).toBeVisible();
  
  // Verify cart count updated
  await expect(page.getByTestId('cart-count')).toHaveText('1');
});
```

### Understanding Waits

**Definition:** A wait pauses test execution until a condition is met or a timeout occurs. Playwright handles most waits automatically.

### Automatic Waits (Built-in)

```javascript
// Playwright automatically waits for elements before interacting
// Default timeout is 30 seconds (configurable)

// Wait for element to be visible before clicking
await page.getByRole('button').click();  // Auto-waits

// Wait for input to be visible before typing
await page.getByLabel('Email').fill('user@example.com');  // Auto-waits

// All standard interactions include auto-wait:
await page.locator('selector').type('text');      // Auto-waits
await page.locator('selector').check();           // Auto-waits
await page.locator('selector').hover();           // Auto-waits
```

### Explicit Waits (Manual)

```javascript
// Wait for element to appear
await page.waitForSelector('button.submit');

// Wait for specific locator
await page.locator('loading-spinner').waitFor({ state: 'hidden' });

// Wait with custom timeout (in milliseconds)
await page.waitForSelector('button', { timeout: 5000 });

// Wait for function/condition
await page.waitForFunction(() => {
  return document.querySelectorAll('.item').length > 0;
});

// Wait for specific page load state
await page.waitForLoadState('networkidle');  // All networks complete
await page.waitForLoadState('domcontentloaded');  // DOM ready
await page.waitForLoadState('load');  // Load event fired
```

### Waiting for Navigation

```javascript
// Wait for page navigation after click
await Promise.all([
  page.waitForNavigation(),
  page.getByRole('link', { name: 'Next' }).click()
]);

// Wait for specific response
const [response] = await Promise.all([
  page.waitForResponse(response => response.url().includes('/api/users')),
  page.getByRole('button', { name: 'Load Users' }).click()
]);

// Wait for specific URL
await page.goto('https://example.com');
await page.getByRole('link', { name: 'About' }).click();
await page.waitForURL('**/about');
```

### Timeout Configuration

```javascript
// Set timeout for single assertion (milliseconds)
await expect(page.locator('button')).toBeVisible({ timeout: 10000 });

// Set timeout for single wait
await page.waitForSelector('button', { timeout: 5000 });

// Set global timeout in config (see Configuration section)
```

### Complete Example with Waits and Assertions

```javascript
test('user registration flow with waits and assertions', async ({ page }) => {
  // Navigate
  await page.goto('https://example.com/register');
  await expect(page).toHaveTitle(/Register/);
  
  // Fill form
  await page.getByLabel('Username').fill('newuser');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('SecurePass123');
  
  // Submit and wait for navigation
  await Promise.all([
    page.waitForNavigation(),
    page.getByRole('button', { name: 'Register' }).click()
  ]);
  
  // Wait for dashboard to load
  await page.waitForLoadState('networkidle');
  
  // Assert successful registration
  await expect(page).toHaveURL(/.*dashboard/);
  await expect(page.getByText('Welcome, newuser')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Logout' })).toBeEnabled();
});
```

## Test Organization

### Understanding Test Structure

**Definition:** Organizing tests means grouping related test cases together and using setup/teardown methods to reduce code duplication.

### Grouping Tests with describe()

**Definition:** `test.describe()` groups related tests together. This improves readability and allows shared setup.

```javascript
// WITHOUT grouping (repetitive)
test('user can login', async ({ page }) => {
  // setup code...
  // test code...
});

test('user sees error on failed login', async ({ page }) => {
  // setup code...  // DUPLICATE
  // test code...
});

// WITH grouping (organized)
test.describe('Login Feature', () => {
  test('user can login successfully', async ({ page }) => {
    await page.goto('https://example.com/login');
    // test code
  });

  test('user sees error on failed login', async ({ page }) => {
    await page.goto('https://example.com/login');
    // test code
  });
});
```

### Nested Test Groups

```javascript
test.describe('E-Commerce Application', () => {
  // Setup runs before each top-level group
  
  test.describe('Product Page', () => {
    test('should display product details', async ({ page }) => {
      // test
    });
    
    test('should add product to cart', async ({ page }) => {
      // test
    });
  });

  test.describe('Shopping Cart', () => {
    test('should display cart items', async ({ page }) => {
      // test
    });
    
    test('should calculate total correctly', async ({ page }) => {
      // test
    });
  });
});
```

### Setup and Teardown Hooks

**Definition:** Hooks run code before and after tests. This reduces duplication and ensures clean state.

```javascript
import { test, expect } from '@playwright/test';

test.describe('User Management', () => {
  let userId;

  // Runs ONCE before all tests in this describe block
  test.beforeAll(async () => {
    console.log('Setting up database connection');
    userId = 123;
  });

  // Runs BEFORE EACH test in this describe block
  test.beforeEach(async ({ page }) => {
    // Navigate to app before each test
    await page.goto('https://example.com');
    console.log('Test starting');
  });

  // Runs AFTER EACH test in this describe block
  test.afterEach(async ({ page }) => {
    // Cleanup after each test
    console.log('Test finished, cleaning up');
  });

  // Runs ONCE after all tests in this describe block
  test.afterAll(async () => {
    console.log('Tearing down database connection');
  });

  test('test 1', async ({ page }) => {
    // beforeEach runs first
    expect(userId).toBe(123);
    // afterEach runs after
  });

  test('test 2', async ({ page }) => {
    // beforeEach runs first
    expect(userId).toBe(123);
    // afterEach runs after
  });
});
```

### Complete Organization Example

```javascript
test.describe('Shopping Checkout', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'TestPass123'
  };

  let page;

  test.beforeAll(async ({ browser }) => {
    // Create page context once
    console.log('Setting up test environment');
  });

  test.beforeEach(async ({ page: testPage }) => {
    page = testPage;
    
    // Navigate to app
    await page.goto('https://example.com');
    
    // Login before each test
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Password').fill(testUser.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Wait for dashboard
    await expect(page.getByText('Welcome')).toBeVisible();
  });

  test.afterEach(async () => {
    // Logout after each test
    await page.getByRole('button', { name: 'Logout' }).click();
    console.log('Test completed');
  });

  test('should add item to cart', async () => {
    // Login already done by beforeEach
    await page.getByText('Product 1').click();
    await page.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(page.getByText('Item added')).toBeVisible();
  });

  test('should proceed to checkout', async () => {
    // Login already done by beforeEach
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
    await expect(page).toHaveURL(/checkout/);
  });
});
```

### Skipping and Focusing Tests

```javascript
// Skip a test (won't run)
test.skip('pending feature - not ready yet', async ({ page }) => {
  // This test is skipped
});

// Run ONLY this test (others are ignored)
test.only('test this one', async ({ page }) => {
  // Only this test runs
});

// Conditional skip
test.skip(process.env.ENV === 'production', 'skip on production', async ({ page }) => {
  // Only skipped if ENV is production
});

// Example: Skip slow tests unless flag is set
test.skip(!process.env.RUN_SLOW_TESTS, 'Slow test - set RUN_SLOW_TESTS=true to run', async ({ page }) => {
  // Long running test
});
```

## Advanced Techniques

### Handling Multiple Tabs and Windows

**Definition:** Web applications sometimes open new tabs or windows. Playwright provides tools to interact with these.

```javascript
// Listen for a new page (popup window)
const [popup] = await Promise.all([
  page.waitForEvent('popup'),
  page.getByRole('link', { name: 'Open in New Tab' }).click()
]);

// Interact with the popup
await popup.waitForLoadState();
await expect(popup.getByRole('heading')).toHaveText('New Tab Content');

// Get the popup URL
const popupUrl = popup.url();

// Close the popup
await popup.close();

test('handle popup window', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Click link that opens popup
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open Support' }).click();
  
  const popup = await popupPromise;
  
  // Interact with popup
  await expect(popup.locator('h1')).toHaveText('Support');
  
  // Switch back to original page
  await expect(page.locator('h1')).toHaveText('Main Page');
});
```

### Network Mocking and Interception

**Definition:** Intercept network requests to mock responses or verify API calls without hitting real servers.

```javascript
// Mock API responses
await page.route('**/api/users', route => {
  route.abort();  // Block the request
});

// Mock with custom response
await page.route('**/api/users', route => {
  route.abort('blockedbyclient');
});

// Mock with custom data
await page.route('**/api/users', async route => {
  await route.fulfill({
    status: 200,
    body: JSON.stringify([
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' }
    ])
  });
});

// Listen to all requests
page.on('request', request => {
  console.log('>>', request.method(), request.url());
});

// Listen to all responses
page.on('response', response => {
  console.log('<<', response.status(), response.url());
});

test('mock API response', async ({ page }) => {
  // Mock the user API endpoint
  await page.route('**/api/profile', async route => {
    await route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        name: 'Test User',
        email: 'test@example.com'
      })
    });
  });

  await page.goto('https://example.com/profile');
  
  // Page will use mocked data
  await expect(page.getByText('Test User')).toBeVisible();
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

### Handling Dialogs

**Definition:** Browser dialogs include alerts, confirms, and prompts. Playwright can interact with them.

```javascript
// Handle alert dialog
page.on('dialog', async dialog => {
  console.log('Dialog message:', dialog.message());
  await dialog.accept();  // Click OK
});

// Handle confirm dialog
page.once('dialog', async dialog => {
  expect(dialog.type()).toBe('confirm');
  await dialog.dismiss();  // Click Cancel
});

// Handle prompt dialog
page.on('dialog', async dialog => {
  await dialog.accept('User input text');  // Enter text and click OK
});

test('handle alert dialog', async ({ page }) => {
  // Setup dialog handler
  let alertMessage = '';
  page.on('dialog', async dialog => {
    alertMessage = dialog.message();
    await dialog.accept();
  });

  await page.goto('https://example.com');
  await page.getByRole('button', { name: 'Show Alert' }).click();
  
  // Verify alert message
  expect(alertMessage).toBe('This is an alert!');
});
```

### Taking Screenshots and Videos

**Definition:** Visual testing helps catch unintended UI changes.

```javascript
// Take screenshot of visible part
await page.screenshot({ path: 'screenshot.png' });

// Take full page screenshot (including off-screen content)
await page.screenshot({
  path: 'fullpage.png',
  fullPage: true
});

// Screenshot specific element
const element = page.getByRole('heading');
await element.screenshot({ path: 'heading.png' });

// Screenshot in different formats
await page.screenshot({ path: 'screenshot.jpeg', type: 'jpeg' });
await page.screenshot({ path: 'screenshot.webp', type: 'webp' });

// Videos are configured in playwright.config.js
// Videos automatically record test execution for debugging

test('visual verification', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Take screenshot for visual comparison
  await page.screenshot({ path: 'homepage.png' });
  
  // In CI/CD, compare against baseline
  // This helps catch unintended design changes
});
```

### Evaluating JavaScript

**Definition:** Execute custom JavaScript in the page context to get or manipulate data.

```javascript
// Execute JavaScript and get result
const title = await page.evaluate(() => {
  return document.title;
});

// Pass arguments to evaluated function
const result = await page.evaluate(str => {
  return str.toUpperCase();
}, 'hello');  // Returns 'HELLO'

// Get complex data
const dimensions = await page.evaluate(() => ({
  width: document.body.clientWidth,
  height: document.body.clientHeight,
  title: document.title
}));

// Modify page content
await page.evaluate(() => {
  document.body.style.backgroundColor = 'red';
});

// Get data from application state (if using React, Vue, etc.)
const appState = await page.evaluate(() => {
  return window.__APP_STATE__;
});

test('evaluate javascript', async ({ page }) => {
  await page.goto('https://example.com');
  
  // Count specific elements
  const itemCount = await page.evaluate(() => {
    return document.querySelectorAll('.item').length;
  });
  
  console.log(`Found ${itemCount} items`);
  
  // Get computed styles
  const color = await page.evaluate(() => {
    const el = document.querySelector('button');
    return window.getComputedStyle(el).color;
  });
  
  console.log('Button color:', color);
});
```

### Working with Page Events

```javascript
// Console messages
page.on('console', msg => {
  console.log('Browser console:', msg.text());
});

// Page errors
page.on('pageerror', error => {
  console.log('Page error:', error);
});

// Failed requests
page.on('requestfailed', request => {
  console.log('Request failed:', request.url());
});

// Close events
page.on('close', () => {
  console.log('Page was closed');
});

test('monitor page events', async ({ page }) => {
  const errors = [];
  
  // Collect page errors
  page.on('pageerror', error => {
    errors.push(error.message);
  });

  await page.goto('https://example.com');
  
  // Verify no errors occurred
  expect(errors).toHaveLength(0);
});
```

## Best Practices

### 1. Write Descriptive Test Names

**Why:** Test names are the first thing developers see. Good names explain what's being tested without reading the code.

```javascript
// BAD - Unclear what's being tested
test('login', async ({ page }) => {});
test('test 1', async ({ page }) => {});
test('button click', async ({ page }) => {});

// GOOD - Clear, specific descriptions
test('user can login with valid credentials', async ({ page }) => {});
test('login form shows error message for invalid email format', async ({ page }) => {});
test('submit button is disabled until form is complete', async ({ page }) => {});
test('logged-in user can view their profile', async ({ page }) => {});
```

### 2. Isolate Tests (No Dependencies)

**Why:** Each test should be independent. If tests depend on each other, one failure causes cascading failures.

```javascript
// BAD - Tests depend on each other
test('create user', async ({ page }) => {
  userId = await createUser();
  expect(userId).toBe(1);
});

test('login as created user', async ({ page }) => {
  // Depends on previous test!
  await loginUser(userId);
});

// GOOD - Each test is independent
test.beforeEach(async ({ page }) => {
  await page.goto('https://example.com/login');
  // Setup done before EACH test
});

test('create user', async ({ page }) => {
  const userId = await createUser();
  expect(userId).toBe(1);
});

test('login', async ({ page }) => {
  // Doesn't depend on previous test
  const userId = await createUser();
  await loginUser(userId);
});
```

### 3. Use the Page Object Model Pattern

**Why:** Encapsulates page elements and actions, making tests readable and maintainable.

```javascript
// pages/loginPage.js
export class LoginPage {
  constructor(page) {
    this.page = page;
    
    // Define locators as properties
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('https://example.com/login');
  }

  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }
}

// tests/login.spec.js
import { LoginPage } from '../pages/loginPage';

test('login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'password123');
  
  await expect(page).toHaveURL('/dashboard');
});

test('login with invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  await loginPage.goto();
  await loginPage.login('user@example.com', 'wrong');
  
  const error = await loginPage.getErrorMessage();
  expect(error).toBe('Invalid credentials');
});
```

### 4. Use Appropriate Selectors

**Why:** Good selectors are resilient to HTML changes. Bad selectors break when the page changes slightly.

```javascript
// PRIORITY ORDER (best to worst):

// EXCELLENT - Role-based
await page.getByRole('button', { name: 'Submit' }).click();
// Why: Resistant to CSS/HTML changes, works for accessibility

// GOOD - Label/Placeholder
await page.getByLabel('Email').fill('user@example.com');
// Why: Clear intent, works when HTML reorganizes

// GOOD - Test ID
await page.getByTestId('user-avatar').click();
// Why: Explicit, doesn't break with styling changes

// OKAY - Text content
await page.getByText('Sign Up').click();
// Why: Works but fragile if text changes

// POOR - CSS selector chains
await page.locator('body > div > form > div:nth-child(2) > input').fill('data');
// Why: Breaks with any HTML restructuring

// WORST - XPath
await page.locator('//html/body/div[1]/form/input').fill('data');
// Why: Very fragile, hard to maintain
```

### 5. Avoid Hard Waits

**Why:** Hard waits (timeouts) make tests slow and flaky. Let Playwright's automatic waits handle it.

```javascript
// BAD - Hard wait
await page.waitForTimeout(5000);  // Wait 5 seconds
await page.locator('button').click();

// GOOD - Let Playwright wait automatically
await page.locator('button').click();  // Auto-waits up to 30s

// BAD - Hard wait for condition
await page.waitForTimeout(2000);
const text = await page.locator('status').textContent();

// GOOD - Explicit wait for condition
await expect(page.locator('status')).toHaveText('Ready');
const text = await page.locator('status').textContent();

// GOOD - Wait for element visibility
await page.locator('.loading-spinner').waitFor({ state: 'hidden' });
```

### 6. Use Fixtures for Setup

**Why:** Fixtures reduce code duplication and ensure consistent test setup.

```javascript
// fixtures/auth.ts
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Setup: Login before test
    await page.goto('https://example.com/login');
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Provide authenticated page to test
    await use(page);
    
    // Teardown: Logout after test
    await page.getByRole('button', { name: 'Logout' }).click();
  }
});

// tests/dashboard.spec.js
import { test } from '../fixtures/auth';

test('dashboard shows user info', async ({ authenticatedPage }) => {
  // Already logged in!
  await expect(authenticatedPage.getByText('Welcome')).toBeVisible();
});
```

### 7. Handle Errors Gracefully

**Why:** Tests should fail with clear messages about what went wrong.

```javascript
// BAD - Generic error
if (!element) {
  throw new Error('Failed');
}

// GOOD - Descriptive error
const loginButton = page.getByRole('button', { name: 'Login' });
await expect(loginButton).toBeVisible({
  timeout: 5000
});
// Playwright will output: "expected element to be visible"

// GOOD - Custom error message
const element = page.locator('.user-card');
await expect(element).toBeVisible();
// If fails: "expect(element).toBeVisible() failed"
```

### 8. Test User Behavior, Not Implementation

**Why:** Tests should mirror what users actually do, not how code works internally.

```javascript
// BAD - Testing implementation details
test('component state is correct', async ({ page }) => {
  const stateValue = await page.evaluate(() => {
    return window.__componentState__.isOpen;
  });
  expect(stateValue).toBe(true);
});

// GOOD - Testing user-visible behavior
test('menu opens when clicked', async ({ page }) => {
  const menu = page.getByRole('menu');
  
  // Menu is hidden initially
  await expect(menu).not.toBeVisible();
  
  // User clicks button
  await page.getByRole('button', { name: 'Menu' }).click();
  
  // Menu is visible after click
  await expect(menu).toBeVisible();
  
  // User can interact with menu items
  await expect(page.getByRole('menuitem')).toHaveCount(3);
});
```

## Configuration

### Understanding playwright.config.js

**Definition:** The configuration file controls how Playwright runs tests - which browsers to use, timeouts, retries, reporters, and more.

### Basic Configuration

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Specify where test files are located
  testDir: './tests',
  
  // Pattern to match test files (by default: *.spec.js, *.test.js)
  testMatch: '**/*.spec.js',
  
  // Run tests in parallel (faster)
  fullyParallel: true,
  
  // Prevent accidentally committing .only() tests
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests (useful in CI environments)
  retries: process.env.CI ? 2 : 0,
  
  // Number of worker processes (undefined = auto-detect)
  workers: process.env.CI ? 1 : undefined,
  
  // Report style (options: 'html', 'list', 'junit', 'json', 'dot')
  reporter: 'html',
  
  // Global settings for all tests
  use: {
    // Base URL for relative navigation
    baseURL: 'http://localhost:3000',
    
    // Trace recording (for debugging failures)
    // Options: 'off', 'on', 'retain-on-failure', 'on-first-retry'
    trace: 'on-first-retry',
    
    // Take screenshots on failure
    screenshot: 'only-on-failure',
    
    // Record video on failure
    video: 'retain-on-failure',
  },

  // Browser-specific configurations
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  // Automatically start web server before tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },

  // Global timeout for all tests (in milliseconds)
  timeout: 30 * 1000,  // 30 seconds
  
  // Timeout for individual actions
  use: {
    actionTimeout: 10 * 1000,  // 10 seconds
  },
});
```

### Configuration Options Explained

```javascript
// testDir: Where to look for tests
testDir: './tests',

// testMatch: Which files are tests
testMatch: '**/*.spec.js',

// fullyParallel: Run tests in parallel (faster)
fullyParallel: true,

// forbidOnly: Prevent committing .only tests
forbidOnly: !!process.env.CI,  // true in CI, false locally

// retries: Retry failed tests N times
retries: process.env.CI ? 2 : 0,

// workers: Number of parallel workers
workers: process.env.CI ? 1 : undefined,

// reporter: Where to send test results
reporter: 'html',  // generates HTML report

// timeout: Default timeout for tests
timeout: 30000,

// baseURL: Base URL for all tests
use: { baseURL: 'http://localhost:3000' },

// trace: Record test execution for debugging
use: { trace: 'on-first-retry' },

// screenshot: When to take screenshots
use: { screenshot: 'only-on-failure' },

// video: When to record video
use: { video: 'retain-on-failure' },
```

### Running with Different Configurations

```bash
# Run all tests with all configurations
npx playwright test

# Run specific test file
npx playwright test tests/login.spec.js

# Run tests matching pattern
npx playwright test -g "login"

# Run specific project (browser)
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"

# Run in debug mode
npx playwright test --debug

# Run in UI mode (interactive)
npx playwright test --ui

# Generate HTML report
npx playwright show-report

# Run with custom config file
npx playwright test --config=custom.config.js
```

### Environment-Specific Configuration

```javascript
// playwright.config.js
export default defineConfig({
  use: {
    // Use environment variable for base URL
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    
    // Different trace settings per environment
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },

  // Different retries per environment
  retries: process.env.ENV === 'production' ? 0 : 2,

  // Different workers per environment
  workers: process.env.CI ? 1 : 4,
});
```

### Debugging Configuration

```bash
# Enable debug mode (opens inspector)
npx playwright test --debug

# Use headed mode (see browser)
npx playwright test --headed

# Use UI mode (interactive dashboard)
npx playwright test --ui

# Increase logging
DEBUG=pw:api npx playwright test

# Generate trace for later inspection
npx playwright show-trace trace.zip
```


## Quick Reference Commands

### Essential Commands

```bash
# Installation
npm install -D @playwright/test
npx playwright install

# Running Tests
npx playwright test                    # Run all tests
npx playwright test tests/login.spec.js  # Run specific file
npx playwright test -g "login"         # Run tests matching pattern
npx playwright test --headed           # See browser while running
npx playwright test --debug            # Open debugger
npx playwright test --ui               # Interactive UI mode

# Browsers
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project="Mobile Chrome"

# Results
npx playwright show-report             # View HTML report
npx playwright show-trace trace.zip    # View trace recording
```

### Debugging Methods

```bash
# Method 1: UI Mode (Recommended)
npx playwright test --ui

# Method 2: Debug Mode
npx playwright test --debug

# Method 3: Verbose Output
npx playwright test --reporter=list

# Method 4: Headed Mode
npx playwright test --headed

# Method 5: Inspector (within test)
# Add: await page.pause(); to pause execution
```

## Common Scenarios and Solutions

### Scenario 1: Test is Flaky (Sometimes Passes, Sometimes Fails)

**Problem:** Test passes occasionally but fails randomly.

**Solution:**
```javascript
// WRONG - Hard wait (flaky)
await page.waitForTimeout(2000);
await page.locator('button').click();

// CORRECT - Wait for specific condition
await page.locator('button').waitFor({ state: 'visible' });
await page.locator('button').click();

// CORRECT - Use assertions
await expect(page.locator('button')).toBeVisible();
await page.locator('button').click();
```

### Scenario 2: Element Not Found

**Problem:** Locator can't find the element.

**Solution:**
```javascript
// WRONG - Complex XPath
const element = page.locator('//html/body/div[1]/form/input');

// CORRECT - Use role-based locator
const element = page.getByRole('textbox', { name: 'Email' });

// DEBUG - Inspect what's on the page
await page.pause();  // Open inspector
npx playwright test --debug
```

### Scenario 3: Test Times Out

**Problem:** Test waits too long for something that never happens.

**Solution:**
```javascript
// Increase timeout for specific action
await expect(page.locator('button')).toBeVisible({ timeout: 10000 });

// Or increase globally in config
use: { actionTimeout: 10000 }

// Or debug to see what's happening
npx playwright test --debug
```

### Scenario 4: Need to Test Modal/Popup

**Problem:** Can't interact with elements in modal.

**Solution:**
```javascript
test('interact with modal', async ({ page }) => {
  // Open modal
  await page.getByRole('button', { name: 'Open' }).click();
  
  // Wait for modal to appear
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  // Interact with modal elements
  await page.locator('[role="dialog"] input').fill('data');
  
  // Close modal
  await page.getByRole('button', { name: 'Close' }).click();
});
```

### Scenario 5: Need to Test File Upload

**Problem:** Can't click file input normally.

**Solution:**
```javascript
test('upload file', async ({ page }) => {
  // Set file to input without clicking
  await page.locator('input[type="file"]').setInputFiles('./test-file.pdf');
  
  // Submit form
  await page.getByRole('button', { name: 'Upload' }).click();
  
  // Verify upload success
  await expect(page.getByText('File uploaded')).toBeVisible();
});
```

### Scenario 6: Need to Test Download

**Problem:** Can't verify file downloads.

**Solution:**
```javascript
test('download file', async ({ page }) => {
  // Wait for download
  const downloadPromise = page.waitForEvent('download');
  
  // Trigger download
  await page.getByRole('link', { name: 'Download' }).click();
  
  // Get download
  const download = await downloadPromise;
  
  // Verify filename
  expect(download.suggestedFilename()).toBe('report.pdf');
  
  // Save to disk
  await download.saveAs('./downloads/report.pdf');
});
```

### Scenario 7: Need to Test Authentication

**Problem:** Need to login in multiple tests without duplication.

**Solution:**
```javascript
test.beforeEach(async ({ page }) => {
  // Login before each test
  await page.goto('https://example.com/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Login' }).click();
  
  // Wait for navigation to complete
  await expect(page).toHaveURL('/dashboard');
});

test('user can view dashboard', async ({ page }) => {
  // Already logged in from beforeEach
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Learning Path

**Beginner:**
1. ✅ Installation and first test
2. ✅ Basic navigation and assertions
3. ✅ User interactions (click, type)
4. ✅ Locators and selectors

**Intermediate:**
5. ✅ Test organization and hooks
6. ✅ Waiting strategies
7. ✅ Form testing
8. ✅ Page Object Model

**Advanced:**
9. ✅ Network mocking and interception
10. ✅ Dialogs and popups
11. ✅ Screenshots and videos
12. ✅ Custom fixtures and configuration

## Resources

- **Official Documentation:** https://playwright.dev
- **API Reference:** https://playwright.dev/docs/api/class-playwrightassertions
- **Best Practices:** https://playwright.dev/docs/best-practices
- **Debugging Guide:** https://playwright.dev/docs/debug
- **Community:** https://github.com/microsoft/playwright

## Conclusion

Playwright is a powerful framework for automated testing. By following these practices and patterns, you can create reliable, maintainable test suites that:

- ✅ Run fast and reliably
- ✅ Are easy to understand and maintain
- ✅ Work across all major browsers
- ✅ Scale to complex testing scenarios
- ✅ Provide excellent debugging capabilities

Start with simple tests and gradually build up to more complex scenarios. Remember that good tests are a long-term investment in application quality.

Happy testing! 🎭
