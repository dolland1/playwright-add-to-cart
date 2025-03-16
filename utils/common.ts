export async function getHighestPrice(items) {
  let highestPrice = 0;
  let highestPriceItem = 0;

  for (let i = 0; i < (await items.count()); i++) {
    const priceText = (await items.nth(i).innerText()).replace("$", "");
    const price = parseFloat(priceText);

    if (price > highestPrice) {
      highestPrice = price;
      highestPriceItem = i;
    }
  }

  return { highestPrice, highestPriceItem };
}
