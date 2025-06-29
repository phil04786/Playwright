const { test, expect, request } = require("@playwright/test");
const { APiUtils } = require("../utils/APiUtils");

const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};

// const loginPayload = {
//   userEmail: "admintest1@gmail.com",
//   userPassword: "Admintest@1",
// };

const orderPayload = {
  orders: [{ country: "India", productOrderedId: "67a8df1ac0d3e6622a297ccb" }],
};

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

  await page.goto("https://rahulshettyacademy.com/client/");

  await page.locator("button[routerlink*='myorders']").click();

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
    (route) =>
      route.continue({
        url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=685d0e0f129e250258b87691",
      })
  );

  await page.locator("button:has-text('View')").first().click();

  // await page.getByRole("button", { name: "View" }).first().click();

  await page.pause();
});

// //anshika
// // https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=685cff72129e250258b85019

// //admin
// // https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=685c0b2e129e250258b6c43c

// const { test, expect } = require("@playwright/test");

// test("Security test request intercept", async ({ page }) => {
//   // Login and reach order page.
//   await page.goto("https://rahulshettyacademy.com/client");
//   await page.locator("#userEmail").fill("anshika@gmail.com");
//   await page.locator("#userPassword").type("Iamking@000");
//   await page.locator("[value='Login']").click();

//   await page.waitForLoadState("networkidle");
//   await page.locator(".card-body b").first().waitFor();

//   // Go to order page.
//   await page.locator("button[routerlink*='myorders']").click();

//   await page.route(
//     "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
//     (route) =>
//       route.continue({
//         url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=621661f884b053f6765465b6",
//       })
//   );

//   await page.locator("button:has-text('View')").first().click();

//   await expect(page.locator("p").last()).toHaveText(
//     "You are not authorize to view this order"
//   );

//   await page.pause();
// });
