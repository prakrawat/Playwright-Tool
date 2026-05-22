// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */

const configuration =({
  testDir: './tests',
  timeout: 40 * 1000, // overide default test timeout of 30 seconds, and set it to 40 seconds (40 * 1000 milliseconds).
  expect: {
    timeout: 50 * 1000, // overide default expect timeout of 5 seconds, and set it to 50 seconds (50 * 1000 milliseconds).
  },
  reporter: 'html', // Set the reporter to 'html', which means that test results will be generated in an HTML format. This allows you to easily view and analyze test results in a web browser.

  use: {

    browserName: 'firefox',  // Set the browser to use for testing. In this case, it's set to 'chromium', which means tests will run on the Chromium browser (the open-source project behind Google Chrome). You can change this to 'firefox' or 'webkit' if you want to test on those browsers instead.
    headless: false, // Set headless mode to false, which means that the browser will be launched in a visible window during testing. This is useful for debugging and visually observing the test execution. If set to true, the browser will run in the background without a UI.
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
  },


});

module.exports = configuration;