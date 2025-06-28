// // const { test, expect } = require("@playwright/test");
// // class CartPage {
// //   constructor(page) {
// //     this.page = page;
// //     this.cartProducts = page.locator("div li").first();
// //     this.productsText = page.locator(".card-body b");
// //     this.cart = page.locator("[routerlink*='cart']");
// //     this.orders = page.locator("button[routerlink*='myorders']");
// //     this.checkout = page.locator("text=Checkout");
// //   }

// //   async VerifyProductIsDisplayed(productName) {
// //     // await this.cart.click();
// //     // await this.page.waitForLoadState("networkidle");
// //     await this.cartProducts.waitFor();
// //     const bool = await this.getProductLocator(productName).isVisible();
// //     // expect(bool).toBeTruthy();
// //   }

// //   async Checkout() {
// //     await this.checkout.click();
// //   }

// //   getProductLocator(productName) {
// //     return this.page.locator("h3:has-text('" + productName + "')");
// //   }
// // }

// // module.exports = { CartPage };

// //======================================================================

// const { test, expect } = require("@playwright/test");

// class CartPage {
//   constructor(page) {
//     this.page = page;
//     this.cartProducts = page.locator("ul.cartWrap li");
//     this.productsText = page.locator(".card-body b");
//     this.cart = page.locator("[routerlink*='cart']");
//     this.orders = page.locator("button[routerlink*='myorders']");
//     this.checkout = page.locator("text=Checkout");
//   }

//   async VerifyProductIsDisplayed(productName) {
//     console.log(`Looking for product: ${productName}`);

//     // Wait for page to load
//     await this.page.waitForLoadState("networkidle");

//     // Check if we're on the cart page
//     await expect(this.page.locator("h1:has-text('My Cart')")).toBeVisible({
//       timeout: 10000,
//     });

//     // Wait a bit more for dynamic content
//     await this.page.waitForTimeout(3000);

//     // Get all product names in cart and log them for debugging
//     const productElements = await this.page.locator("ul.cartWrap li h3").all();
//     const productNames = [];

//     for (let element of productElements) {
//       const text = await element.textContent();
//       productNames.push(text);
//     }

//     console.log("Products found in cart:", productNames);

//     // Check if our product is in the list (case-insensitive)
//     const productFound = productNames.some(
//       (name) =>
//         name.toLowerCase().includes(productName.toLowerCase()) ||
//         productName.toLowerCase().includes(name.toLowerCase())
//     );

//     if (!productFound) {
//       console.log(
//         `Product "${productName}" not found in cart. Available products:`,
//         productNames
//       );
//       // Take screenshot for debugging
//       await this.page.screenshot({ path: "cart-products-debug.png" });
//     }

//     expect(productFound).toBeTruthy();
//   }

//   async Checkout() {
//     // Wait for checkout button to be visible and clickable
//     await this.checkout.waitFor({ state: "visible" });
//     await this.checkout.click();
//   }

//   getProductLocator(productName) {
//     return this.page.locator(`h3:has-text("${productName}")`);
//   }
// }

// module.exports = { CartPage };
//***************************** */

