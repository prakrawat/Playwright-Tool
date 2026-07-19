/**
 * NetworkApiBlock.spec.js
 *
 * Verifies the full e-commerce purchase flow works correctly even when
 * CSS and image assets are blocked — simulating ad-blockers, CDN failures,
 * or degraded network conditions.
 *
 * Technique: route.abort()
 * -------------------------
 * page.route() intercepts outgoing requests matching a glob pattern.
 * route.abort() drops the request entirely — the browser receives a network
 * error for that resource. Compare with the other two interception methods:
 *
 *  - route.abort()           → kills the request; browser gets a network error
 *  - route.fulfill()         → returns a fake response; server is never contacted
 *  - route.continue({ url }) → forwards to the real server, optionally with a modified URL
 *
 * Why block assets?
 *  - Confirms core functionality (login → cart → checkout) is not coupled to styling or images.
 *  - Speeds up the test by skipping heavy asset downloads.
 *
 * page.on('request') / page.on('response') log each network call and its HTTP status,
 * giving full visibility into what API traffic the test generates at each step.
 *
 * Flow:
 *  1. Block all CSS and image requests before page load
 *  2. Register request + response loggers
 *  3. Login → Add to cart → Checkout → Place order → Assert confirmation
 */
import { test, expect } from 'playwright/test';

test.only('@Webst Client App login', async ({ browser }) => {

    const context = await browser.newContext();
    const page = await context.newPage();

    // --- BLOCK CSS & IMAGE REQUESTS ---
    // Must be registered BEFORE page.goto() so intercepts are active from the very first request.

    // Drops every request whose URL ends in .css — page loads unstyled but fully functional
    page.route('**/*.css', route => route.abort());

    // Drops image requests (.jpg, .png, .jpeg) using glob brace-expansion across all three formats
    page.route('**/*.{jpg, png, jpeg}', route => route.abort());

    const email = "anshika@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

    // --- NETWORK LOGGERS ---
    // page.on('request')  → fires for every outgoing request; logs the HTTP method and URL
    page.on('request', request => console.log('>>', request.method(), request.url()));

    // page.on('response') → fires when a response arrives; logs the URL and HTTP status code.
    // response.status() returns the numeric code (200, 401, 404, etc.) — only available on Response, not Request.
    // response.url() shows which URL returned that status, useful for spotting blocked/failed assets.
    page.on('response', response => console.log('<<', response.url(), response.status()));

    // --- LOGIN ---
    await page.goto("https://rahulshettyacademy.com/client");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
    await page.getByRole('button', { name: "Login" }).click();

    // Wait for the products grid to finish loading before interacting
    await page.waitForLoadState('networkidle');
    await page.locator(".card-body b").first().waitFor();

    // --- ADD TO CART ---
    // filter() scopes the card locator to only the card containing the target product name,
    // then getByRole() clicks the "Add to Cart" button inside that card.
    await page.locator(".card-body")
        .filter({ hasText: "ZARA COAT 3" })
        .getByRole("button", { name: "Add to Cart" })
        .click();

    // --- NAVIGATE TO CART ---
    // getByRole("listitem") + getByRole("button") walks the accessibility tree:
    // finds the list item that contains the "Cart" button in the nav
    await page.getByRole("listitem").getByRole('button', { name: "Cart" }).click();

    // Wait for cart items to load, then assert the product appears in the cart
    await page.locator("div li").first().waitFor();
    await expect(page.getByText("ZARA COAT 3")).toBeVisible();

    // --- CHECKOUT ---
    await page.getByRole("button", { name: "Checkout" }).click();

    // Type "ind" to trigger the country autocomplete dropdown
    await page.getByPlaceholder("Select Country").pressSequentially("ind");

    // nth(1) selects the second "India" button — the dropdown may render a header and an option
    await page.getByRole("button", { name: "India" }).nth(1).click();

    await page.getByText("PLACE ORDER").click();

    // --- ORDER CONFIRMATION ---
    // Assert that the thank-you message is visible, confirming the order was placed successfully
    await expect(page.getByText("Thankyou for the order.")).toBeVisible();
});
