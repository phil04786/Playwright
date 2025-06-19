const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("anshika@gmail.com");
  await page.locator("#userPassword").type("Iamking@000");
  await page.locator("[value='Login']").click();
  // use when service call are made means all data is called and network after getting all data becomes idle then get all titles
  // but when serives are not there then do race condition as shown in UIBasicstest.spec.js for allTextContexts(). For Service based App
  await page.waitForLoadState("networkidle");
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
});
