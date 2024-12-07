const templateHandler = require('../../../handler/templateHandler');
const CommonUtils = require("../../../utils/commonUtils");

const commonUtil = new CommonUtils();
class GetFormAndGridFieldsByTabIdFieldEnricher{
    async execute(applicationUser, result, kvp) {
        let objectList = [];
        try {
            let dataJson = kvp?.data;  
            let gridColumnFields = [];
            let formFields = [];
            if(dataJson && dataJson.tab){
                let tabId = dataJson.tab?._id;
                let tab = tabId ? templateHandler.tabMap.get(tabId) : {};
                let gridFields = tab?.grid?.gridColumns;               
                if(gridFields && gridFields.length > 0){
                    gridFields.forEach(field =>{
                        let obj = {};
                        obj.field_name = field.field_name;
                        obj.label = field.label;
                        obj.type = field.type;
                        obj.api_params = field.api_params;
                        obj.onchange_api_params = field.onchange_api_params;
                        gridColumnFields.push(obj);
                    })
                }            
                let userFilterFields = [];
                let fieldListByFieldName = new Map();
                if (tab.forms) {
                    tab.forms.forEach((form, key) => {
                        if (form.tableFields) {
                            form.tableFields.forEach(field => fieldListByFieldName.set(field.field_name, JSON.parse(JSON.stringify(field))));
                        }
                    });
                }
                
                if(fieldListByFieldName && fieldListByFieldName.size > 0){
                    fieldListByFieldName.forEach((value,key) =>{
                        if(value.api_params && value.onchange_api_params){
                            formFields.push(value);
                        }
                    });
                }
            }
            
            
            objectList.push(commonUtil.getResultChildObject("form_field_list",  formFields ) );
            objectList.push(commonUtil.getResultChildObject("grid_field_list",  gridColumnFields ) );
            objectList.push(commonUtil.getResultChildObject("user_filter_field_list",  this.prePareUserFieldList() ) );

      

        } catch (error) {
            console.error(error.stack)
        }
        if (Array.isArray(result.get('success'))) {
            result.get('success').push(...objectList);
        }

    }
    prePareUserFieldList(){
        let userList = [];
        let branchField = {}
        branchField.field_name = "branch._id"
        branchField.label = "Branch";
        branchField.type = "text"
        branchField.onchange_api_params = "branches";

        userList.push(branchField);
        let criteria = [];
        criteria.push("type;eq;DEPT;STATIC");
        let departmentField = {}
        departmentField.field_name = "department._id";
        departmentField.label = "Department";
        departmentField.type = "text";
        departmentField.onchange_api_params = "department_for_permission";
        departmentField.onchange_api_params_criteria = criteria;
                
        userList.push(departmentField);
        let departmentsField = {}
        departmentsField.field_name = "departments._id";
        departmentsField.label = "Department List";
        departmentsField.type = "text";
        departmentsField.onchange_api_params = "department_for_permission";
        departmentsField.onchange_api_params_criteria = criteria;

        userList.push(departmentsField);
        return userList;
    }
}
// Export the class or module
module.exports = new GetFormAndGridFieldsByTabIdFieldEnricher();