const { LoginPage } = require("./LoginPage");
const { DashboardPage } = require("./DashboardPage");
const { CartPage } = require("./CartPage");
const { OrdersHistoryPage } = require("./OrdersHistoryPage");
const { OrdersReviewPage } = require("./OrdersReviewPage");

class POManagerMy {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.cartPage = new CartPage(this.page);

    this.ordersHistoryPage = new OrdersHistoryPage(this.page);
    this.ordersReviewPage = new OrdersReviewPage(this.page);
  }

  getLoginPage() {
    return this.loginPage;
  }
  getDashboardPage() {
    return this.dashboardPage;
  }
  getCartPage() {
    return this.cartPage;
  }
  getOrdersHistoryPage() {
    return this.ordersHistoryPage;
  }

  getOrdersReviewPage() {
    return this.ordersReviewPage;
  }
}

module.exports = { POManagerMy };
