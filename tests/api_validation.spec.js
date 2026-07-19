/**
 * api_validation.spec.js
 *
 * Tests the end-to-end order placement flow using a hybrid approach:
 *  - Order is CREATED via the API (fast, no UI interaction needed)
 *  - Order history is VERIFIED through the browser UI
 *
 * This pattern avoids the slow UI checkout flow while still validating
 * that data created through the API is correctly rendered in the front-end.
 */

const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/api_utils');

// Login credentials for the test account
const loginPayload = {
    userEmail: "dsa@yopmail.com",
    userPassword: "Test@1234"
};

// Order details: country and the product's database ID to be ordered
const orderPayLoad = { orders: [{ country: "Cuba", productOrderedId: "67a8dde5c0d3e6622a297cc8" }] };

// Shared object to hold { token, orderId } returned by the API after order creation
let response;

/**
 * beforeAll — runs once before all tests.
 * Creates an order via API and stores the auth token + order ID for use in tests.
 * Using beforeAll (not beforeEach) because order creation is expensive — we reuse the same order across tests.
 */
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APiUtils(apiContext, loginPayload);
    response = await apiUtils.createOrder(orderPayLoad);
});


/**
 * Test: Verify that an order created via API appears correctly in the "My Orders" UI.
 *
 * Steps:
 *  1. Inject the auth token into localStorage — skips the login UI entirely.
 *  2. Navigate to the app and open "My Orders".
 *  3. Scan the orders table for a row whose order ID matches the one returned by the API.
 *  4. Click "View" on that row and assert the order detail page shows the same order ID.
 */
test('@API Place the order', async ({ page }) => {

    // Inject the JWT token into localStorage before page load so the app treats the session as authenticated
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    await page.goto("https://rahulshettyacademy.com/client");

    // Navigate to the order history page
    await page.locator("button[routerlink*='myorders']").click();

    // Wait for the orders table to populate
    await page.locator("tbody").waitFor();
    const rows = await page.locator("tbody tr");

    // Iterate through each row to find the row matching our API-created order ID
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator("th").textContent();

        if (response.orderId.includes(rowOrderId)) {
            // Found the matching row — click the View/Details button
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    // Read the order ID displayed on the order detail page
    const orderIdDetails = await page.locator(".col-text").textContent();

    // Assert the detail page shows the same order ID that the API returned
    expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
});
