const { test, expect } = require("@playwright/test");

//browser, page are fixers
test.only("Browser Context Playwright test", async ({ browser }) => {
  //chrome -plugins / cookies
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  await page.locator("#username").type("abc");
  await page.locator("[type=password]").type("abc");
  await page.locator("#signInBtn").click();
  console.log(await page.locator("[style*='block']").textContent());
});

test("Page Playwright test", async ({ page }) => {
  await page.goto("https://google.com/");
  // get title -assertion
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});
