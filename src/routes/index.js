import puppeteer from 'puppeteer'
import { Router } from 'express'
import Crawler from '../controllers/Crawler/Crawler.js'

const router = Router()

router.get('/', (req, res) => {
    res.json({ message: 'API is running 🚀' })
})
router.get('/run', async (req, res) => {
    const street = 'הרכסים'
    const buildingNumber = '31'

    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()

    const crawler = new Crawler(browser, page)

    await crawler.goToWebsite(
        'https://handasa.ramat-gan.muni.il/iturbakashot/?search_radio=C_RequestByAddressGRP'
    )
    try {
        await crawler.moveToAddressInfo(street, buildingNumber)

        await page.waitForSelector('table', {
            visible: true,
            timeout: 10000,
        })

        const linksElementsToDocs = await crawler.getLinksElementsToDocs()
        if (linksElementsToDocs.length === 0) {
            throw new Error('no_data')
        }

        const data = []
        for (const numberLink of linksElementsToDocs) {
            await crawler.goToNumberLink(numberLink)
            const pageTablesData = await crawler.parseTables()
            data.push(pageTablesData)
            await crawler.goBack()
        }
        console.log('dataLenght', data.length)
    } catch (error) {
        await browser.close()
        return res.status(400).json({
            message: error.message,
        })
    } finally {
        await browser.close()
    }

    res.json({ message: 'done' })
})

export default router
