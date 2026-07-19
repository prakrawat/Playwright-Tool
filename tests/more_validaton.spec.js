/**
 * more_validaton.spec.js
 *
 * Covers advanced Playwright interaction patterns:
 *  1. Element visibility toggling — assert visible/hidden states
 *  2. Alert/dialog handling      — accept or dismiss browser dialogs
 *  3. Mouse hover                — trigger hover-activated UI elements
 *  4. iframe interaction         — locate and click elements inside an embedded frame
 *
 * Note: test.only() on "Child Window Handling" means only that test runs in this file
 * unless the suite is invoked with --grep or the .only is removed.
 */

const { expect, test } = require('@playwright/test');


/**
 * Test 1: Visibility toggle, alert dialogs, and hover actions.
 *
 * Demonstrates:
 *  - toBeVisible() / toBeHidden() — assert element visibility state
 *  - page.on('dialog', ...) — register a one-time listener before the action that triggers it
 *  - hover() — simulates a mouse-over to reveal hidden UI elements
 */
test('More Validation', async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    // --- VISIBILITY TOGGLE ---
    // Assert the text box is visible initially, then hidden after clicking the "Hide" button
    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();

    // --- ALERT DIALOG: ACCEPT ---
    // Register the dialog listener BEFORE the action that triggers the dialog.
    // dialog.accept() clicks "OK" on the alert — equivalent to the user pressing Enter.
    page.on('dialog', dialog => dialog.accept());
    await page.locator('#alertbtn').click();

    // --- ALERT DIALOG: DISMISS ---
    // dialog.dismiss() clicks "Cancel" — equivalent to pressing Escape.
    // Useful for confirm() dialogs where you want to choose "No".
    page.on('dialog', dialog => dialog.dismiss());
    await page.locator('#alertbtn').click();

    // --- HOVER ---
    // hover() moves the mouse over the element, triggering CSS :hover styles or JS mouseover events
    await page.locator('#mousehover').hover();

    // After hovering, a "Reload" link becomes visible — click it
    await page.getByText('Reload').click();

    // Pause for manual inspection — remove before committing to CI
    await page.pause();
});


/**
 * Test 2: Interact with elements inside an <iframe> using frameLocator().
 *
 * iframes are separate browsing contexts embedded in the main page.
 * Standard locators cannot cross the iframe boundary — frameLocator() creates
 * a scoped locator that targets elements inside the specified frame.
 *
 * test.only() — only this test runs in this file during the current test run.
 * Remove .only to run both tests together.
 */
test.only('Child Window Handling', async ({ page }) => {

    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    // frameLocator() returns a FrameLocator scoped to the iframe with id="courses-iframe".
    // All subsequent locator calls on this object resolve inside the iframe's DOM.
    const frame = await page.frameLocator('#courses-iframe');

    // :visible in the CSS selector filters to only the visible instance of the link
    // (there may be duplicate href="lifetime-access" links — we want the one currently shown)
    await frame.locator('li a[href*="lifetime-access"]:visible').click();

    // Read and print a specific piece of text from inside the iframe
    const text = await frame.locator('.text h2').textContent();

    // split(" ")[1] extracts the second word from the heading (e.g. "1500" from "Over 1500 Students")
    console.log(text.split(" ")[1]);

    // Pause for manual inspection — remove before committing to CI
    await page.pause();
});
