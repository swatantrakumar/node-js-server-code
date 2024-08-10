const ApplicationSetting = require("../model/generic/applicationSetting");
const CollectionHandler = require("./collectionHandler");
const cacheService = require('../cache/cacheService');
const CommonUtils = require("../utils/commonUtils");
const Form = require("../model/builder/form");
const Grid = require("../model/builder/grid");
const TemplateTab = require("../model/builder/templateTab");
const Template = require("../model/builder/template");
const TypoGraphMaster = require("../model/builder/typoGraphMaster");

const collectionHandler = new CollectionHandler();
const commonUtils = new CommonUtils();

class TemplateHandler{
    constructor(){
        if (!TemplateHandler.instance) {
            this.moduleTemplateMap = new Map();
            this.templateIdMap = new Map();
            this.tabMap = new Map();
            this.tabNameMap = new Map();
            this.formMap = new Map();
            this.gridMap = new Map();
            this.chartMap = new Map();
            this.templateMap = new Map();
            this.colorMasterMap = new Map();
            TemplateHandler.instance = this;
          }
      
          return TemplateHandler.instance;
    }
    async prepareTemplates(){
        await this.prepareFieldWiseTemplates();
    }
    async prepareFieldWiseTemplates(){
        console.log("Prepare Templates got called ");
        const fieldNames = ["altname", "srNumber", "serialId", "refCode",
                "createdBy", "createdByName", "createdDate", "updatedBy", "updatedByName", "updateDate",
                "version", "status", "customEntry", "series", "migrationStatus", "migrated", "dbMigrationRemarks",
                "permission", "selected"];
        const colorMasterList = await this.getDataWithExcludeFields(TypoGraphMaster, fieldNames);
        const formList = await this.getDataWithExcludeFields(Form, fieldNames);
        const gridList = await this.getDataWithExcludeFields(Grid, fieldNames);
        const tabList = await this.getDataWithExcludeFields(TemplateTab, fieldNames);
        const templatelist = await this.getDataWithExcludeFields(Template, fieldNames);
        console.log("All Config Collections retrieved from DB");
        await this.fetchCommonModuleListFromDb();

        //--------------------------------------------------------------------------->>
        this.prepareMapForCollections(formList, gridList, this.formMap,this.gridMap);
        if(colorMasterList && Array.isArray(colorMasterList) && colorMasterList.length > 0){
            colorMasterList.forEach(color=> colorMasterMap.set(color._id,color));
        }
        try {
            this.prepareFormGridTabAndTemplate(formList, gridList, tabList, templatelist, this.moduleTemplateMap, this.templateIdMap,this.tabMap,
                this.tabNameMap,this.formMap,this.gridMap,this.chartMap,this.templateMap);
        } catch (error) {
            console.log("Error Occured while preparing Template ...{}",error?.message);
        }
    }
    async fetchCommonModuleListFromDb () {
        const applicationSettings =  await collectionHandler.findAllDocuments(ApplicationSetting);
        const commonModuleListFromDb = new Set();
        if(applicationSettings && applicationSettings.length > 0) {
            applicationSettings.forEach(applicationSetting => {
                const commonModules = applicationSetting.commonModuleList;
                if (commonModules && commonModules.length > 0) {
                    commonModules.forEach(module => {
                        commonModuleListFromDb.add(module);
                    })
                }
            });
            if (commonModuleListFromDb && commonModuleListFromDb.length > 0) {
                commonModuleListFromDb.forEach(moduleName =>{
                    cacheService.coreModuleList.add(moduleName);
                })
            }
            console.log("get module list from applicatoin setting !!!")
        }
    }
    prepareMapForCollections(formList, gridList, formMap, gridMap) {
        if(formList && formList.length > 0) formList.forEach(form => {formMap.set(form._id, form);});
        if(gridList && gridList.length > 0) gridList.forEach(grid => {gridMap.set(grid._id, grid);});
    }
    prepareFormGridTabAndTemplate(formList, gridList, tabList, templatelist, moduleTemplateMap, templateIdMap, tabMap, tabNameMap, formMap, gridMap, chartMap, templateMap){        
        console.log("Preparing Child Grid...");
        if(gridList && gridList.length > 0) this.prepareGrid(gridList.filter(grid => grid.child_grid), gridMap);
        console.log("Preparing Grid...");
        if(gridList && gridList.length > 0)  this.prepareGrid(gridList.filter(grid => !grid.child_grid), gridMap);

        console.log("Preparing Child Form...");
        if(formList && formList.length > 0) this.prepareForm(formList.filter(form => form.child_form), formMap);
        console.log("Preparing Form...");
        if(formList && formList.length > 0) this.prepareForm(formList.filter(form => !form.child_form), formMap);

        try {
            console.log("Preparing Tab...");
            if(tabList && tabList.length > 0) this.prepareTab(tabList, tabMap, tabNameMap, formMap, gridMap);
        } catch (e) {
            console.log("Error occured while prepating tabList {}",e.message );
        }
        try {
            console.log("Preparing Template...");
            if(templatelist && templatelist.length > 0) this.prepareTemplate(templatelist, templateMap, tabMap, moduleTemplateMap, templateIdMap);
        } catch (e) {
            console.log("Error occured while prepating Template {}",e.message );
        }

        console.log("Preparing Template Completed...");

    }
    prepareGrid(gridList,gridMap){
        gridList.forEach( grid => {
            if(grid){
                if(grid.fields && grid?.fields.length > 0){
                    grid['gridColumns'] = [];
                    grid.fields.forEach(field => {
                        try {
                            this.removeStringFormAndGridFromField(field);
                            const convertedField = JSON.parse(JSON.stringify(field));                        
                            if(convertedField && convertedField.grid){
                                const gridId = convertedField.grid?._id; 
                                if(gridId && gridMap.has(gridId)){
                                    const childGrid = gridMap.get(gridId);
                                    if(childGrid.gridColumns) convertedField['gridColumns'] = childGrid.gridColumns;
                                    if(childGrid.fields) convertedField['fields'] = childGrid.fields;
                                }
                            }
                            grid.gridColumns.push(convertedField);
                        }catch (e){
                            console.log("Error occured while preparing gridField {}",field);
                        }
                    });
                }
                if(grid.buttons && Array.isArray(grid.buttons) && grid.buttons.length > 0){
                    grid['action_buttons'] = [];
                    grid.buttons.forEach(button =>{
                        try {
                            const convertedField = this.getButtonFromField(button);
                            grid.action_buttons.push(convertedField);
                        }catch (e){
                            console.log("Error occured while preparing gridButton {}",button);
                        }
                    });
                }
                if(grid.colorCriteria  && Array.isArray(grid.colorCriteria) && grid.colorCriteria.length > 0){
                    grid.colorCriteria.forEach(criteria => {
                        const colorId = criteria?.colorReference?._id;
                        if(colorId && this.colorMasterMap.has(colorId)){
                            criteria['typoGraphy'] = this.colorMasterMap.get(colorId);
                        }
                    });
                }
            }
        })
    }
    prepareForm(formList, formMap) {
        formList.forEach(form => {            
            if(form.field){
                form['tableFields'] = [];
                if(Array.isArray(form.field) && form.field.length > 0){
                    form.fields.forEach(field=>{
                        try {
                            this.removeStringFormAndGridFromField(field);
                            const convertedField = this.getButtonFromField(field);
                            if(convertedField && convertedField.form){
                                const formId = convertedField?.form?._id;
                                if(formId && formMap.has(formId)){
                                    const childForm = formMap.get(formId);
                                    if(childForm.tableFields) convertedField['list_of_fields'] = childForm.tableFields;
                                    if(childForm.fields) convertedField['fields'] = childForm.fields;
                                }
                            }
                            if(convertedField && convertedField.grid){
                                const gridId = convertedField.grid?._id; 
                                if(gridId && gridMap.has(gridId)){
                                    const childGrid = gridMap.get(gridId);
                                    if(childGrid.gridColumns) convertedField['gridColumns'] = childGrid.gridColumns;
                                    if(childGrid.fields) convertedField['fields'] = childGrid.fields;
                                    if(childGrid.fields) convertedField['colorCriteria'] = childGrid.colorCriteria;
                                }
                            }
                            form.tableFields.push(convertedField);
                        }catch (e){
                            console.log("Error while enriching form {}:{}:{}",form._id,form.name, field);
                            console.log("Error occured while form Button {}",field);
                        }
                    });
                }
            }
            if(form.buttons){
                form['tab_list_buttons'] = [];
                if(Array.isArray(form.buttons) && form.buttons.length > 0){
                    form.buttons.forEach(field => {
                        try {
                            const convertedField = this.getButtonFromField(field);
                            form.tab_list_buttons.push(convertedField);
                        }catch (e){
                            console.log("Error occured while form Button {}",field);
                        }
                    });
                }
            }
        });
    }
    prepareTab(tabList, tabMap, tabNameMap, formMap, gridMap){
        tabList.forEach(tab => {
            if (tab.form_reference && tab.form_reference.size > 0) {
                tab['forms'] = new Map();
                for (const [key, form] of tab.form_reference.entries()) {                
                    try {
                        tab.forms.set(key, formMap.get(form._id));
                    }catch(e){
                        console.log("Not able to find Form for Referencing in Tab :{}, Form:{}",tab.name,form._id);
                    }
                };
            }
            if (tab.grid_reference && tab.grid_reference._id) {
                tab['grid'] = gridMap.get(tab.grid_reference._id);
            }
            tabMap.set(tab._id, tab);
            tabNameMap.set(tab.tab_name, tab);
        });
    }
    prepareTemplate(templateList, templateMap, templateTabMap, moduleTemplateMap, templateIdMap){
        templateList.forEach(template => {            
            template['templateTabs'] = [];
            if (template.tabs && template.tabs.length > 0) {
                const enrichedList = [];
                const defaultTabId = template.defaultTab ? template.defaultTab?._id : null;
                template.tabs.forEach(tab => {
                    const pickedTab = templateTabMap.get(tab._id);
                    if(defaultTabId){
                        pickedTab['defaultTemplateTab'] = true;
                    }
                    enrichedList.push(templateTabMap.get(tab._id));
                });
                template['templateTabs'] = enrichedList;
            }
            if (template.filterReference) {
                const pickedFilterTab = templateTabMap.get(template.filterReference?._id);
                if(pickedFilterTab){
                    template['filterTab'] = pickedFilterTab;
                }
            }

            templateMap.set(template.appId + "_" + template.name, template);
            moduleTemplateMap.set(template.module+"_"+template.name,template);
            templateIdMap.set(template._id,template);
        });
    }
    getButtonFromField(field){
        try {
            return JSON.parse(JSON.stringify(field));
        } catch (e){
            return null;
        }
    }
    removeStringFormAndGridFromField(field) {
        try {
            if (!field.form) delete field.form;
            if (!field.grid) delete field.grid;
            if(field.null) delete field.null;
        }catch (e){
            console.log("Error occured while removeStringFormAndGridFromField {}",field);
        }

    }
    getCoreModuleList() {
        return cacheService.coreModuleList;
    }
    getMenuWithSubMenuListForCentral(){
        return [];
    }
    async getDataWithExcludeFields(model,fields){
        let list = collectionHandler.findAllDocuments(model,commonUtils.getExcludeColumns(fields));
        return list;
    }
    getTemplate(name) {
        return this.templateMap.get(name);
    }
}

// Ensure the singleton pattern
const instance = new TemplateHandler();
Object.freeze(instance);
  
module.exports = instance;
// module.exports = TemplateHandler;