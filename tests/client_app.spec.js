/**
 * client_app.spec.js
 *
 * Three independent tests covering different Playwright interaction patterns:
 *
 *  1. "Client App test"      — Login to the e-commerce client app and read product/price data
 *  2. "Radio & Checkbox"     — Interact with dropdowns, radio buttons, checkboxes, and attribute assertions
 *  3. "Another Child Window" — Handle a link that opens a new browser tab (child window)
 */

const { test, expect } = require('playwright/test');


/**
 * Test 1: Log in to the client app and read product/price information from the dashboard.
 * Demonstrates waitForLoadState('networkidle') to ensure the page has fully loaded before reading data.
 */
test('Client App test : Testcase One', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/client');

    await page.locator('[id="userEmail"]').fill('dummyaccount@yopmail.com');
    await page.locator('[id="userPassword"]').fill('Test@1234');
    await page.locator('#login').click();

    // networkidle waits until there are no pending network requests for at least 500ms.
    // This ensures the product grid has fully loaded before we try to read it.
    await page.waitForLoadState('networkidle');

    // allTextContents() collects text from all matching elements into a string array
    console.log(await page.locator('.card-body b').allTextContents());    // Product names
    console.log(await page.locator('.text-muted').allTextContents());     // Product prices/descriptions
});


/**
 * Test 2: Interact with dropdown, radio buttons, checkbox, and verify element attributes.
 *
 * Covers:
 *  - selectOption() for <select> dropdowns
 *  - click() vs check() for radio buttons and checkboxes
 *  - isChecked() to read checkbox/radio state
 *  - uncheck() to explicitly deselect a checkbox
 *  - toBeChecked() and toBeFalsy() assertions
 *  - toHaveAttribute() to assert an element's HTML attribute value
 */
test('Radio & Checkbox Buttons', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    console.log(await page.locator("[for='username']"));
    await page.locator('#username').fill('rahulshettyacademy');
    console.log(await page.locator("[for='password']"));
    await page.locator('#password').fill('Learning@830$3mK2');

    await page.waitForLoadState('networkidle');

    // --- DROPDOWN ---
    // allTextContents() prints all available options in the dropdown for reference
    const dropdown_values = await page.locator('select.form-control').allTextContents();
    console.log(dropdown_values);

    // selectOption() selects by visible text — more readable than selecting by index
    await page.locator('select.form-control').selectOption('Consultant');

    // --- RADIO BUTTONS ---
    // Print all radio button labels to the console
    const radio_button_values = await page.locator('.radiotextsty').allTextContents();
    console.log(radio_button_values);

    // click() on a .checkmark element selects its associated radio button
    await page.locator('.checkmark').last().click();

    // Confirm the selection dialog that appears after clicking the radio button
    await page.locator('#okayBtn').click();

    // isChecked() returns a boolean — used here for logging; toBeChecked() is the assertion form
    console.log(await page.locator('.radiotextsty').last().isChecked());
    expect(await page.locator('.radiotextsty').last()).toBeChecked();

    // --- CHECKBOX ---
    // inputValue() reads the value attribute of the checkbox input (not its checked state)
    const terms = await page.locator('.text-white.termsText').inputValue();
    console.log(terms);

    const belowdetails = await page.locator('.text-center.text-white').textContent();
    console.log(belowdetails);

    // click() toggles the checkbox; use check()/uncheck() when you need an explicit state
    await page.locator("[type='checkbox']").click();

    // isChecked() returns true/false — used here for logging
    const checkbox = await page.locator("[type='checkbox']").isChecked();
    console.log(checkbox);

    // uncheck() explicitly unchecks the box, regardless of its current state
    await page.locator("[type='checkbox']").uncheck();

    // await is inside the brackets because isChecked() is async — we need its resolved value to assert
    expect(await page.locator("[type='checkbox']").isChecked()).toBeFalsy();

    // --- ATTRIBUTE ASSERTION ---
    // toHaveAttribute() verifies that a specific HTML attribute has the expected value
    // Here we confirm the document link has class="blinkingText" as expected
    const documentLink = await page.locator('[href*="documents-request"]');
    await expect(documentLink).toHaveAttribute("class", "blinkingText");
});


/**
 * Test 3: Handle a link that opens content in a new browser tab (child window).
 *
 * Playwright does not auto-switch to new tabs. The pattern is:
 *  Promise.all([waitForEvent('page'), trigger-the-click])
 * This listens for the 'page' event (new tab opened) BEFORE the click fires,
 * so the event is captured regardless of how fast the new tab opens.
 *
 * Also demonstrates:
 *  - Reading text from a child page element
 *  - Parsing an email address from text using split()
 *  - Filling an input on the original page with data extracted from the child page
 *  - textContent() vs inputValue(): textContent() reads visible text; inputValue() reads <input> values
 */
test("Another Child Window", async ({ browser }) => {

    const bcontext = await browser.newContext();
    const page = await bcontext.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');

    const documentLink = await page.locator('[href*="documents-request"]');

    // Promise.all ensures we start listening for the new-page event BEFORE triggering the click.
    // Without this, the new tab might open before the listener is registered and we'd miss it.
    const [childPage] = await Promise.all([
        bcontext.waitForEvent('page'), // Resolves when the new tab opens
        documentLink.click(),          // Triggers the new tab
        console.log(documentLink),
    ]);

    // Read text from an element on the newly opened child tab
    const text = await childPage.locator('.red').textContent();
    console.log(text);

    // --- EXTRACT EMAIL DOMAIN ---
    // Split on '@' to separate local part and domain: ['mentor', 'rahulshettyacademy.com ...']
    const email_format = await childPage.locator('.red').textContent();
    const array_text = await email_format.split('@');
    console.log(array_text);

    // Split on space and take index [0] to isolate just the domain name (e.g. "rahulshettyacademy.com")
    const domain = array_text[1].split(" ")[0];
    console.log(domain);

    // --- READ ALL EMAIL LINKS FROM CHILD PAGE ---
    const red_mail = await childPage.locator('[href*="academy.com"]').allTextContents();
    console.log(red_mail);
    const email = red_mail[10]; // Pick the 11th email link from the list
    console.log(email);

    // --- FILL THE ORIGINAL PAGE WITH DATA FROM CHILD PAGE ---
    // The original page (page) is still open; fill its username input with the extracted email
    await page.locator('#username').fill(email);

    // textContent() reads inner text of the element — does NOT work for <input> values
    const login_email_value = await page.locator('#username').textContent();
    console.log(login_email_value); // Will print empty — use inputValue() for <input> fields

    // inputValue() correctly reads the current value of an <input> element
    const login_email_input_value = await page.locator('#username').inputValue();
    console.log(login_email_input_value);

    await page.pause();
});
