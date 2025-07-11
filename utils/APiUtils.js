class APiUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  //Login API
  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      {
        data: this.loginPayload,
      }
    ); //200, 201

    // expect(loginResponse.ok()).toBeTruthy();
    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    // console.log(token);
    return token;
  }

  async createOrder(orderPayload) {
    let response = {};
    response.token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          Authorization: response.token,
          "Content-type": "application/json",
        },
      }
    );
    const orderResponseJson = await orderResponse.json();
    console.log(orderResponseJson);
    const orderId = orderResponseJson.orders[0];
    response.orderId = orderId;
    return response;
  }
}

module.exports = { APiUtils };
