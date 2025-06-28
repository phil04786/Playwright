// const { test, expect } = require("@playwright/test");
// const { POManagerMy } = require("../pageobjects/POManagerMy.js");
// const { customtest } = require("../utils/test-base.js");

// //Jons ->string-> object
// // const dataset = JSON.parse(
// //   JSON.stringify(require("../utils/placeorderTestData.json"))
// // );

// const data = JSON.parse(
//   JSON.stringify(require("../utils/placeorderTestData.json"))
// );

// // for (const data of dataset) {
// test(`Client App Login for ${data.productName}`, async ({ page }) => {
//   const poManager = new POManagerMy(page);

//   // const username = "anshika@gmail.com";
//   // const password = "Iamking@000";
//   // const productName = "ZARA COAT 3";
//   const products = page.locator(".card-body");
//   const loginPage = poManager.getLoginPage();
//   await loginPage.goTo();
//   await loginPage.validLogin(data.username, data.password);

//   const dashboardPage = poManager.getDashboardPage();
//   dashboardPage.searchProductAddCart(data.productName);
//   dashboardPage.navigateToCart();

//   // Wait for navigation to cart page
//   await page.waitForURL("**/cart**");

//   // Wait a bit more for cart to fully load
//   await page.waitForTimeout(2000);

//   const cartPage = poManager.getCartPage();
//   await cartPage.VerifyProductIsDisplayed(data.productName);
//   await cartPage.Checkout();

//   //-----------------------------------------------------

//   const ordersReviewPage = poManager.getOrdersReviewPage();
//   await ordersReviewPage.searchCountryAndSelect("ind", "India");
//   const orderId = await ordersReviewPage.SubmitAndGetOrderId();
//   console.log(orderId);
//   await dashboardPage.navigateToOrders();
//   const ordersHistoryPage = poManager.getOrdersHistoryPage();
//   await ordersHistoryPage.searchOrderAndSelect(orderId);
//   expect(orderId.includes(await ordersHistoryPage.getOrderId())).toBeTruthy();

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
// });
// }

//****----------------------------------------------------------------------------------------------- */

const { test, expect } = require("@playwright/test");
const { POManagerMy } = require("../pageobjects/POManagerMy.js");

const data = JSON.parse(
  JSON.stringify(require("../utils/placeorderTestData.json"))
);

test(`Client App Login for ${data.productName}`, async ({ page }) => {
  const poManager = new POManagerMy(page);

  // Login
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(data.username, data.password);

  // Search and add product to cart
  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(data.productName);
  await dashboardPage.navigateToCart();

  // Wait for navigation to cart page
  await page.waitForURL("**/cart**", { timeout: 10000 });

  // Wait for cart to fully load
  await page.waitForLoadState("networkidle");

  // Verify product and checkout
  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(data.productName);
  await cartPage.Checkout();

  // Wait for checkout page to load
  await page.waitForLoadState("networkidle");

  // Complete order
  const ordersReviewPage = poManager.getOrdersReviewPage();
  await ordersReviewPage.searchCountryAndSelect("ind", "India");
  await ordersReviewPage.VerifyEmailId(data.username);
  const orderId = await ordersReviewPage.SubmitAndGetOrderId();
  console.log("Order ID:", orderId);

  // Navigate to orders and verify
  await dashboardPage.navigateToOrders();
  const ordersHistoryPage = poManager.getOrdersHistoryPage();
  await ordersHistoryPage.searchOrderAndSelect(orderId);
  const orderIdFromHistory = await ordersHistoryPage.getOrderId();
  expect(orderId.includes(orderIdFromHistory)).toBeTruthy();
});

//* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

/*
customtest.only(`Client App Login`, async ({ page, testDataForOrder }) => {
  const poManager = new POManagerMy(page);

  // const username = "anshika@gmail.com";
  // const password = "Iamking@000";
  // const productName = "ZARA COAT 3";
  // const products = page.locator(".card-body");
  const loginPage = poManager.getLoginPage();
  await loginPage.goTo();
  await loginPage.validLogin(
    testDataForOrder.username,
    testDataForOrder.password
  );

  const dashboardPage = poManager.getDashboardPage();
  dashboardPage.searchProductAddCart(testDataForOrder.productName);
  dashboardPage.navigateToCart();

  const cartPage = poManager.getCartPage();
  await cartPage.VerifyProductIsDisplayed(testDataForOrder.productName);
  await cartPage.Checkout();
});
*/
