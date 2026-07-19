/**
 * NetworkBodyUpdate.spec.js
 *
 * Security/authorization test that verifies the application correctly blocks access
 * to an order that does not belong to the logged-in user.
 *
 * Technique used: Request URL tampering via route.continue({ url })
 * ---------------------------------------------------------------
 * Playwright's page.route() intercepts outgoing network requests matching a URL pattern.
 * Instead of faking a response (route.fulfill), this test uses route.continue() to let
 * the request proceed to the real server — but with the order ID in the URL swapped
 * to a different (unauthorized) order ID.
 *
 * This simulates an Insecure Direct Object Reference (IDOR) attack scenario:
 * a logged-in user manually crafting a URL to view another user's order.
 * The expected behaviour is that the server rejects the request with an
 * "not authorized" message, proving the backend enforces ownership checks.
 *
 * Flow:
 *  1. Log in via the UI as a real user
 *  2. Navigate to "My Orders"
 *  3. Register a route intercept that rewrites the order-detail API URL with a foreign order ID
 *  4. Click "View" on the first order — the intercept fires and the tampered URL is sent
 *  5. Assert the page shows the authorization error message
 */

const { test, expect } = require('@playwright/test');

test('@QW Security test request intercept', async ({ page }) => {

    // --- STEP 1: LOGIN VIA UI ---
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").fill("anshika@gmail.com");
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("[value='Login']").click();

    // Wait until all network activity settles — ensures the product grid has loaded
    await page.waitForLoadState('networkidle');

    // Wait for at least one product card to appear before navigating away
    await page.locator(".card-body b").first().waitFor();

    // --- STEP 2: NAVIGATE TO MY ORDERS ---
    await page.locator("button[routerlink*='myorders']").click();

    // --- STEP 3: REGISTER THE REQUEST URL INTERCEPT ---
    // page.route() intercepts any request whose URL matches the pattern.
    // The '*' wildcard matches any order ID in the query string (?id=<anything>).
    //
    // route.continue({ url }) differs from route.fulfill():
    //   - route.fulfill()  → returns a completely fake response, never hits the server
    //   - route.continue() → forwards the request to the real server, but with a modified URL
    //
    // Here we redirect every order-detail request to a hardcoded foreign order ID
    // (621661f884b053f6765465b6) that belongs to a different user account.
    await page.route(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route => route.continue({
            url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6'
        })
    );

    // --- STEP 4: TRIGGER THE INTERCEPTED REQUEST ---
    // Clicking "View" fires the order-detail API call — the route intercept swaps its URL.
    // The real server receives the tampered ID and responds with an authorization error.
    await page.locator("button:has-text('View')").first().click();

    // --- STEP 5: ASSERT THE AUTHORIZATION ERROR IS DISPLAYED ---
    // The server rejects access to another user's order.
    // page.locator("p").last() targets the last <p> tag on the page, which renders the API error message.
    // toHaveText() asserts an exact string match (not partial).
    await expect(page.locator("p").last()).toHaveText("You are not authorize to view this order");
});
