const puppeteer = require('puppeteer');

class HtmlToPdf {
    constructor() {
        
    }

    async createAnySizePdfFromHtmlDynamicMultipleHeaderFooters(htmlContent, pdfEvents, pdfProperties) {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
    
        // Set PDF properties if needed
        if (pdfProperties) {
            await page.pdf({ 
                format: pdfProperties.format || 'A4',
                margin: pdfProperties.margin || { top: 10, bottom: 10, left: 10, right: 10 }
            });
        }
    
        // Add dynamic headers and footers
        for (const pdfEvent of pdfEvents) {
            if (pdfEvent.enabled && pdfEvent.location) {
                if (pdfEvent.location.toLowerCase() === 'header' && (pdfEvent.url || pdfEvent.table)) {
                    await this.insertHeader(page, pdfEvent);
                } else if (pdfEvent.location.toLowerCase() === 'footer' && (pdfEvent.url || pdfEvent.table)) {
                    await this.insertFooter(page, pdfEvent);
                }
            }
        }
    
        // Set the content for the page
        await page.setContent(htmlContent);
    
        // Create the PDF
        const pdfBuffer = await page.pdf();
    
        await browser.close();
    
        // Handle watermark and signatures
        for (const pdfEvent of pdfEvents) {
            if (pdfEvent.eventType.toLowerCase() === 'watermark') {
                // Implement watermark logic here, if needed
            } else if (pdfEvent.eventType.toLowerCase() === 'sign') {
                // Implement digital signature logic here, if needed
            }
        }
    
        return pdfBuffer; // Return the final PDF buffer
    }
    
    // Insert Header
    async insertHeader(page, pdfEvent) {
        const headerContent = pdfEvent.url || ''; // Modify this to include table or other elements
        await page.evaluate((header) => {
            const headerDiv = document.createElement('div');
            headerDiv.innerHTML = header;
            headerDiv.style.position = 'fixed';
            headerDiv.style.top = '0';
            headerDiv.style.left = '0';
            headerDiv.style.width = '100%';
            headerDiv.style.textAlign = 'center';
            headerDiv.style.backgroundColor = 'white';
            document.body.appendChild(headerDiv);
        }, headerContent);
    }
    
    // Insert Footer
    async insertFooter(page, pdfEvent) {
        const footerContent = pdfEvent.url || ''; // Modify this to include table or other elements
        await page.evaluate((footer) => {
            const footerDiv = document.createElement('div');
            footerDiv.innerHTML = footer;
            footerDiv.style.position = 'fixed';
            footerDiv.style.bottom = '0';
            footerDiv.style.left = '0';
            footerDiv.style.width = '100%';
            footerDiv.style.textAlign = 'center';
            footerDiv.style.backgroundColor = 'white';
            document.body.appendChild(footerDiv);
        }, footerContent);
    }
}
module.exports = HtmlToPdf;