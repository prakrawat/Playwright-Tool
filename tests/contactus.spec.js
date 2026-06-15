import {expect, test} from 'playwright/test';

test('Contact Us', async({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/angularpractice/');

    // getByLable is used to get the element by its label text

    await page.getByLabel('Check me out if you Love IceCreams!').click();
    await page.getByLabel('Employed').check(); 
    await page.getByLabel('Gender').selectOption('Female'); 

    await page.pause();
});