const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');

// Creating user schema
const PojoMasterSchema = mongoose.Schema({ 
    scope:String,
    level:String,
    type:String,
    name:String,
    field_splitter:String,
    fields_for_reference:[String],
    pick_as_string:Boolean,
    dynamic:Boolean,
    collection_prefix:String,
    collection_name:String,
    class_name:String,
    defaultSeries:String,
    series_pattern:String,
    series_on_date_field:String,
    seriesMethod:String,
    templateName:String,
    value:String,
    desc:String,
    val1:String,
    val2:String,
    val3:String,
    alt_desc:String,
    altvalue:String,
    parent_id:String,
    parent_serial:String,
    primaryKeys:[String],
    fileTypeFields:[String],
    aliasNames:[String],
    importClasses:[String],
    code_string:String,
    code_type:String,
    packagePath:String,
    imports:[String],
    defaultSortBy:{
        type:String,
        default : '-createdDate'
    },
    status_list:{
        type:Map,
        of:String
    },
    configMaster:Boolean,
    enrich_query_with:[String],
    forApproval:Boolean,
    logBookRequired:Boolean,
    mappedAttributes:[String],
    series_method:{
        type:Map,
        of:{
            type:Map,
            of:String
        }
    },
    approvalDataMappingName:String,
    on_save_methods:[{}],
    after_save_methods:[{}],
    report_collection_name:String,
    report_flag:Boolean,
    report_form_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    report_tab_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    report_grid_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    sqsFlow:Boolean,
    autoSync:Boolean
});

// Combine the base entity schema with the user schema
const PojoMaster =  mongoose.model('PojoMaster', PojoMasterSchema,'app_pojo_master');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = PojoMaster;