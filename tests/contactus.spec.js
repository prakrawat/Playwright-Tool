import {expect, test} from 'playwright/test';

test('Contact Us', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // Practice fill and type method 
    await page.locator('.form-control').first().fill('Name');
    await page.locator("[name='email']").fill('name@yopmail.com');

    // getByLabel is used to get the element by its label text, and then we can perform actions on that element, such as clicking or filling it with text.
    // Mostly used for checkboxes and radio buttons, but it can also be used for other types of form elements that have associated labels.

    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Employed').check(); 
    await page.getByLabel('Gender').selectOption('Female'); 

    // getByPlaceholder is used to get the element by its placeholder text
    await page.getByPlaceholder("Password").fill("abc1234");

    // getByRole is used to get the element by its role and name
    await page.getByRole("button", {name: "Submit"}).click(); // click on the submit button

    //getByText is used to get the element by its text content
    const success_text = await page.getByText("Success! The Form has been submitted successfully!.").isVisible();
    expect(success_text).toBeTruthy();

    await page.getByRole("link", {name: "Shop"}).click();

    // filter method is used to filter the elements based on the text content

    await page.locator("app-card").filter({hasText: "Blackberry"}).getByRole("button").click(); 
    // click on the add to cart button for the product with text "Blackberry"

    await page.pause();

    // npm playwright test 'file name' --ui use for opening the Playwright Test Runner UI

});
