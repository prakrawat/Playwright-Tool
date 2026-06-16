const { test, expect } = require('@playwright/test');  // import the test from the Playwright testing library

// One testcase is defined here, and it will be run by Playwright when the tests are executed. The test is currently empty and does not perform any actions or assertions.

// test keyword help us to recognize that this is a testcase.
// if we have 3 line of code, no gurantee to execute code sequentially, but if we have 3 testcases. to solve this issue we have to write await to perform sequential execution of code.


//In JavaScript, nesting means placing one construct (like an object, function, or loop) inside another to create a hierarchical or structured relationship.
//It’s a way to organize code and data more clearly, especially when dealing with complex logic or multi-level data structures.

// Javascript is a asynchronous programming language, which means that it can execute multiple operations at the same time without blocking the main thread. 
// async use for handling asynchronous operations, such as API calls, file reading/writing, or any operation that takes time to complete. 
// It allows you to write code that looks synchronous but behaves asynchronously, making it easier to read and maintain. When you mark a function as async, 
// it can use the await keyword to pause execution until a promise is resolved, allowing for cleaner and more efficient handling of asynchronous tasks.

// ()=> arrow function we can use instead of function keyword, it is a shorter syntax for writing functions in JavaScript.
//test('First Playwright Test', async function()

test('FirstTestcase', async ({ browser }) => {
    // playwright code
    // step1 - login to portal
    // step2 - ente user/password
    // step3 - click

    // chrome - plugins/ cookies info which previous used 
    // have to create fresh browser instance for each test case, to avoid any issue with previous test case.
    const context = await browser.newContext(); // it's like a new fresh instance of browser (new context) and we can inject the cookies or plugins info if we want to, but in this case we are creating a fresh instance with cookies.
    const page = await context.newPage();
    await page.goto('https://demowebshop.tricentis.com/');

});

// Second testcase added here, and it will also be run by Playwright when the tests are executed. This test case is currently empty and does not perform any actions or assertions.

test('test2', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    
    const title = await page.title();
    console.log(`Printing Title of Githubio site: ${title}`);
    await expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');

    //css, xpath selectors
    //  await page.locator('input#Email').type('prakashrawattt@gmail.com'); // type is depricated in version 1.30, so we have to use fill instead of type.
    await page.locator('input#username').fill('prakashrawattt@gmail.com');
    await page.locator('input#password').fill('NewPassword@123');
    await page.locator('[type="submit"]').click();
    const error_text = await page.locator('[style*="block"]').textContent();
    console.log(`Printing text: ${error_text}`);
    await expect(page.locator('[style*="block"]')).toContainText("Incorrect username/password."); // assertion to check if the error text contains the word 'Incorrect' or not.
    //await expect(error_text).toHaveText("Incorrect username/password."); // assertion to check if the error text contains the word 'Incorrect' or not.
    
    // fill method gave us to 
    await page.locator('input#username').fill("");
    await page.locator('input#username').fill("rahulshettyacademy");

    await page.locator('input#password').fill("");
    await page.locator('input#password').fill("Learning@830$3mK2");
    
    await page.locator('[type="submit"]').click();

    // if u have multiple element with same locator, then you can use nth() method to select the specific element from the list of elements.
   // console.log(await page.locator('.card-body a').first().textContent());
   // console.log(await page.locator('.card-body a').nth(0).textContent());
   // console.log(await page.locator('.card-body a').nth(1).textContent());
    console.log(await page.locator('.card-body a').last().textContent());

    // displaying the text of all the elements with the locator '.card-body a' using a loop.
    const allTexts = await page.locator('.card-body a').allTextContents(); 
    console.log(allTexts);

});



/*
// test.only is a method provided by testing frameworks like Playwright to run only a specific test case while ignoring the others.
test.only('test3', async ({ page }) => {
    await page.goto('https://www.google.com');
});

*/

// Demo Site https://demowebshop.tricentis.com/login