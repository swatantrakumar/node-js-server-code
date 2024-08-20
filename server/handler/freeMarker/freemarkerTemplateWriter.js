const nunjucks = require('nunjucks');

class FreemarkerTemplateWriter {
    async getHtmlContentForObject(object, templateContent) {
        try{
            return this.getContentForAny(object, templateContent).toString();
        }catch(e) {
            console.error("File writing using the Freemarker template engine failed!" + e);
            console.error(e.stack);
            return null;
        }
    }
    getContentForAny = async (object, templateContent) => {
        nunjucks.configure({ autoescape: true });    
        let renderedContent = '';
        try {
            renderedContent = nunjucks.renderString(templateContent, object);
            console.log('Writing of output to string completed successfully!');
        } catch (error) {
            console.error('Error processing template:', error);
            throw error;
        }    
        return renderedContent;
    };
}
module.exports = FreemarkerTemplateWriter;