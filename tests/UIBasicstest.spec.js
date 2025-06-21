const { test, expect } = require("@playwright/test");

//browser, page are fixers
test("Browser Context Playwright test", async ({ browser }) => {
  //chrome -plugins /
  //await is required only when performing the actions.

  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cartTitles = page.locator(".card-body a");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());

  //css
  await userName.type("rahulshetty");
  await page.locator("[type=password]").type("learning");
  await signIn.click();

  //Selenium- webdriver wait
  console.log(await page.locator("[style*='block']").textContent());
  //assertion -> tell true or false of  text at the locator measns what you expected(Incorrecttt) and what is received
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");

  //type - fill :- to enter information and fill is also use to clear the contain from elements
  await userName.fill("");
  await userName.fill("rahulshettyacademy");
  await signIn.click();
  //   console.log(await cartTitles.first().textContent());
  //   console.log(await cartTitles.nth(0).textContent());

  //race condition so after clicking signIn wait for page to get loaded and then do navigation. Race condition is used for content that don't have Auto-Wait feature. For Non Service based App:-
  await Promise.all([page.waitForNavigation(), signIn.click()]);

  const allTitles = await cartTitles.allTextContents();
  console.log(allTitles);
});

test("Page Playwright test", async ({ page }) => {
  await page.goto("https://google.com/");
  // get title -assertion
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test("UI Controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");

  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const documentLink = page.locator("[href*='documents-request']");

  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");

  await page.locator(".radiotextsty").last().click();
  await page.locator("#okayBtn").click();

  //isChecked returns true or false
  console.log(await page.locator(".radiotextsty").last().isChecked());
  //assertion
  await expect(page.locator(".radiotextsty").last()).toBeChecked();

  await page.locator("#terms").click();
  //assertion
  await expect(page.locator("#terms")).toBeChecked();

  await page.locator("#terms").uncheck();
  //There is NO assertion to check whether checkbox is uncheck. So use Generic Assertions- toBeFalsy
  //assertion******************
  expect(await page.locator("#terms").isChecked()).toBeFalsy;
  // await page.pause();

  await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test("Child windows handling", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const userName = page.locator("#username");

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");

  //Multiple Child Window
  const [newPage, newPage2] = await Promise.all([
    context.waitForEvent("page"),
    documentLink.click(),
  ]);

  const text = await newPage.locator(".red").textContent();
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  console.log(domain);
  await page.locator("#username").type(domain);
  // await page.pause();
  console.log(await page.locator("#username").textContent());
});


