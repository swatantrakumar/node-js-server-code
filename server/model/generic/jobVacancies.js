const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const JobVacanciesSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    department:String,
    posts:String,
    designation:String,
    job_description:String,
    qualification:String,
    work_experience:String,
});

// Combine the base entity schema with the user schema
const JobVacancies =  mongoose.model('JobVacancies', JobVacanciesSchema,'job_vacancies');

module.exports = JobVacancies;