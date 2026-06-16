//import {expect, test} from '@playwright/test'
const {expect, test} = require('@playwright/test');


test('More Validation', async({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/');
    await page.goto('https://google.com');
    await page.goBack();
    await page.forward();
})