const mongoose = require('mongoose')

let citiesSchema = mongoose.Schema({
  id: String,
  parent_id: String,
  name: String,
  sort: String
})

module.exports = mongoose.model('Cities_cn', citiesSchema, 'cities_cn')
