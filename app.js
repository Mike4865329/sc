const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const url = require('url');

const app = express();

app.get('/:resolution/*', async (req, res) => {
  try {
    const { resolution } = req.params;
    const targetUrl = req.params[0];
    const [viewportWidth, viewportHeight] = resolution.split('x');

    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    await page.setViewport({
      width: parseInt(viewportWidth),
      height: parseInt(viewportHeight),
    });

    const resolvedUrl = url.resolve('https://', targetUrl);
    await page.goto(resolvedUrl);

    // Capture screenshot
    const screenshot = await page.screenshot();

    // Set response headers
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=screenshot.png');

    // Send the screenshot to the client
    res.send(screenshot);

    await browser.close();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes

    // Send error image if Puppeteer encounters an error
    res.status(500).sendFile(path.join(__dirname, '500.jpg'));
  }
});

app.listen(3000, () => {
  console.log('Puppeteer app is running on port 3000');
});
