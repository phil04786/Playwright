const { test, expect } = require("@playwright/test");
const { POManagerMy } = require("../pageobjects/POManagerMy.js");

test("Client App Login", async ({ page }) => {
  const poManager = new POManagerMy(page);

  const username = "anshika@gmail.com";
  const password = "Iamking@000";
  const productName = "ZARA COAT 3";
  const products = page.locator(".card-body");
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(username, password);

  const dashboardPage = poManager.getDashboardPage();
  dashboardPage.searchProductAddCart(productName);
  dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(productName);
  await cartPage.Checkout();

  //-----------------------------------------------------

  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  const orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log(orderId);
  await dashboardPage.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

  /*
  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 });
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
      //click
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  await expect(page.locator(".user__name [type='text']").nth(0)).toHaveText(
    username
  );
  await page.locator(".action__submit").click();
  await expect(page.locator(".hero-primary")).toHaveText(
    "Thankyou for the order."
  );
  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  //asserations
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
  // await page.pause();
  */
});
