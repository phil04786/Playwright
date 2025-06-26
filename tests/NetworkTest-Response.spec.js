const { test, expect, request } = require("@playwright/test");
const { APiUtils } = require("./utils/APiUtils");

const loginPayload = {
  userEmail: "anshika@gmail.com",
  userPassword: "Iamking@000",
};

const orderPayload = {
  orders: [{ country: "Cuba", productOrderedId: "67a8dde5c0d3e6622a297cc8" }],
};
const fakePalyLoadOrders = { data: [], message: "No Orders" };
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

  //faking response to customer through body
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = JSON.stringify(fakePalyLoadOrders);
      route.fulfill({
        response,
        body,
      });
      //intercepting response - API response -> {playwright fakeresponse} -> browser -> render data on front end
    }
  );

  await page.locator("button[routerlink*='myorders']").click();
  //   await page.pause();
  await page.waitForResponse(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*"
  );
  console.log(await page.locator(".mt-4").textContent());
});
