/**
 * contactus.spec.js
 *
 * Covers two separate interaction patterns on the Angular practice site:
 *  1. Contact Us form — fills text inputs, uses checkboxes, radio buttons, and a select dropdown,
 *     then asserts the success message after submission.
 *  2. Shop navigation — clicks through to the shop page and adds a specific product to the cart.
 *
 * Key Playwright locator strategies demonstrated:
 *  - getByLabel()       — finds form controls by their associated <label> text
 *  - getByPlaceholder() — finds inputs by placeholder attribute
 *  - getByRole()        — finds elements by ARIA role + accessible name
 *  - getByText()        — finds elements by visible text
 *  - filter()           — narrows a locator to items matching a condition
 */

import { expect, test } from 'playwright/test';

test('Contact Us', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // --- FILL THE CONTACT FORM ---

    // fill() sets the value of an input directly (faster than typing character by character)
    await page.locator('.form-control').first().fill('Name');
    await page.locator("[name='email']").fill('name@yopmail.com');

    // getByLabel() locates the element associated with a label via the for/id relationship.
    // click() on a checkbox toggles its checked state.
    await page.getByLabel('Check me out if you Love IceCreams!').click();

    // check() explicitly sets a checkbox/radio to checked — idempotent, won't toggle if already checked
    await page.getByLabel('Employed').check();

    // selectOption() selects a value from a <select> dropdown by its visible text or value attribute
    await page.getByLabel('Gender').selectOption('Female');

    await page.getByPlaceholder("Password").fill("abc1234");

    // getByRole('button') targets the submit button by its ARIA role and visible label
    await page.getByRole("button", { name: "Submit" }).click();

    // --- ASSERT FORM SUBMISSION SUCCESS ---
    // isVisible() returns a boolean — does not throw if the element is absent
    const success_text = await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    expect(success_text).toBeTruthy();

    // --- NAVIGATE TO SHOP ---
    await page.getByRole("link", { name: "Shop" }).click();

    // filter() restricts the app-card locator to only the card that contains "Blackberry" text,
    // then getByRole('button') clicks the "Add to Cart" button within that card.
    await page.locator("app-card")
        .filter({ hasText: "Blackberry" })
        .getByRole("button")
        .click();
});

/**
 * Playwright debugging tips:
 *
 * --ui flag:    npx playwright test 'contactus.spec.js' --ui
 *               Opens the Playwright Test Runner UI for visual step-by-step execution.
 *
 * --debug flag: npx playwright test 'contactus.spec.js' --debug
 *               Opens Playwright Inspector, which highlights elements as locators are evaluated
 *               and pauses at breakpoints or failures. Useful for troubleshooting flaky selectors.
 */
