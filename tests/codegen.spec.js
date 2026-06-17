import {test, expect} from '@playwright/test';


// codegen is a command-line tool that generates Playwright test code based on user interactions with a web application. It allows you to record your actions on a website and then generates the corresponding Playwright code that can be used in your test scripts. This can be helpful for quickly creating test cases without having to manually write the code for each interaction. You can use the generated code as a starting point and then customize it as needed for your specific testing requirements.
// npx playwright codegen 'url' use for generating the code for the specified URL. 
// For example, if you want to generate code for the website 'https://example.com', you can run the following command in your terminal:

test('Code Generation', async ({page}) => {
    await page.goto('https://rahulshettyacademy.com/client');
    // Add your test steps here
    
});

