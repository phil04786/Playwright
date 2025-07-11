// @ts-check
import { chromium, defineConfig, devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./tests",

  //try to run failed test again
  retries: 1,
  workers: 3,

  /* Run tests in files in parallel */
  // fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  //overall timeout for test case execution
  timeout: 30 * 1000,
  // timeout for assertions
  expect: {
    timeout: 5000,
  },
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  projects: [
    {
      name: "safari",
      /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
      use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        // trace: 'on-first-retry',

        browserName: "webkit",
        headless: false,
        screenshot: "only-on-failure",
        // trace: "on",
        // trace: "retain-on-failure",
        trace: "on",
        //Run on Devices
        // ...devices["iPad (gen 11)"],
      },
    },
    {
      name: "chrome",

      /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
      use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://localhost:3000',
        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        // trace: 'on-first-retry',

        browserName: "chromium",
        headless: false,
        screenshot: "on",
        //For Allowing Geolocation on POP-UP
        // permissions: ["geolocation"],
        //video record your test case
        video: "retain-on-failure",
        //For SSl Error to over come use
        ignoreHTTPSErrors: true,
        // trace: "on",
        // trace: "retain-on-failure",
        trace: "on",
        //For Responsiveness
        // viewport: { width: 720, height: 720 },
      },
    },
  ],

  /* Configure projects for major browsers */

  // projects: [
  //   {
  //     name: 'chromium',
  //     use: { ...devices['Desktop Chrome'] },
  //   },

  //   {
  //     name: 'firefox',
  //     use: { ...devices['Desktop Firefox'] },
  //   },

  //   {
  //     name: 'webkit',
  //     use: { ...devices['Desktop Safari'] },
  //   },

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Test against branded browsers. */
  // {
  //   name: 'Microsoft Edge',
  //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
  // },
  // {
  //   name: 'Google Chrome',
  //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
  // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
