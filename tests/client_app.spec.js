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


test('Radio & Checkbox Buttons', async({browser})=> {

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

    console.log(await page.locator('.radiotextsty').last().isChecked()); 
    expect(await page.locator('.radiotextsty').last()).toBeChecked(); // This line of code is using the Playwright testing library to assert that the last element with the class 'radiotextsty' on the page is currently checked (selected). The toBeChecked() assertion checks if the specified element is in a checked state, which is typically used for radio buttons or checkboxes. If the assertion fails, it will throw an error indicating that the expected condition was not met.

    // Checkbox terms and conditions
    //const terms = await page.locator('.text-white.termsText').textContent();
    const terms = await page.locator('.text-white.termsText').inputValue();
    console.log(terms);
    const belowdetails = await page.locator('.text-center.text-white').textContent();
    console.log(belowdetails);
   // const checkbox = await page.locator("[type='checkbox']").click();

   // if u want to check the check box
    await page.locator("[type='checkbox']").click(); // check if the checkbox with the specified selector is currently checked (selected) or not. It returns a boolean value (true or false) indicating the state of the checkbox.
    const checkbox = await page.locator("[type='checkbox']").isChecked(); // check if the checkbox with the specified selector is currently checked (selected) or not. It returns a boolean value (true or false) indicating the state of the checkbox.
    console.log(checkbox);
    await page.locator("[type='checkbox']").uncheck();
    expect(await page.locator("[type='checkbox']").isChecked()).toBeFalsy();  // This line of code is using the Playwright testing library to assert that the checkbox with the specified selector is not checked (unchecked). The toBeFalsy() assertion checks if the specified value is falsy, which means it evaluates to false in a boolean context. In this case, it checks if the checkbox is not selected. If the assertion fails, it will throw an error indicating that the expected condition was not met.
    
    // expect is adding without await bcoz await is used to wait for the promise to resolve and return the value, while expect is used to make assertions on that value. In this case, we are asserting that the checkbox is not checked (unchecked) after we have unchecked it. The assertion will be evaluated immediately without waiting for any asynchronous operations, as the state of the checkbox has already been determined by the previous actions in the test.
    // we have added await inside brackets because operations is performing inside the brackets and we want to wait for that operation to complete before making the assertion. In this case, we are waiting for the isChecked() method to return the state of the checkbox before asserting that it is falsy (unchecked). This ensures that we are making the assertion based on the most up-to-date state of the checkbox after we have performed the uncheck action.


    //await expect(page.locator("[type='checkbox']").isChecked()).toBeTruthy(); // This line of code is using the Playwright testing library to assert that the checkbox with the specified selector is checked (selected). The toBeTruthy() assertion checks if the specified value is truthy, which means it evaluates to true in a boolean context. In this case, it checks if the checkbox is selected. If the assertion fails, it will throw an error indicating that the expected condition was not met.

    // Blinking Text
    const locator = await page.locator('.blinkingText');
    const documentLink = await page.locator('[href*="documents-request"]');
    await expect(documentLink).toHaveAttribute("class", "blinkingText"); // This line of code is using the Playwright testing library to assert that the element located by the locator variable, which is expected to have a class attribute with the value "blinkingText". The toHaveAttribute() assertion checks if the specified element has the specified attribute with the expected value. If the assertion fails, it will throw an error indicating that the expected condition was not met.

    //await page.pause(); // pause the test execution, which allows you to inspect the state of the page and interact with it manually before resuming the test. This is useful for debugging and analyzing the behavior of the application during testing.
    //await browser.close(); // close the browser instance after the test is completed to free up system resources and ensure that there are no lingering browser processes running in the background.
});



test("Another Child Window", async({browser})=> {
    const bcontext = await browser.newContext();
    const page = await bcontext.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentLink = await page.locator('[href*="documents-request"]')

    const [childPage] = await Promise.all([
    
        // Listen for any new page pending, rejected, fulfilled.
        //How can you identify if a new page has successfully opened after clicking a link? : Using waitForEvent() method to listen for the 'page' event, which is triggered when a new page is opened. By using this method, you can ensure that the test waits for the new page to open before proceeding with any further actions or assertions on that page. This helps to avoid any timing issues and ensures that the test interacts with the new page only after it has been fully loaded and is ready for interaction.
        
        bcontext.waitForEvent('page'), // wait for the new page (child window) to open after clicking the document link. This is necessary because the click action may trigger the opening of a new window, and we need to wait for that event to occur before proceeding with any further actions or assertions on the new page.
        //listen for any new page pending,rejected,fulfilled
        documentLink.click(),
        console.log(documentLink),
    ])  // new page is opened

    const text = await  childPage.locator('.red').textContent(); // locate the element with the class 'red' on the new page and retrieve its text content. This is typically used to extract specific information from the new page after it has been opened.
    console.log(text);

    // Split
    const email_format = await childPage.locator('.red').textContent();
    const array_text = await email_format.split('@'); 
    console.log(array_text);
    const domain = array_text[1].split(" ")[0]; // split the second part of the email address (after the '@' symbol) by space and take the first part, which is typically the domain name of the email address. This is done to extract the domain from the email address for further processing or assertions in the test.
    console.log(domain);

    // Using Array Format
    const red_mail = await childPage.locator('[href*="academy.com"]').allTextContents(); 
    console.log(red_mail);
    const email = red_mail[10];
    console.log(email);

    // Need to add this email in login page.

    const login_email = await page.locator('#username').fill(email);

    console.log(login_email);
    console.log("------------------------------");
    
    const login_email_value = await page.locator('#username').textContent(); 
    console.log(login_email_value); // value will not print because textContent() is used to retrieve the text content of an element, but in this case, we are trying to retrieve the value of an input field (username) which does not have any text content. Instead, we should use the inputValue() method to retrieve the value of the input field.
    
    console.log("------------------------------");
    const login_email_input_value = await page.locator('#username').inputValue();
    // const login  = await page.locator();
    console.log(login_email_input_value);  
    await page.pause();
    
    // Give an error because we are trying to locate the element with the class 'red' on the original page (page) instead of the new page (childPage) where the element 
    //const text = await  page.locator('.red').textContent(); // locate the element with the class 'red' on the new page and retrieve its text content. This is typically used to extract specific information from the new page after it has been opened.

});