const {test, expect} = require('playwright/test') // import the test from the Playwright testing library


test('Client App test : Testcase One', async({browser}) => {

    const context = await browser.newContext(); // it's like a new fresh instance of browser (new context) and we can inject the cookies or plugins info if we want to, but in this case we are creating a fresh instance with cookies.
    const page = await context.newPage(); // create a new page in the browser context, which represents a single tab or window in browser.
    await page.goto('https://rahulshettyacademy.com/client'); // navigate to the specified URL, which is the client application of Rahul Shetty Academy. 
    
    // console.log(await page.locator('.title').textContent());

    await page.locator('[id="userEmail"]').fill('dummyaccount@yopmail.com');
    await page.locator('[id="userPassword"]').fill('Test@1234');
    await page.locator('#login').click();
    await page.waitForLoadState('networkidle'); // wait for the network to be idle, which means that all the network requests have been completed and there are no more pending requests. This is useful to ensure that the page has fully loaded before proceeding with any further actions or assertions.


   //console.log(await page.locator('.card-body b').nth(0).textContent());
   console.log(await page.locator('.card-body b').allTextContents());
   console.log(await page.locator('.text-muted').allTextContents());

});


test.only('Radio & Checkbox Buttons', async({browser})=> {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    console.log(await page.locator("[for='username']"));
    await page.locator('#username').fill('rahulshettyacademy');
    console.log(await page.locator("[for='password']"));
    await page.locator('#password').fill('Learning@830$3mK2');

    // Page Loader
    await page.waitForLoadState('networkidle'); // wait for the network to be idle, which means that all the network requests have been completed and there are no 

    // Dropdown Value Print
    const dropdown_values = await page.locator('select.form-control').allTextContents(); // This line of code is using the Playwright testing library to locate all elements on the page that have a type attribute with the value "option" and then retrieves their text content. The retrieved text content is stored in the variable dropdown_values, which can be used later in the test for assertions or further processing.
    console.log(dropdown_values)

    // Drodpown
    const dropdown = await page.locator('select.form-control');
    await dropdown.selectOption('Consultant'); // select the option with the value 'Consultant' from the dropdown menu.
    
    // Radio Button Values
    const radio_button_values = await page.locator('.radiotextsty').allTextContents();
    console.log(radio_button_values);

    // Radio Button
    const radiobutton = await page.locator('.checkmark').last().click(); // click on the last radio button with the class 'checkmark' on the page. This is typically used to select a specific option from a group of radio buttons.
    await page.locator('#okayBtn').click();

    // Checkbox terms and conditions
    const terms = await page.locator('.text-white.termsText').textContent();
    console.log(terms);
    const belowdetails = await page.locator('.text-center.text-white').textContent();
    console.log(belowdetails);
    const checkbox = await page.locator("[type='checkbox']").click();
    console.log(checkbox);


    await page.pause(); // pause the test execution, which allows you to inspect the state of the page and interact with it manually before resuming the test. This is useful for debugging and analyzing the behavior of the application during testing.
    await browser.close(); // close the browser instance after the test is completed to free up system resources and ensure that there are no lingering browser processes running in the background.
});