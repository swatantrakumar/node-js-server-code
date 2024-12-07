const nunjucks = require('nunjucks');

/**
 * Class to handle Nunjucks template rendering.
 */
class NunjucksWriter {
    constructor() {
        // No need for a template directory as we're using template strings directly.
        // Nunjucks will use the default configuration.
        nunjucks.configure({ autoescape: true, noCache: true });
    }

    /**
     * Get HTML content from an object using a Nunjucks template.
     * 
     * @param {Object} object - The context object to render the template.
     * @param {String} templateContent - The content of the Nunjucks template (as a string).
     * @returns {String} - The rendered HTML content.
     */
    getHtmlContentForObject(object, templateContent) {
        try {
            return this.getContentForAny(object, templateContent, 'object', 'HtmlContentForObject');
        } catch (error) {
            console.error('File writing using the Nunjucks template engine failed!', error);
            return null;
        }
    }

    /**
     * General method to get content from a template using Nunjucks.
     * 
     * @param {Object} object - The context object to render the template.
     * @param {String} templateContent - The content of the Nunjucks template.
     * @param {String} objectName - The name of the object in the context.
     * @param {String} templateName - The name of the template (for logging or debugging).
     * @returns {String} - The rendered content from the template.
     */
    getContentForAny(object, templateContent, objectName, templateName) {
        const context = {
            [objectName]: object
        };

        // Render the template using Nunjucks with the given context
        const renderedContent = nunjucks.renderString(templateContent, context);
        console.log('Writing of output to string completed successfully!');
        return renderedContent;
    }
}

module.exports = NunjucksWriter;