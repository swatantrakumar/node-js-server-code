const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating user schema
const ThemeSettingSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    header_bg_color:String,
    header_txt_color:String,
    header_txt_hover_color:String,
    header_icon_color:String,
    header_icon_hover_color:String,
    btn_color:String,
    btn_hover_color:String,
    footer_bg:String,
    theme_color:String,
    active_bg_color:String,
    popup_header_bg:String,
    form_label_bg:String,
    txtColor:String,
});

// Combine the base entity schema with the user schema
const ThemeSetting =  mongoose.model('ThemeSetting', ThemeSettingSchema,'app_theme_setting');

// Extend the User model with methods from the base entity
// User.prototype = Object.assign(User.prototype, BaseEntity);

module.exports = ThemeSetting;