import {test, expect } from 'playwright/test';

test('Screenshot test', async ({ page }) => {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    await page.locator('#username').fill("Prakash Rawat");
    await page.locator('#username').screenshot({ path: 'username_input.png' });
    await page.locator('#password').fill("Connect");
    await page.locator('#password').screenshot({ path: 'password_input.png' });
    await page.pause();
});

test.only('Screenshot validation test', async ({page}) => {
    await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    expect(await page.screenshot()).toMatchSnapshot('orangehrm.png', {maxDiffPixel: 10});
    //expect(await page.screenshot()).toHaveScreenshot('orangehrm.png');
    console.log('Screenshot validation test completed');
});
