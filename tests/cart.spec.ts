import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page.ts";
import { getHighestPrice } from "../utils/common.ts";

test("add highest price item to cart - product page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo("");
  await loginPage.login();

  const items = page.locator('[data-test="inventory-item-price"]');
  const { highestPrice, highestPriceItem } = await getHighestPrice(items);

  await page
    .locator('[data-test="inventory-item-name"]')
    .nth(highestPriceItem)
    .click();
  await page.getByRole("button", { name: "Add to cart" }).click();

  await loginPage.goTo("cart.html");
  await expect(
    page.locator('[data-test="inventory-item-price"]')
  ).toContainText("$" + highestPrice);
});

test("add highest price item to cart - listing page", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo("");
  await loginPage.login();

  const items = page.locator('[data-test="inventory-item-price"]');
  const { highestPrice, highestPriceItem } = await getHighestPrice(items);

  await page
    .getByRole("button", { name: "Add to cart" })
    .nth(highestPriceItem)
    .click();

  await loginPage.goTo("cart.html");
  await expect(
    page.locator('[data-test="inventory-item-price"]')
  ).toContainText("$" + highestPrice);
});
