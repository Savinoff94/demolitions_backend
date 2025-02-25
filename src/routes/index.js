import { Router } from 'express';
import Crawler from '../controllers/Crawler/Crawler.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'API is running 🚀' });
});
router.get('/run', async (req, res) => {
  
  const street = "הרכסים"
  const buildingNumber = "31"

  this.browser = await puppeteer.launch({ headless: false });
  this.page = await this.browser.newPage();

  const crawler = new Crawler(browser, page);

  await crawler.initialize()
  await crawler.goToWebsite("https://handasa.ramat-gan.muni.il/rishui-tama-38/iturbakashot/")
  try {
    await crawler.moveToAddressInfo(street, buildingNumber)
  } catch (error) {
    return res.status(400).json({ error: 'Bad Request: wrong data', message: 'Please check an address' });
  }
  
  res.json({ message: 'done' });
});

export default router;