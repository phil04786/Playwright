class DashboardPage {
  constructor(page) {
    this.page = page;
    this.products = page.locator(".card-body");
    this.productsText = page.locator(".card-body b");
    this.cart = page.locator("[routerlink*='cart']");
    this.orders = page.locator("button[routerlink*='myorders']");
  }

  async searchProductAddCart(productName) {
    const titles = await this.productsText.allTextContents();
    console.log(titles);
    const count = await this.products.count();
    for (let i = 0; i < count; ++i) {
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        // add to cart
        await this.products.nth(i).locator("text= Add To Cart").click();
        await this.page.waitForTimeout(2000);
        break;
      }
    }
  }

  async navigateToOrders() {
    await this.orders.click();
    await this.page.waitForLoadState("networkidle");
  }

  async navigateToCart() {
    await this.cart.click();
    await this.page.waitForLoadState("networkidle");
  }
}

module.exports = { DashboardPage };

//=========================================================================

//=========================================================================
// class DashboardPage {
//   constructor(page) {
//     this.page = page;
//     this.products = page.locator(".card-body");
//     this.productsText = page.locator(".card-body b");
//     this.cart = page.locator("[routerlink*='cart']");
//     this.orders = page.locator("button[routerlink*='myorders']");
//   }

//   async searchProductAddCart(productName) {
//     try {
//       // Wait for products to load
//       await this.products.first().waitFor({ state: "visible", timeout: 10000 });

//       const titles = await this.productsText.allTextContents();
//       console.log("Available products:", titles);
//       console.log("Looking for product:", productName);

//       const count = await this.products.count();
//       console.log("Total products found:", count);

//       let productFound = false;

//       for (let i = 0; i < count; ++i) {
//         try {
//           // Add explicit wait for the element to be visible
//           await this.products
//             .nth(i)
//             .locator("b")
//             .waitFor({ state: "visible", timeout: 5000 });

//           const currentProductName = await this.products
//             .nth(i)
//             .locator("b")
//             .textContent();

//           console.log(`Checking product ${i}: "${currentProductName}"`);
//           console.log(`Trimmed: "${currentProductName.trim()}"`);

//           // Use case-insensitive comparison and trim whitespace
//           const normalizedCurrent = currentProductName.trim().toLowerCase();
//           const normalizedTarget = productName.trim().toLowerCase();

//           console.log(`Normalized current: "${normalizedCurrent}"`);
//           console.log(`Normalized target: "${normalizedTarget}"`);

//           if (normalizedCurrent === normalizedTarget) {
//             console.log(`Found matching product: ${productName}`);

//             // Wait for the "Add To Cart" button to be visible and clickable
//             const addToCartButton = this.products
//               .nth(i)
//               .locator("text= Add To Cart");
//             await addToCartButton.waitFor({ state: "visible", timeout: 5000 });
//             await addToCartButton.click();

//             // Wait for success notification or cart update
//             await this.page.waitForTimeout(2000);

//             // Optional: Verify the cart count increased
//             try {
//               const cartCount = await this.page
//                 .locator("[routerlink*='cart'] label")
//                 .textContent();
//               console.log("Cart count after adding:", cartCount);
//             } catch (error) {
//               console.log("Could not read cart count, but product was added");
//             }

//             productFound = true;
//             break;
//           }
//         } catch (elementError) {
//           console.log(`Error processing product ${i}:`, elementError.message);
//           continue; // Skip this product and continue with the next one
//         }
//       }

//       if (!productFound) {
//         console.log(`Product "${productName}" not found.`);
//         console.log("Available products (exact text):");
//         titles.forEach((title, index) => {
//           console.log(`  ${index}: "${title}" (trimmed: "${title.trim()}")`);
//         });

//         // Try partial matching as fallback
//         console.log("Attempting partial match...");
//         const partialMatch = titles.find(
//           (title) =>
//             title.toLowerCase().includes(productName.toLowerCase()) ||
//             productName.toLowerCase().includes(title.toLowerCase())
//         );

//         if (partialMatch) {
//           console.log(`Found partial match: "${partialMatch}"`);
//           console.log(
//             "Consider using the exact product name from the list above"
//           );
//         }

//         throw new Error(
//           `Product "${productName}" not found on the page. Available products: ${titles.join(
//             ", "
//           )}`
//         );
//       }

//       return productFound;
//     } catch (error) {
//       console.log("Error in searchProductAddCart:", error.message);
//       throw error;
//     }
//   }

//   // Alternative method with more flexible matching
//   async searchProductAddCartFlexible(productName) {
//     try {
//       await this.products.first().waitFor({ state: "visible", timeout: 10000 });

//       const titles = await this.productsText.allTextContents();
//       console.log("Available products:", titles);

//       const count = await this.products.count();
//       let productFound = false;

//       for (let i = 0; i < count; ++i) {
//         try {
//           await this.products
//             .nth(i)
//             .locator("b")
//             .waitFor({ state: "visible", timeout: 5000 });

//           const currentProductName = await this.products
//             .nth(i)
//             .locator("b")
//             .textContent();

//           // Multiple matching strategies
//           const current = currentProductName.trim().toLowerCase();
//           const target = productName.trim().toLowerCase();

//           const exactMatch = current === target;
//           const containsMatch =
//             current.includes(target) || target.includes(current);
//           const wordsMatch = this.matchByWords(current, target);

//           if (exactMatch || containsMatch || wordsMatch) {
//             console.log(
//               `Found matching product: "${currentProductName}" for search: "${productName}"`
//             );

//             const addToCartButton = this.products
//               .nth(i)
//               .locator("text= Add To Cart");
//             await addToCartButton.waitFor({ state: "visible", timeout: 5000 });
//             await addToCartButton.click();
//             await this.page.waitForTimeout(2000);

//             productFound = true;
//             break;
//           }
//         } catch (elementError) {
//           console.log(`Error processing product ${i}:`, elementError.message);
//           continue;
//         }
//       }

//       if (!productFound) {
//         throw new Error(
//           `Product "${productName}" not found. Available: ${titles.join(", ")}`
//         );
//       }

//       return productFound;
//     } catch (error) {
//       console.log("Error in searchProductAddCartFlexible:", error.message);
//       throw error;
//     }
//   }

//   // Helper method to match by individual words
//   matchByWords(text1, text2) {
//     const words1 = text1.split(/\s+/).filter((word) => word.length > 2);
//     const words2 = text2.split(/\s+/).filter((word) => word.length > 2);

//     return words1.some((word1) =>
//       words2.some((word2) => word1.includes(word2) || word2.includes(word1))
//     );
//   }

//   async navigateToOrders() {
//     await this.orders.waitFor({ state: "visible", timeout: 5000 });
//     await this.orders.click();
//     await this.page.waitForLoadState("networkidle");
//   }

//   async navigateToCart() {
//     await this.cart.waitFor({ state: "visible", timeout: 5000 });
//     await this.cart.click();
//     await this.page.waitForLoadState("networkidle");
//   }
// }

// module.exports = { DashboardPage };
