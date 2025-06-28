// const { test, expect } = require("@playwright/test");
// class CartPage {
//   constructor(page) {
//     this.page = page;
//     this.cartProducts = page.locator("div li").first();
//     this.productsText = page.locator(".card-body b");
//     this.cart = page.locator("[routerlink*='cart']");
//     this.orders = page.locator("button[routerlink*='myorders']");
//     this.checkout = page.locator("text=Checkout");
//   }

//   async VerifyProductIsDisplayed(productName) {
//     // await this.cart.click();
//     // await this.page.waitForLoadState("networkidle");
//     await this.cartProducts.waitFor();
//     const bool = await this.getProductLocator(productName).isVisible();
//     // expect(bool).toBeTruthy();
//   }

//   async Checkout() {
//     await this.checkout.click();
//   }

//   getProductLocator(productName) {
//     return this.page.locator("h3:has-text('" + productName + "')");
//   }
// }

// module.exports = { CartPage };

//======================================================================

const { test, expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartProducts = page.locator("ul.cartWrap li");
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
    this.checkout = page.locator("text=Checkout");
  }

  async VerifyProductIsDisplayed(productName) {
    console.log(`Looking for product: ${productName}`);

    // Wait for page to load
    await this.page.waitForLoadState("networkidle");

    // Check if we're on the cart page
    await expect(this.page.locator("h1:has-text('My Cart')")).toBeVisible({
      timeout: 10000,
    });

    // Wait a bit more for dynamic content
    await this.page.waitForTimeout(3000);

    // Get all product names in cart and log them for debugging
    const productElements = await this.page.locator("ul.cartWrap li h3").all();
    const productNames = [];

    for (let element of productElements) {
      const text = await element.textContent();
      productNames.push(text);
    }

    console.log("Products found in cart:", productNames);

    // Check if our product is in the list (case-insensitive)
    const productFound = productNames.some(
      (name) =>
        name.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(name.toLowerCase())
    );

    if (!productFound) {
      console.log(
        `Product "${productName}" not found in cart. Available products:`,
        productNames
      );
      // Take screenshot for debugging
      await this.page.screenshot({ path: "cart-products-debug.png" });
    }

    expect(productFound).toBeTruthy();
  }

  async Checkout() {
    // Wait for checkout button to be visible and clickable
    await this.checkout.waitFor({ state: "visible" });
    await this.checkout.click();
  }

  getProductLocator(productName) {
    return this.page.locator(`h3:has-text("${productName}")`);
  }
}

module.exports = { CartPage };
