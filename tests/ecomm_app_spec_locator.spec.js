/**
 * ecomm_app_spec_locator.spec.js
 *
 * Full end-to-end purchase flow for the e-commerce client app using
 * Playwright's modern semantic locators:
 *  - getByPlaceholder()  — targets inputs by their placeholder text
 *  - getByRole()         — targets elements by ARIA role + accessible name
 *  - getByText()         — targets elements by visible text content
 *  - filter()            — narrows a locator set to items matching a condition
 *
 * These locators are preferred over raw CSS/XPath because they reflect how
 * real users perceive and interact with the UI, making tests more resilient
 * to markup changes.
 */

import { test, expect } from 'playwright/test';

test('@Webst Client App login', async ({ page }) => {

    const email = "anshika@gmail.com";
    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

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