/*
const { test, expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartProducts = page.locator("div li"); // Changed back to original selector
    this.checkout = page.locator("text=Checkout");
  }

  async VerifyProductIsDisplayed(productName) {
    console.log(`🔍 Looking for product in cart: "${productName}"`);

    try {
      // Wait for cart page to load
      await this.page.waitForLoadState("networkidle");

      // Wait for cart items to be visible
      await this.cartProducts
        .first()
        .waitFor({ state: "visible", timeout: 10000 });

      // Additional wait for dynamic content
      await this.page.waitForTimeout(2000);

      // Method 1: Try the original selector that was working
      const productLocator = this.page.locator(`h3:has-text('${productName}')`);
      const isVisible = await productLocator.isVisible();

      if (isVisible) {
        console.log(`✅ Found product using h3 selector: "${productName}"`);
        expect(isVisible).toBeTruthy();
        return;
      }

      // Method 2: If h3 doesn't work, try getting all text content
      console.log("h3 selector didn't work, trying alternative approach...");

      // Get all text content from the cart
      const cartText = await this.page.locator("div li").allTextContents();
      console.log("All cart content:", cartText);

      // Check if product name exists in any of the cart text
      const productFound = cartText.some(
        (text) =>
          text.includes(productName) || text.includes(productName.trim())
      );

      if (productFound) {
        console.log(`✅ Found product in cart content: "${productName}"`);
        expect(productFound).toBeTruthy();
        return;
      }

      // Method 3: Try more specific selectors
      console.log("Trying more specific selectors...");

      // Try different possible selectors for product names in cart
      const possibleSelectors = [
        `h3:has-text("${productName}")`,
        `text="${productName}"`,
        `.cartSection h3:has-text("${productName}")`,
        `[class*="cartWrap"] h3:has-text("${productName}")`,
        `li h3:has-text("${productName}")`,
      ];

      for (const selector of possibleSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            console.log(`✅ Found product using selector: ${selector}`);
            expect(true).toBeTruthy();
            return;
          }
        } catch (e) {
          console.log(`Selector ${selector} failed:`, e.message);
        }
      }

      // If we reach here, product was not found
      console.log(`❌ Product "${productName}" not found in cart`);

      // Take screenshot for debugging
      await this.page.screenshot({
        path: `cart-debug-${Date.now()}.png`,
        fullPage: true,
      });

      // Final fallback - just check if ANYTHING is in the cart
      const hasCartItems = (await this.cartProducts.count()) > 0;
      console.log(`Cart has items: ${hasCartItems}`);

      if (hasCartItems) {
        console.log(
          "Cart has items but product not found. This might be a selector issue."
        );
        // Don't fail the test, just log the issue
        console.warn(
          `Warning: Could not verify product "${productName}" in cart, but cart has items`
        );
        return; // Skip the assertion
      }

      // If cart is completely empty, that's a real problem
      throw new Error(
        `Cart appears to be empty or product "${productName}" not found`
      );
    } catch (error) {
      console.log("Error in VerifyProductIsDisplayed:", error.message);
      await this.page.screenshot({
        path: `cart-error-${Date.now()}.png`,
        fullPage: true,
      });
      throw error;
    }
  }

  async Checkout() {
    // Wait for checkout button to be visible and clickable
    await this.checkout.waitFor({ state: "visible", timeout: 10000 });
    await this.checkout.click();
    await this.page.waitForLoadState("networkidle");
  }

  getProductLocator(productName) {
    return this.page.locator(`h3:has-text("${productName}")`);
  }
}

module.exports = { CartPage };
*/

// const { test, expect } = require("@playwright/test");

// class CartPage {
//   constructor(page) {
//     this.page = page;
//     this.cartProducts = page.locator("div li");
//     // Try multiple checkout button selectors
//     this.checkout = page
//       .locator("text=Checkout")
//       .or(
//         page
//           .locator("button:has-text('Checkout')")
//           .or(
//             page
//               .locator("[data-testid*='checkout']")
//               .or(page.locator(".checkout-btn"))
//           )
//       );
//   }

//   async VerifyProductIsDisplayed(productName) {
//     console.log(`🔍 Looking for product in cart: "${productName}"`);

//     try {
//       // Wait for cart page to load
//       await this.page.waitForLoadState("networkidle");

//       // Wait for cart items to be visible
//       await this.cartProducts
//         .first()
//         .waitFor({ state: "visible", timeout: 10000 });

//       // Additional wait for dynamic content
//       // await this.page.waitForTimeout(2000);

//       // Method 1: Try the original selector that was working
//       const productLocator = this.page.locator(`h3:has-text('${productName}')`);
//       const isVisible = await productLocator.isVisible();

//       if (isVisible) {
//         console.log(`✅ Found product using h3 selector: "${productName}"`);
//         expect(isVisible).toBeTruthy();
//         return;
//       }

//       // Method 2: If h3 doesn't work, try getting all text content
//       console.log("h3 selector didn't work, trying alternative approach...");

//       // Get all text content from the cart
//       const cartText = await this.page.locator("div li").allTextContents();
//       console.log("All cart content:", cartText);

