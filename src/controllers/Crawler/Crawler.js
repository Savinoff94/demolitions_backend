import puppeteer from 'puppeteer';

class Crawler {
    constructor(browser, page) {
        this.browser = browser;
        this.page = page;
    }

    goToWebsite = async (url) => {
        await this.page.goto(url, {
            waitUntil: 'networkidle2',
        });
    }

    moveToAddressInfo = async (street, buildingNumber) => {
        // select search by building address
        await this.page.click("#optAddress")
        
        // Street number
        await this.page.click("#RequestStreet")
        await this.page.keyboard.type(street);
        // must select street from dropdown which open on user input
        const isStreetFound = await this.page.evaluate((street) => {
            const elements = Array.from(document.querySelectorAll('.ui-menu-item-wrapper'));
            const target = elements.find(el => el.textContent.includes(street));
            if (target) {
                target.click();
                return true;
            }
            return false;
        }, street);

        if(!isStreetFound) {
            throw new Error("cant find street")
        }

        // Building number
        await this.page.click("#RequestHouseNum")
        await this.page.keyboard.type(buildingNumber);
        
        await this.page.click("#btnShow");
    }
}

export default Crawler;