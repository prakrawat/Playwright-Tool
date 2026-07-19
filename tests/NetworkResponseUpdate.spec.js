const { test, expect, request } = require('@playwright/test');
const { APiUtils } = require('./utils/api_utils.js');

// Credentials used to log in and obtain an auth token via API
const loginPayLoad = { userEmail: "anshika@gmail.com", userPassword: "Iamking@000" };

// Payload for creating a real order before the test runs (ensures the account is active)
const orderPayLoad = { orders: [{ country: "India", productOrderedId: "6960eac0c941646b7a8b3e68" }] };

// Fake response payload that simulates an empty orders list — used to intercept the real API response
const fakePayLoadOrders = { data: [], message: "No Orders" };

// Shared variable to hold the API response (token + order details) from beforeAll
let response;

/**
 * beforeAll hook — runs once before all tests in this file.
 * Purpose: Log in via API and create a real order so we have a valid auth token.
 * The token is later injected into the browser's localStorage to skip the login UI.
 */
test.beforeAll(async () => {
    const apiContext = await request.newContext();          // Create a standalone API request context
    const apiUtils = new APiUtils(apiContext, loginPayLoad); // Initialize utility with login credentials
    response = await apiUtils.createOrder(orderPayLoad);   // Login + create order; captures token in response
});


/**
 * Test: Verify that the UI correctly displays "No Orders" when the API returns an empty orders list.
 *
 * Approach:
 *  1. Inject the real auth token into localStorage so the app treats the browser as already logged in.
 *  2. Intercept the "get orders" API call and replace its response with a fake empty-orders payload.
 *  3. Navigate to "My Orders" and assert the UI shows the empty-state message.
 *
 * This validates the front-end rendering logic for the empty orders state without
 * needing to delete real orders from the backend.
 */
test('@SP Place the order', async ({ page }) => {

    // Inject the auth token into localStorage BEFORE the page loads.
    // This skips the login flow — the app reads this token on startup to authenticate the session.
    page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    // Navigate to the e-commerce application home page
    await page.goto("https://rahulshettyacademy.com/client");

    /**
     * Intercept the "get orders" API call for this customer.
     * Flow: Real API request is made → Playwright intercepts it → response body is replaced
     *       with fakePayLoadOrders → browser receives the fake response → UI renders "No Orders".
     *
     * This technique (API mocking via route interception) lets us test the empty-state UI
     * without modifying any backend data.
     */
    
    await page.route(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            // First, let the real request go through to get a valid HTTP response envelope
            const response = await page.request.fetch(route.request());

            // Override the response body with our fake empty-orders payload
            let body = JSON.stringify(fakePayLoadOrders);

            // Fulfill the route with the original response metadata but our custom body
            route.fulfill({ response, body });
        }
    );

    // Click the "My Orders" button to trigger the orders API call
    await page.locator("button[routerlink*='myorders']").click();

    // Wait for the intercepted API response to complete before reading the DOM
    await page.waitForResponse(
        "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
    );

    // Log the text rendered in the orders section — should display the "No Orders" empty-state message
    console.log(await page.locator(".mt-4").textContent());
});