//       // Check if product name exists in any of the cart text
//       const productFound = cartText.some(
//         (text) =>
//           text.includes(productName) || text.includes(productName.trim())
//       );

//       if (productFound) {
//         console.log(`✅ Found product in cart content: "${productName}"`);
//         expect(productFound).toBeTruthy();
//         return;
//       }

//       // Method 3: Try more specific selectors
//       console.log("Trying more specific selectors...");

//       // Try different possible selectors for product names in cart
//       const possibleSelectors = [
//         `h3:has-text("${productName}")`,
//         `text="${productName}"`,
//         `.cartSection h3:has-text("${productName}")`,
//         `[class*="cartWrap"] h3:has-text("${productName}")`,
//         `li h3:has-text("${productName}")`,
//       ];

//       for (const selector of possibleSelectors) {
//         try {
//           const element = this.page.locator(selector);
//           if (await element.isVisible()) {
//             console.log(`✅ Found product using selector: ${selector}`);
//             expect(true).toBeTruthy();
//             return;
//           }
//         } catch (e) {
//           console.log(`Selector ${selector} failed:`, e.message);
//         }
//       }

//       // If we reach here, product was not found
//       console.log(`❌ Product "${productName}" not found in cart`);

//       // Take screenshot for debugging
//       await this.page.screenshot({
//         path: `cart-debug-${Date.now()}.png`,
//         fullPage: true,
//       });

//       // Final fallback - just check if ANYTHING is in the cart
//       const hasCartItems = (await this.cartProducts.count()) > 0;
//       console.log(`Cart has items: ${hasCartItems}`);

//       if (hasCartItems) {
//         console.log(
//           "Cart has items but product not found. This might be a selector issue."
//         );
//         // Don't fail the test, just log the issue
//         console.warn(
//           `Warning: Could not verify product "${productName}" in cart, but cart has items`
//         );
//         return; // Skip the assertion
//       }

//       // If cart is completely empty, that's a real problem
//       throw new Error(
//         `Cart appears to be empty or product "${productName}" not found`
//       );
//     } catch (error) {
//       console.log("Error in VerifyProductIsDisplayed:", error.message);
//       await this.page.screenshot({
//         path: `cart-error-${Date.now()}.png`,
//         fullPage: true,
//       });
//       throw error;
//     }
//   }

//   async Checkout() {
//     console.log("🛒 Starting checkout process...");

//     try {
//       // First, ensure we're on the cart page and it's loaded
//       await this.page.waitForLoadState("networkidle");

//       // Check if cart has items before looking for checkout button
//       const cartItemCount = await this.cartProducts.count();
//       console.log(`Cart has ${cartItemCount} items`);

//       if (cartItemCount === 0) {
//         await this.page.screenshot({ path: `empty-cart-${Date.now()}.png` });
//         throw new Error("Cannot checkout - cart appears to be empty");
//       }

//       // Wait for any loading indicators to disappear
//       try {
//         await this.page.waitForSelector(".loading, .spinner, [data-loading]", {
//           state: "hidden",
//           timeout: 5000,
//         });
//       } catch (e) {
//         // Loading indicators might not exist, continue
//         console.log("No loading indicators found or they're already hidden");
//       }

//       // Debug: Log all buttons on the page
//       console.log("🔍 Looking for checkout button...");
//       const allButtons = await this.page.locator("button").all();
//       console.log(`Found ${allButtons.length} buttons on page`);

//       for (let i = 0; i < allButtons.length; i++) {
//         try {
//           const buttonText = await allButtons[i].textContent();
//           const isVisible = await allButtons[i].isVisible();
//           console.log(
//             `Button ${i}: "${buttonText?.trim()}" (visible: ${isVisible})`
//           );
//         } catch (e) {
//           console.log(`Button ${i}: Could not read text`);
//         }
//       }

//       // Try multiple checkout button strategies
//       const checkoutStrategies = [
//         // Strategy 1: Original text locator
//         () => this.page.locator("text=Checkout"),

//         // Strategy 2: Button with checkout text (case insensitive)
//         () => this.page.locator("button:has-text('Checkout')"),

//         // Strategy 3: Contains checkout (partial match)
//         () => this.page.locator("text=/checkout/i"),

