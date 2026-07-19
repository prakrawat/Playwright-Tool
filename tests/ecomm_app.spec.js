/**
 * ecomm_app.spec.js
 *
 * Full end-to-end test for the e-commerce application covering:
 *  - Login with email/password via the UI
 *  - Finding a specific product on the home page
 *  - Adding it to the cart
 *  - Proceeding to checkout and selecting a country from a dynamic dropdown
 *
 * Uses the `browser` fixture (manual context/page creation) to demonstrate
 * how to create a fresh browser context explicitly.
 *
 * Test account: dummyaccountplaywright@yopmail.com / Pass@12345
 */

const { test, expect } = require('playwright/test');

test('Ecomm Login', async ({ browser }) => {

    const URL = "https://rahulshettyacademy.com/client";
    const email = "dummyaccountplaywright@yopmail.com";
    const password = 'Pass@12345';
    const product_name = "ADIDAS ORIGINAL";

    // Manually create a fresh browser context and page.
    // This isolates this test from any cookies or storage left by other tests.
    const context = await browser.newContext();
    const page = await context.newPage();

    // --- LOGIN ---
    await page.goto(URL);
    await page.locator("[type='email']").fill(email);
    await page.locator("[type='password']").fill(password);
    await page.locator("#login").click();

    // Wait for the products page to fully load (no pending network requests)
    await page.waitForLoadState('networkidle');

    // --- PRODUCTS PAGE ---
    const products = page.locator('.card-body');

    // Wait for at least one product card to appear before reading the DOM
    await page.locator(".card-body").first().waitFor();

    const card_details = await page.locator(".card-body").allTextContents();
    console.log(`Printing all Card details: ${card_details}`);

    const titles = await page.locator(".card-body b").allTextContents();
    console.log(`Printing all the product titles: ${titles}`);

    const count = await products.count();
    console.log(`Total products: ${count}`);

    // --- ADD TO CART ---
    // Iterate through product cards to find the target product by name and click "Add To Cart"
    for (let i = 0; i < count; i++) {
        const product_title = await products.nth(i).locator("b").textContent();
        console.log(`Printing product title: ${product_title}`);
        if (product_title === product_name) {
            await products.nth(i).locator("text= Add To Cart").click();
        }
        break;
    }
    console.log("Add to Cart Successfully clicked for the desired product.");

    // --- CART PAGE ---
    await page.locator("[routerlink*='cart']").click();

    // Wait for the cart items list to render before asserting
    await page.locator("div li").first().waitFor();
    const cart_products = await page.locator("div li").allTextContents();

    // isVisible() returns false immediately if the element is absent — does NOT throw.
    // Useful for soft checks where the element might not exist yet.
    const valid_product_added = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    console.log(`Is the desired product added to the cart? ${valid_product_added}`);
    expect(valid_product_added).toBeTruthy();

    // --- CHECKOUT ---
    await page.locator("text=Checkout").click();

    // Type "ind" slowly to trigger the autocomplete dropdown for country selection
    await page.locator("[placeholder*='Select Country']").pressSequentially("ind", { delay: 200 });
    const dropdown = await page.locator(".ta-results");

    // Wait for the dropdown suggestions to appear
    await dropdown.first().waitFor();
    const dropdown_count = await dropdown.locator("button").count();
    console.log(`Total dropdown options: ${dropdown_count}`);

    const dropdown_text_value = "India";

    // Find "India" in the dropdown list and click it
    for (let i = 0; i < dropdown_count; i++) {
        let dropdown_text = await dropdown.locator("button").nth(i).textContent();
        console.log(`Printing dropdown text: ${dropdown_text}`);

        // trim() removes leading/trailing whitespace that the API may include around option text
        if (dropdown_text.trim() === dropdown_text_value) {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    // Pause for manual inspection — remove before committing to CI
    await page.pause();
});
