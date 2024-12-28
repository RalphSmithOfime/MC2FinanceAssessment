const { test, expect, chromium } = require('@playwright/test');

test.setTimeout(60000); // Increase overall test timeout to 60 seconds

test.describe('View Token and Data Accuracy Tests', () => {
  const tokens = [
    { 
      name: 'Bitcoin', 
      symbol: 'BTC', 
      selector: '#content-area > div > main > section > div > div > div.strategy-region.transparent-scrollbar > div > div > div:nth-child(2)',
      expectedUrl: 'https://app.mc2.fi/tokens/BTC-afabe7',
      mobulaUrl: 'https://mobula.io/asset/bitcoin',
      mobulaSelector: 'p.text-light-font-100.dark\\:text-dark-font-100.text-lg.lg\\:text-base.font-medium.mr-\\[5px\\].hidden.lg\\:flex:has-text("Bitcoin")',
      mc2PriceSelector: '#content-area > div > main > section > div > section > div.w-full.order-1.lg\\:col-span-3 > div > div:nth-child(3) > div.text-main.font-semibold.break-words.text-3xl > div > span',
      mobulaPriceSelector: 'p.cursor-default.text-light-font-100.dark\\:text-dark-font-100.mr-2\\.5.flex.font-medium.text-3xl.lg\\:text-xl.md\\:text-xl:has-text("$")'
    },
    { 
      name: 'Ethereum', 
      symbol: 'ETH', 
      selector: '#content-area > div > main > section > div > div > div.strategy-region.transparent-scrollbar > div > div > div:nth-child(4)',
      expectedUrl: 'https://app.mc2.fi/tokens/ETH-f7c17e',
      mobulaUrl: 'https://mobula.io/asset/ethereum',
      mobulaSelector: 'p.text-light-font-100.dark\\:text-dark-font-100.text-lg.lg\\:text-base.font-medium.mr-\\[5px\\].hidden.lg\\:flex:has-text("Ethereum")',
      mc2PriceSelector: '#content-area > div > main > section > div > section > div.w-full.order-1.lg\\:col-span-3 > div > div:nth-child(3) > div.text-main.font-semibold.break-words.text-3xl > div > span',
      mobulaPriceSelector: 'p.cursor-default.text-light-font-100.dark\\:text-dark-font-100.mr-2\\.5.flex.font-medium.text-3xl.lg\\:text-xl.md\\:text-xl:has-text("$")'
    },
    { 
      name: 'XRP', 
      symbol: 'XRP', 
      selector: '#content-area > div > main > section > div > div > div.strategy-region.transparent-scrollbar > div > div > div:nth-child(8)',
      expectedUrl: 'https://app.mc2.fi/tokens/XRP-af9974',
      mobulaUrl: 'https://mobula.io/asset/xrp',
      mobulaSelector: 'p.text-light-font-100.dark\\:text-dark-font-100.text-lg.lg\\:text-base.font-medium.mr-\\[5px\\].hidden.lg\\:flex:has-text("XRP")',
      mc2PriceSelector: '#content-area > div > main > section > div > section > div.w-full.order-1.lg\\:col-span-3 > div > div:nth-child(3) > div.text-main.font-semibold.break-words.text-3xl > div > span',
      mobulaPriceSelector: 'p.cursor-default.text-light-font-100.dark\\:text-dark-font-100.mr-2\\.5.flex.font-medium.text-3xl.lg\\:text-xl.md\\:text-xl:has-text("$")'
    },
  ];

  const normalizePrice = (priceText) => {
    // Remove any non-numeric characters, including '$' and commas
    const cleanedPriceText = priceText.replace(/[^0-9.,KMB]/g, '');
    const suffix = cleanedPriceText.slice(-1).toUpperCase();
    const basePrice = parseFloat(cleanedPriceText.slice(0, -1).replace(/,/g, ''));

    switch (suffix) {
      case 'K': return basePrice * 1000;
      case 'M': return basePrice * 1000000;
      case 'B': return basePrice * 1000000000;
      default: return basePrice;
    }
  };

  tokens.forEach(({ name, selector, expectedUrl, mobulaUrl, mobulaSelector, mc2PriceSelector, mobulaPriceSelector }) => {
    test(`Test View Token and Data Accuracy - ${name}`, async ({ page }) => {
      const browser = await chromium.launch({ headless: false, slowMo: 100 }); // Debugging mode
      const context = await browser.newContext();
      const newPage = await context.newPage();

      console.log(`[Step 1] Navigating to the tokens list page...`);
      await newPage.goto('https://app.mc2.fi/tokens', { timeout: 60000, waitUntil: 'domcontentloaded' });

      console.log(`[Step 2] Waiting for selector for "${name}"...`);
      await newPage.waitForSelector(selector, { timeout: 15000 });
      console.log(`[Step 2] Found selector for "${name}". Clicking...`);

      await newPage.locator(selector).scrollIntoViewIfNeeded();
      await newPage.locator(selector).click();

      console.log(`[Step 3] Verifying navigation to the token page for "${name}"...`);
      await newPage.waitForTimeout(3000);
      const currentUrl = newPage.url();
      console.log(`Redirected to: ${currentUrl}`);
      expect(currentUrl).toBe(expectedUrl);

      console.log(`[Step 4] Validating data on MC2 for "${name}"...`);
      const mc2Name = await newPage.locator(`div.text-main.font-semibold.break-words.text-xl:has-text("${name}")`).textContent();
      console.log(`MC2 Name: ${mc2Name}`);
      expect(mc2Name).toBe(name);

      console.log(`[Step 5] Extracting price from MC2 for "${name}"...`);
      const mc2PriceText = await newPage.locator(mc2PriceSelector).textContent();
      console.log(`Raw MC2 Price Text: ${mc2PriceText}`);
      const mc2Price = normalizePrice(mc2PriceText);
      console.log(`Normalized MC2 Price: ${mc2Price}`);

      console.log(`[Step 6] Navigating to Mobula for "${name}"...`);
      const mobulaPage = await context.newPage();
      await mobulaPage.goto(mobulaUrl, { timeout: 60000, waitUntil: 'domcontentloaded' });

      console.log(`[Step 7] Extracting data from Mobula for "${name}"...`);
      const mobulaName = await mobulaPage.locator(mobulaSelector).textContent();
      console.log(`Mobula Name: ${mobulaName}`);
      expect(mobulaName).toBe(name);

      console.log(`[Step 8] Extracting price from Mobula for "${name}"...`);
      const mobulaPriceText = await mobulaPage.locator(mobulaPriceSelector).textContent();
      console.log(`Raw Mobula Price Text: ${mobulaPriceText}`);
      const mobulaPrice = parseFloat(mobulaPriceText.replace(/[$,]/g, ''));
      console.log(`Parsed Mobula Price: ${mobulaPrice}`);

      console.log(`[Step 9] Comparing prices for "${name}"...`);
      const priceDifference = Math.abs(mc2Price - mobulaPrice);
      const allowedDifference = 0.05 * mc2Price; // 5% tolerance
      console.log(`Price Difference: ${priceDifference}, Allowed Difference: ${allowedDifference}`);
      expect(priceDifference).toBeLessThanOrEqual(allowedDifference);

      console.log(`[Step 10] Validation for "${name}" completed successfully!`);

      await browser.close();
    });
  });
});
