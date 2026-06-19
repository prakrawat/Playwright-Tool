//import { expect, tests, request } from '@playwright/test'
const {test, expect, request} = require('@playwright/test');

const loginPayload = {
    userEmail: "dummyaccountplaywright@yopmail.com",
    userPassword: "Pass@12345"
}

let site_token; // Declare a variable to store the token

test.beforeAll('API Validation', async()=> {
    // create a new context of API request
    const apiContext = await request.newContext();
    const login = await apiContext.post('https://rahulshettyacademy.com/api/ecom/auth/login', {
        data: loginPayload
    }); // will get 200, 201 response code

    expect(login.ok()).toBeTruthy(); // Assert that the login response is successful (status code 200 or 201)

    const responseJSON = await login.json();
    console.log('Login response:', responseJSON);
    site_token = await responseJSON.token;
    console.log('Extracted token:', site_token);
});

// beforeEach is used to run a specific block of code before each test case in the test suite. It is useful for setting up a consistent environment or state for each test, ensuring that tests do not interfere with each other and can be run independently. In this case, it can be used to perform common setup tasks such as navigating to a specific URL, logging in, or initializing variables that are needed for multiple tests.

/*
test.beforeEach(async () => {
})
*/

test('Ecomm Login with token', async({ page })=> {

    // Inject the token into the local storage of the browser context before navigating to the application URL. This allows the test to bypass the login process and directly access the authenticated state of the application.
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, site_token); // Set the token in local storage before the page loads

    await page.goto('https://rahulshettyacademy.com/client');
    await page.waitForLoadState('networkidle');
    const products = await page.locator('.card-body');
    console.log(`Total products: ${await products.count()}`);

});

/*
test('Ecomm Login', async ({ page }) => {

    page.addInitScript( value => {
        window.localStorage.setItem('token', value);
    }, token); // Set the token in local storage before the page loads

    //const context = await browser.newContext();
    //const page = await context.newPage();

    // Credentials and URL for the e-commerce application
    const URL = "https://rahulshettyacademy.com/client";
    const product_name = "ADIDAS ORIGINAL";
    
    // inject token into the local storage and then navigate to the application URL. This allows the test to bypass the login process and directly access the authenticated state of the application, which can be useful for testing features that require authentication without having to go through the login steps in each test case.
    // Set the token in local storage before the page loads



    // Creating a new browser context and page for the test case

    // Navigating to the e-commerce application login page
    //await page.locator("[type='email']").fill(email);
    //await page.locator("[type='password']").fill(password);
    //await page.locator("#login").click();
    
    // Assertion to check if the user is successfully logged in by verifying the presence of the "Products" text on the page.
    //await page.locator(".card-body").first().waitFor();
    await page.goto(URL);
    await page.waitForLoadState('networkidle');
    const products = page.locator('.card-body');
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

*/