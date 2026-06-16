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

    browserName: 'chromium',  // Set the browser to use for testing. In this case, it's set to 'chromium', which means tests will run on the Chromium browser (the open-source project behind Google Chrome). You can change this to 'firefox' or 'webkit' if you want to test on those browsers instead.
    headless: false, // Set headless mode to false, which means that the browser will be launched in a visible window during testing. This is useful for debugging and visually observing the test execution. If set to true, the browser will run in the background without a UI.
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */

    screenshot: 'on', // Set screenshot capture to 'on', which means that Playwright will take screenshots of the browser during test execution. This can be helpful for debugging and understanding test failures, as you can see the state of the application at various points in the test.
//    trace: 'on', // Set trace collection to 'on', which means that Playwright will capture detailed information about the test execution, including network requests, DOM snapshots, and other relevant data. This can be helpful for debugging and understanding test failures.
    trace: 'retain-on-failure', // on, off // Set trace retention to 'retain-on-failure', which means that Playwright will keep the trace information only for tests that fail. This helps to save storage space by not retaining traces for successful tests, while still providing valuable debugging information for failed tests.

  },


});

module.exports = configuration;