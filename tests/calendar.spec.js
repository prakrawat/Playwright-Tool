import {expect, test} from 'playwright/test';
//const {test, expect} = require('@playwright/test');

test('calendar test', async({browser})=> {
    const month ="6";
    const date = "20";
    const year = "2024";

    const input_values = [month, date, year];

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    expect(await page.getByText("GREENKART")).toBeVisible();

    await page.locator(".react-date-picker__inputGroup").click();
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    await page.getByText(year).click();

    //await page.locator(".react-calendar__viewContainer").nth(5).click();
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month)-1).click();
    // Number user for converting string to number, and -1 because the month index starts from 0 in the calendar.

    await page.locator("//abbr[text()='" + date + "']").click(); 
    // xpath locator to select the date from the calendar, where date is a variable that holds the value of the date we want to select.
    // text() function is used to select the element based on its text content, and the xpath expression is constructed by concatenating the date variable with the rest of the xpath string.    

    // Date Validation
    const inputs = await page.locator(".react-date-picker__inputGroup__input");

    // Loop through each input field and validate its value against the corresponding value in the input_values array. The inputValue() method is used to get the current value of each input field, and the expect function is used to assert that the value matches the expected value from the input_values array. If the assertion passes, a message is printed to the console indicating that the validation was successful for that input field.

    for(let i=0; i<input_values.length; i++)
    {
        const value = await inputs.nth(i).inputValue();
        expect(value).toEqual(input_values[i]);
        console.log(`Printing value: ${value} Passed for input: ${input_values[i]}`);
    }

    await page.pause();
});
