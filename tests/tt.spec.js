const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageobjects/POManager");

test("Debug - List all available products", async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();
  const dashboardPage = poManager.getDashboardPage();

  // Login first
  await page.goto("https://rahulshettyacademy.com/client");
  await loginPage.validLogin("admintest1@gmail.com", "Admintest@1");

  // Wait for dashboard to load
  await page.waitForLoadState("networkidle");

  // Get all product names
  await page
    .locator(".card-body")
    .first()
    .waitFor({ state: "visible", timeout: 10000 });
  const productNames = await page.locator(".card-body b").allTextContents();

  console.log("=== ALL AVAILABLE PRODUCTS ===");
  productNames.forEach((name, index) => {
    console.log(`${index + 1}. "${name}" (length: ${name.length})`);
    console.log(`   Trimmed: "${name.trim()}"`);
    console.log(`   Lowercase: "${name.trim().toLowerCase()}"`);
    console.log("   ---");
  });

  // Test different variations of "Zara Coat 3"
  const searchVariations = [
    "Zara Coat 3",
    "ZARA COAT 3",
    "zara coat 3",
    "Zara",
    "Coat",
    "ZARA",
    "COAT",
  ];

  console.log("=== TESTING SEARCH VARIATIONS ===");
  searchVariations.forEach((searchTerm) => {
    const found = productNames.find((product) =>
      product.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log(
      `Search: "${searchTerm}" -> Found: ${found ? `"${found}"` : "NOT FOUND"}`
    );
  });
});
