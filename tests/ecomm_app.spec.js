const { test, expect } = require('playwright/test');

// dummyaccountplaywright@yopmail.com
// Pass@12345

test('Ecomm Login', async ({ browser }) => {

    // Credentials and URL for the e-commerce application
    const URL = "https://rahulshettyacademy.com/client";
    const email = "dummyaccountplaywright@yopmail.com";
    const password = 'Pass@12345';
    const product_name = "ADIDAS ORIGINAL";

    // Creating a new browser context and page for the test case
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigating to the e-commerce application login page
    const products = page.locator('.card-body');
    await page.goto(URL);
    await page.locator("[type='email']").fill(email);
    await page.locator("[type='password']").fill(password);
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');

    // Assertion to check if the user is successfully logged in by verifying the presence of the "Products" text on the page.
    await page.locator(".card-body").first().waitFor();
    const card_details = await page.locator(".card-body").allTextContents();
    console.log(`Printing all Card details: ${card_details}`);

    // Assertion to check if the "Products" text is present in the first card body element, which indicates that the user has successfully logged in and is on the products page.
    const titles = await page.locator(".card-body b").allTextContents();
    console.log(`Printing all the product titles: ${titles}`);

    // Counting the number of products displayed on the home page after login and printing it to the console.
    const count = await products.count();
    console.log(`Total products: ${count}`);

    // Logic to verify if the desired product (ADIDAS ORIGINAL) is present in the list of products displayed on the home page after login. 
    const desired_product = await page.locator(".card-body b").filter({ hasText: product_name }).first();

    for (let i = 0; i < count; i++) {
        const product_title = await products.nth(i).locator("b").textContent();
        //console.log(`Printing product title: ${await product_title.locator("b").textContent()}`);
        console.log(`Printing product title: ${product_title}`);
        if (product_title === product_name) {
            await products.nth(i).locator("text= Add To Cart").click();
        }
        break;
    };

    console.log(" Add to Cart Successfully clicked for the desired product.");

    // Add to Cart Page
    const cart_button = await page.locator("[routerlink*='cart']").click();

    // wait till list is loading in the add to cart page.
    await page.locator("div li").first().waitFor();
    const cart_products = await page.locator("div li").allTextContents();

    // isVisible() method is used to check if the desired product is visible in the cart page after adding it to the cart. It returns a boolean value indicating whether the element is visible or not.
    // isVisible() don't have to wait for the element to be visible, it will return false if the element is not visible, but it will not throw an error. So we can use it to check if the desired product is added to the cart or not.

    // h3:has-text('ADIDAS ORIGINAL') is a CSS selector that selects an h3 element that contains the text 'ADIDAS ORIGINAL'. This selector is used to check if the desired product is added to the cart by verifying its visibility on the cart page.
    const valid_product_added = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
    console.log(`Is the desired product added to the cart? ${valid_product_added}`);

    // Assertion to check if the desired product is successfully added to the cart by verifying its visibility on the cart page.
    expect(valid_product_added).toBeTruthy();

    // Click on Chekckout
    //await page.locator("[class ='btn btn-primary']").click();
    await page.locator("text=Checkout").click();

    // Wait for the checkout page to load and display the list of products in the cart.
    await page.locator("[placeholder*='Select Country']").pressSequentially("ind", { delay: 200 });
    const dropdown = await page.locator(".ta-results"); // Type 'ind' in the country selection input field to trigger the dropdown list of countries, and then select the desired country from the list.
    await dropdown.first().waitFor();
    const dropdown_count = await dropdown.locator("button").count();
    console.log(`Total dropdown options: ${dropdown_count}`);
    const dropdown_text_value = "India";

    for (let i = 0; i < dropdown_count; i++) {
        let dropdown_text = await dropdown.locator("button").nth(i).textContent();

        console.log(`Printing dropdown text: ${dropdown_text}`);

        //if (dropdown_text === " India") {
        //if (dropdown_text.includes() === "India") {
        if (dropdown_text.trim() === dropdown_text_value) {
            await dropdown.locator("button").nth(i).click();
            break;
        }
    }

    // page.pause() is a method provided by Playwright that allows you to pause the execution of the test at a specific point. which 
    await page.pause();


});