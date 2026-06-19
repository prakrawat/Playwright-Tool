//import {expect, test} from '@playwright/test'
const { expect, test } = require('@playwright/test');


test('More Validation', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    //await page.goto('https://google.com');
    //await page.goBack();
    //await page.forward();

    await expect(page.locator('#displayed-text')).toBeVisible();
    await page.locator('#hide-textbox').click();
    await expect(page.locator('#displayed-text')).toBeHidden();

    // Handle Modal in playwright
    await page.locator('#alertbtn').click();

    // below mentioned code is used to handle the alert dialog that appears when you click the button with the id 'alertbtn'. The 'page.on' method listens for the 'dialog' event, which is triggered when an alert dialog appears. The callback function accepts the dialog object as a parameter and calls the 'accept' method on it to automatically accept the alert dialog without any user interaction. This allows your test to continue running smoothly without being interrupted by the alert.
    page.on('dialog', dialog => dialog.accept());  // Accept the alert dialog 


    await page.locator('#alertbtn').click();
    page.on('dialog', dialog => dialog.dismiss());  // Cancel the alert dialog 


    // Hover playwright
    await page.locator('#mousehover').hover();
    await page.getByText('Reload').click();

    await page.pause();

})


test.only('Child Window Handling', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');

    // Handle Child Window in playwright
    //await page.locator('#courses-iframe').click();

    const frame =await page.frameLocator('#courses-iframe');
    
    // Click on the link that contains "lifetime-access" in its href attribute and is visible
    await frame.locator('li a[href*="lifetime-access"]:visible').click(); 

    const text = await frame.locator('.text h2').textContent();
    console.log(text.split(" ")[1]); // Print the second word of the text content of the h2 element inside the .text class

    await page.pause();

})