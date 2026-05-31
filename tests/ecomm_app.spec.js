const { test, expect } = require('playwright/test');

// dummyaccountplaywright@yopmail.com
// Pass@12345

test('Ecomm Login', async ({ browser }) => {

    
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/client");
    const email = page.locator("[type='email']").fill('dummyaccountplaywright@yopmail.com');
    const password = page.locator("[type='password']").fill('Pass@12345');
    await page.locator("#login").click();
    await page.waitForLoadState('networkidle');
    const products = await page.locator(".card-body");


    // Now we're in home page
    console.log(await page.locator('.card-body b').allTextContents());
    //console.log(all_titles);

    //const products_count = await products.count();

});