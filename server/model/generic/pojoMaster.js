const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");
const Reference = require('../reference');
const ClassFields = require('./classFields');
const IgnoreNull = require('../ignoreNull');

// Creating user schema
const PojoMasterSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    scope:String,
    level:String,
    type:String,
    name:String,
    field_splitter:String,
    fields_for_reference:{type:[String],default:undefined},
    pick_as_string:{type:Boolean,default:false},
    dynamic:{type:Boolean,default:false},
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
    primaryKeys:{type:[String],default:undefined},
    fileTypeFields:{type:[String],default:undefined},
    aliasNames:{type:[String],default:undefined},
    importClasses:{type:[String],default:undefined},
    code_string:String,
    code_type:String,
    packagePath:String,
    class_fields:{type:[ClassFields],default:undefined},
    listOfVariables:{type:[ClassFields],default:undefined},
    // fetch_criterias:[PojoFetchCriteria],
    imports:{type:[String],default:undefined},
    defaultSortBy:{
        type:String,
        default : '-createdDate'
    },
    status_list:{
        type:Map,
        of:String
    },
    configMaster:{type:Boolean,default:false},
    enrich_query_with:{type:[String],default:undefined},
    forApproval:{type:Boolean,default:false},
    logBookRequired:{type:Boolean,default:false},
    mappedAttributes:{type:[String],default:undefined},
    series_method:{
        type:Map,
        of:{
            type:Map,
            of:String
        }
    },
    approvalDataMappingName:String,
    on_save_methods:{type:[{}],default:undefined},
    after_save_methods:{type:[{}],default:undefined},
    report_collection_name:String,
    report_flag:{type:Boolean,default:false},
    report_form_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    report_tab_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    report_grid_name:{ type: mongoose.Schema.Types.ObjectId, ref: 'Reference' },
    sqsFlow:{type:Boolean,default:false},
    autoSync:{type:Boolean,default:false}
});

IgnoreNull(PojoMasterSchema);

// Combine the base entity schema with the user schema
const PojoMaster =  mongoose.model('PojoMaster', PojoMasterSchema,'app_pojo_master');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = PojoMaster;