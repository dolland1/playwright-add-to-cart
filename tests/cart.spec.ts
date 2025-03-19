import { test, expect } from "@playwright/test";
import { LoginPage } from "../page-objects/login-page.ts";
import { getHighestPrice } from "../utils/common.ts";

type Item = { price: number; index: number };

async function sortItems(items: any) {
  const sortedItems: Item[] = [];

  for (let i = 0; i < (await items.count()); i++) {
    const priceText = await items.nth(i).innerText();
    const price = parseFloat(priceText.replace("$", ""));

    sortedItems.push({ price, index: i });
  }

  sortedItems.sort((a, b) => a.price - b.price);
  return sortedItems;
}

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

test("add second lowest price item to cart - listing page", async ({
  page,
}) => {
  const loginPage = new LoginPage(page);
  await loginPage.goTo("");
  await loginPage.login();

  const items = page.locator('[data-test="inventory-item-price"]');
  const sortedItems = await sortItems(items);
  const secondLowestPriceItem = sortedItems[1];
  const secondLowestPrice = secondLowestPriceItem.price;

  await page.getByRole("button", { name: "Add to cart" }).nth(1).click();

  await loginPage.goTo("cart.html");
  await expect(
    page.locator('[data-test="inventory-item-price"]')
  ).toContainText("$" + secondLowestPrice);
});