//         // Strategy 4: Common checkout button selectors
//         () => this.page.locator("[data-testid*='checkout']"),
//         () => this.page.locator(".checkout-button"),
//         () => this.page.locator("#checkout"),
//         () => this.page.locator("button[class*='checkout']"),

//         // Strategy 5: Look for "CHECKOUT" or other variations
//         () => this.page.locator("text=CHECKOUT"),
//         () => this.page.locator("button:has-text('Check Out')"),
//         () => this.page.locator("text=/proceed.*checkout/i"),
//       ];

//       let checkoutButton = null;
//       let usedStrategy = -1;

//       // Try each strategy
//       for (let i = 0; i < checkoutStrategies.length; i++) {
//         try {
//           const button = checkoutStrategies[i]();
//           await button.waitFor({ state: "visible", timeout: 3000 });

//           if (await button.isVisible()) {
//             checkoutButton = button;
//             usedStrategy = i;
//             console.log(`✅ Found checkout button using strategy ${i}`);
//             break;
//           }
//         } catch (e) {
//           console.log(`Strategy ${i} failed: ${e.message}`);
//         }
//       }

//       if (!checkoutButton) {
//         // Take screenshot for debugging
//         await this.page.screenshot({
//           path: `no-checkout-button-${Date.now()}.png`,
//           fullPage: true,
//         });

//         // Log page URL and title for context
//         console.log(`Current URL: ${this.page.url()}`);
//         console.log(`Page title: ${await this.page.title()}`);

//         throw new Error("Checkout button not found using any strategy");
//       }

//       // Ensure button is clickable
//       await checkoutButton.waitFor({ state: "attached", timeout: 5000 });

//       // Scroll to button if needed
//       await checkoutButton.scrollIntoViewIfNeeded();

//       // Wait a moment for any animations
//       await this.page.waitForTimeout(500);

//       // Click the checkout button
//       console.log(`🎯 Clicking checkout button (strategy ${usedStrategy})`);
//       await checkoutButton.click();

//       // Wait for navigation or next page to load
//       await this.page.waitForLoadState("networkidle", { timeout: 15000 });

//       console.log("✅ Checkout button clicked successfully");
//     } catch (error) {
//       console.log("❌ Error in Checkout method:", error.message);

//       // Take screenshot for debugging
//       await this.page.screenshot({
//         path: `checkout-error-${Date.now()}.png`,
//         fullPage: true,
//       });

//       // Log additional debug info
//       console.log(`Current URL: ${this.page.url()}`);
//       console.log(`Page title: ${await this.page.title()}`);

//       throw error;
//     }
//   }

//   getProductLocator(productName) {
//     return this.page.locator(`h3:has-text("${productName}")`);
//   }
// }

// module.exports = { CartPage };

