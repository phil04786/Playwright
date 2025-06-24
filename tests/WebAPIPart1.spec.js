const { test, expect, request } = require("@playwright/test");
const { APiUtils } = require("./utils/APiUtils");

const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};

const orderPayload = {
  orders: [{ country: "Cuba", productOrderedId: "67a8dde5c0d3e6622a297cc8" }],
};

// let token;
// let orderId;
let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();

  const apiUtils = new APiUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

//create order is success
test("Place the Order", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");
  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  await page.pause();
  //asserations
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();
  // await page.pause();
});
