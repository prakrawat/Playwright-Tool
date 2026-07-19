/**
 * first_test.spec.js
 *
 * Introductory Playwright tests demonstrating foundational concepts:
 *  - Creating browser contexts and pages manually
 *  - Navigating to URLs and asserting page titles
 *  - Filling form inputs with fill()
 *  - CSS and attribute-based locators
 *  - Reading text from single and multiple elements
 *  - Handling multiple matching elements with nth(), first(), last()
 *
 * Key JavaScript concepts used:
 *  - async/await: ensures each Playwright action completes before the next begins.
 *    Without await, commands fire in parallel and steps can overlap unpredictably.
 *  - Arrow functions: `async ({ page }) => { ... }` is shorthand for an anonymous async function.
 */

const { test, expect } = require('@playwright/test');

/**
 * Test 1: Navigate to a demo web shop.
 * Demonstrates how to create a fresh browser context manually.
 * A new context has no cookies or cached data — equivalent to a private/incognito window.
 */
test('FirstTestcase', async ({ browser }) => {

    // browser.newContext() creates an isolated browser session (no shared cookies/storage)
    const context = await browser.newContext();
    const page = await context.newPage(); // Opens a new tab within that context

    await page.goto('https://demowebshop.tricentis.com/');
    await page.pause();
});


/**
 * Test 2: Login page validation — tests both failed and successful login scenarios,
 * then reads and prints multiple product card links after a successful login.
 *
 * Demonstrates:
 *  - toHaveTitle() assertion for page title
 *  - Locating elements by CSS attribute selectors (input#username, [type="submit"])
 *  - Locating a visible error message with [style*="block"]
 *  - toContainText() assertion for partial text matching
 *  - allTextContents() to collect text from all matching elements at once
 */
test('test2', async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    // Assert the browser tab title matches exactly
    const title = await page.title();
    console.log(`Printing Title of Githubio site: ${title}`);
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');

    // --- FAILED LOGIN ATTEMPT ---
    // fill() replaces the input value entirely (preferred over deprecated type())
    await page.locator('input#username').fill('prakashrawattt@gmail.com');
    await page.locator('input#password').fill('NewPassword@123');
    await page.locator('[type="submit"]').click();

    // [style*="block"] selects an element whose style attribute contains "block" (i.e. display:block)
    // This targets the error message panel that is shown only on failed login
    const error_text = await page.locator('[style*="block"]').textContent();
    console.log(`Printing text: ${error_text}`);

    // toContainText() passes if the element's text contains the given substring
    await expect(page.locator('[style*="block"]')).toContainText("Incorrect username/password.");

    // --- SUCCESSFUL LOGIN ATTEMPT ---
    // Clear previous values by filling with an empty string before the new value
    await page.locator('input#username').fill("");
    await page.locator('input#username').fill("rahulshettyacademy");

    await page.locator('input#password').fill("");
    await page.locator('input#password').fill("Learning@830$3mK2");

    await page.locator('[type="submit"]').click();

    // --- READ PRODUCT CARD LINKS ---
    // last() selects the final matched element when multiple elements share the same locator
    console.log(await page.locator('.card-body a').last().textContent());

    // allTextContents() returns an array of text strings for all matching elements at once
    const allTexts = await page.locator('.card-body a').allTextContents();
    console.log(allTexts);
    await page.pause();
});