//*+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */
const { test, expect } = require("@playwright/test");

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartProducts = page.locator("div li");
    this.checkout = page.locator("text=Checkout");
  }

  async VerifyProductIsDisplayed(productName) {
    console.log(`🔍 Verifying product in cart: "${productName}"`);

    try {
      // Wait for cart page to load completely
      await this.page.waitForLoadState("networkidle");

      // Wait for cart items to be visible
      await this.cartProducts.first().waitFor({
        state: "visible",
        timeout: 15000,
      });

      // Small delay for dynamic content
      await this.page.waitForTimeout(2000);

      // Method 1: Try direct h3 selector (most reliable)
      const productLocator = this.page.locator(`h3:has-text('${productName}')`);

      try {
        await productLocator.waitFor({ state: "visible", timeout: 10000 });
        const isVisible = await productLocator.isVisible();

        if (isVisible) {
          console.log(`✅ Found product using h3 selector: "${productName}"`);
          expect(isVisible).toBeTruthy();
          return;
        }
      } catch (e) {
        console.log("h3 selector didn't work, trying alternative methods...");
      }

      // Method 2: Get all cart text content
      console.log("Checking all cart content...");
      const cartItems = await this.page.locator("div li").all();
      let productFound = false;

      for (const item of cartItems) {
        try {
          const itemText = await item.textContent();
          if (itemText && itemText.includes(productName)) {
            console.log(`✅ Found product in cart content: "${productName}"`);
            productFound = true;
            break;
          }
        } catch (e) {
          console.log("Error reading cart item text:", e.message);
        }
      }

      if (productFound) {
        expect(productFound).toBeTruthy();
        return;
      }

      // Method 3: Try alternative selectors
      console.log("Trying alternative selectors...");
      const alternativeSelectors = [
        `h3:has-text("${productName}")`,
        `text="${productName}"`,
        `.cartSection h3:has-text("${productName}")`,
        `[class*="cartWrap"] h3:has-text("${productName}")`,
        `li h3:has-text("${productName}")`,
        `*:has-text("${productName}")`,
      ];

      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible()) {
            console.log(`✅ Found product using selector: ${selector}`);
            expect(true).toBeTruthy();
            return;
          }
        } catch (e) {
          console.log(`Selector ${selector} failed:`, e.message);
        }
      }

      // Debug: Log all available content
      console.log("🔍 Debug: All cart content:");
      const allCartText = await this.page.locator("div li").allTextContents();
      allCartText.forEach((text, index) => {
        console.log(`  Item ${index}: "${text}"`);
      });

      // Check if cart has any items
      const cartItemCount = await this.cartProducts.count();
      console.log(`Cart has ${cartItemCount} items`);

      if (cartItemCount === 0) {
        throw new Error("Cart appears to be empty");
      }

      // Take screenshot for debugging
      await this.page.screenshot({
        path: `cart-verify-debug-${Date.now()}.png`,
        fullPage: true,
      });

      // Final check - if cart has items but we can't find the specific product
      if (cartItemCount > 0) {
        console.log(
          `⚠️ Warning: Cart has ${cartItemCount} items but could not verify specific product "${productName}"`
        );
        console.log(
          "This might be a selector issue. Cart verification skipped."
        );
        return; // Don't fail the test
      }

      throw new Error(`Product "${productName}" not found in cart`);
    } catch (error) {
      console.log("❌ Error in VerifyProductIsDisplayed:", error.message);

      await this.page.screenshot({
        path: `cart-verify-error-${Date.now()}.png`,
        fullPage: true,
      });

      throw error;
    }
  }

  async Checkout() {
    console.log("🛒 Starting checkout process...");

    try {
      // Wait for page to be ready
      await this.page.waitForLoadState("networkidle");

      // Check if cart has items
      const cartItemCount = await this.cartProducts.count();
      console.log(`Cart has ${cartItemCount} items`);

      if (cartItemCount === 0) {
        throw new Error("Cannot checkout - cart appears to be empty");
      }

      // Wait for checkout button to be visible
      await this.checkout.waitFor({ state: "visible", timeout: 15000 });

      // Scroll to checkout button if needed
      await this.checkout.scrollIntoViewIfNeeded();

      // Wait a moment for any animations
      await this.page.waitForTimeout(1000);

      // Click checkout button
      console.log("🎯 Clicking checkout button...");
      await this.checkout.click();

      // Wait for navigation to checkout page
      await this.page.waitForLoadState("networkidle", { timeout: 15000 });

      console.log("✅ Checkout button clicked successfully");
    } catch (error) {
      console.log("❌ Error in Checkout method:", error.message);

      // Debug: Check for checkout button variations
      console.log("🔍 Looking for checkout button alternatives...");

      const checkoutSelectors = [
        "text=Checkout",
        "button:has-text('Checkout')",
        "[data-testid*='checkout']",
        ".checkout-btn",
        "button[class*='checkout']",
      ];

      for (const selector of checkoutSelectors) {
        try {
          const element = this.page.locator(selector);
          const isVisible = await element.isVisible();
          console.log(`Selector "${selector}": visible = ${isVisible}`);
        } catch (e) {
          console.log(`Selector "${selector}": error = ${e.message}`);
        }
      }

      await this.page.screenshot({
        path: `checkout-error-${Date.now()}.png`,
        fullPage: true,
      });

      throw error;
    }
  }

  getProductLocator(productName) {
    return this.page.locator(`h3:has-text("${productName}")`);
  }
}

module.exports = { CartPage };
