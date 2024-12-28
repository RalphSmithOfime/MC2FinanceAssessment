***View Token and Data Accuracy Test***
This repository contains a Playwright test suite that automates the process of verifying token data accuracy across two platforms, MC2Finance and Mobula. The test suite checks the following:

The accuracy of token prices and names between the MC2 and Mobula platforms.
Ensures that the price difference between MC2 and Mobula is within a specified tolerance (5%).

***Requirements***
To run the tests, you need the following:

Node.js (version 16 or later recommended)
Playwright (for browser automation)
A code editor like Visual Studio Code (optional but recommended)
Install Node.js
If you don't have Node.js installed, download and install it from the official website:

Download Node.js
Install Playwright
You need to install the Playwright testing framework:
on your teminal, type the below command 
npm install playwright

***Running the Tests***
Step 1: Clone the Repository
Clone this repository to your local machine.

git clone https://github.com/RalphSmithOfime/MC2FinanceAssessment
cd <repository_directory>
Step 2: Install Dependencies
Install Playwright and its dependencies:

npm install
This will install the necessary libraries for running the tests, including Playwright.

Step 3: Run the Tests
Once dependencies are installed, you can run the tests using the following command:

npx playwright test
The test suite will open browsers and start executing the test steps. It will validate token data across MC2 and Mobula, ensuring the correctness of the token's name and price.

***Test Workflow***
Each token (Bitcoin, Ethereum, and XRP) will go through the following steps:

Navigate to the tokens list page on MC2.
Wait for the token selector and click on the desired token.
Verify that the URL of the token page matches the expected URL for that token.
Validate that the name of the token matches the expected name on the MC2 page.
Extract and normalize the price from the MC2 page.
Navigate to the token page on Mobula.
Extract the token's name and price from the Mobula page.
Compare the prices from both platforms, allowing a 5% price difference tolerance.
Log the results and close the browsers.
Test Configuration
Tokens Tested: Bitcoin (BTC), Ethereum (ETH), XRP (XRP)
Test Timeouts: The overall test timeout is set to 60 seconds, which can be adjusted if needed.
Price Comparison Tolerance: A 5% price tolerance is allowed between MC2 and Mobula.

***Troubleshooting***
If you encounter issues running the tests, try the following:

Ensure Playwright is correctly installed: Make sure that Playwright and its dependencies are installed in your project.
Check Browser Versions: If Playwright encounters issues with the browser version, update it using npx playwright install.
Check Selector Accuracy: If any element is not being found, ensure that the selectors in the script are correct and match the current DOM structure of the pages.
Example Output
If the tests run successfully, you should see logs similar to this:

[Step 1] Navigating to the tokens list page...
[Step 2] Waiting for selector for "Bitcoin"...
[Step 2] Found selector for "Bitcoin". Clicking...
[Step 3] Verifying navigation to the token page for "Bitcoin"...
Redirected to: https://app.mc2.fi/tokens/BTC-afabe7
[Step 4] Validating data on MC2 for "Bitcoin"...
MC2 Name: Bitcoin
...
[Step 10] Validation for "Bitcoin" completed successfully!


