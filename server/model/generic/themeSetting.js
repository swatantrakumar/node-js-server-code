const mongoose = require('mongoose');
const BaseEntity = require("../baseEntity");

// Creating theme setting schema
const ThemeSettingSchema = mongoose.Schema({ 
    ...BaseEntity.schema.obj,
    // Header & Navigation
    header_bg_color: String,
    header_txt_color: String,
    header_txt_hover_color: String,
    header_icon_color: String,
    header_icon_hover_color: String,
    footer_bg: String,
    theme_color: String,
    active_bg_color: String,
    sidebar_active_txt_color: String,
    sidebar_width: String,

    // Typography & Links
    font_family: String,
    font_size_base: String,
    font_size_heading: String,
    txtColor: String,
    link_color: String,
    link_hover_color: String,

    // Buttons
    btn_color: String,
    btn_hover_color: String,
    btn_txt_color: String,
    btn_hover_txt_color: String,
    btn_border_radius: String,
    btn_font_weight: String,

    // Form Inputs (Text, Select, Date, Textarea, etc.)
    input_bg: String,
    input_border_color: String,
    input_text_color: String,
    input_placeholder_color: String,
    input_focus_border_color: String,
    input_focus_shadow_color: String,
    input_border_radius: String,
    input_height: String,
    form_label_bg: String,

    // Modals & Cards
    popup_header_bg: String,
    modal_header_txt_color: String,
    modal_body_bg: String,
    modal_border_radius: String,
    card_bg: String,
    card_border_radius: String,
    card_border_color: String,
});

// Combine the base entity schema with the theme setting schema
const ThemeSetting = mongoose.model('ThemeSetting', ThemeSettingSchema, 'app_theme_setting');

module.exports = ThemeSetting;
