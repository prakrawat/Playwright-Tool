/**
 * calendar.spec.js
 *
 * Tests the React date picker on the GreenKart offers page.
 * Demonstrates how to interact with a multi-step calendar widget:
 *  1. Click the date input to open the calendar
 *  2. Drill up to year view by clicking the month/year label twice
 *  3. Select a year → month → day
 *  4. Validate each input field's value matches the expected date parts
 */

import { expect, test } from 'playwright/test';

test('calendar test', async ({ browser }) => {

    // Target date to select — defined as strings to match input field values exactly
    const month = "6";
    const date = "20";
    const year = "2024";

    // Ordered array used to validate the three date input fields (month, day, year)
    const input_values = [month, date, year];

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
    expect(await page.getByText("GREENKART")).toBeVisible();

    // --- OPEN CALENDAR & DRILL TO YEAR VIEW ---
    // Click the date input group to open the calendar popup
    await page.locator(".react-date-picker__inputGroup").click();

    // Clicking the navigation label once goes to year view; clicking twice goes to decade view.
    // Two clicks are needed here to reach the year list so we can select 2024.
    await page.locator(".react-calendar__navigation__label").click();
    await page.locator(".react-calendar__navigation__label").click();

    // --- SELECT YEAR ---
    await page.getByText(year).click();

    // --- SELECT MONTH ---
    // Month buttons are zero-indexed in the calendar grid, so subtract 1 from the month number.
    // Number() converts the string "6" to the integer 6 before the subtraction.
    await page.locator(".react-calendar__year-view__months__month").nth(Number(month) - 1).click();

    // --- SELECT DAY ---
    // XPath locator: selects the <abbr> element whose text matches the exact day number.
    // String concatenation builds a dynamic XPath: //abbr[text()='20']
    await page.locator("//abbr[text()='" + date + "']").click();

    // --- VALIDATE DATE INPUT FIELDS ---
    // The date picker renders three separate input fields: month, day, year.
    // We read each field's value and compare it against our expected input_values array.
    const inputs = await page.locator(".react-date-picker__inputGroup__input");

    for (let i = 0; i < input_values.length; i++) {
        const value = await inputs.nth(i).inputValue(); // inputValue() reads the current value of an <input>
        expect(value).toEqual(input_values[i]);
        console.log(`Printing value: ${value} Passed for input: ${input_values[i]}`);
    }

    // Pause for manual inspection — remove before committing to CI
    await page.pause();
});
