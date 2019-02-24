const mongoose = require('mongoose')

let menusSchema = mongoose.Schema({
  typeid: String,
  type: String
})

module.exports = mongoose.model('Menus', menusSchema, 'menus')
