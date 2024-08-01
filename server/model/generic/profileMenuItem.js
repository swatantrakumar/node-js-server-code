const mongoose = require('mongoose');

const ProfileMenuItem = mongoose.Schema({
      value:String,
      label:String
});

module.exports = ProfileMenuItem;