const mongoose = require('mongoose')

let geocitySchema = mongoose.Schema({
  geoname_id: Number,
  locale_code: String,
  continent_code: String,
  continent_name: String,
  country_iso_code: String,
  country_name: String,
  subdivision_1_iso_code: String,
  subdivision_1_name: String,
  city_name: String,
  is_in_european_union: Number
})

module.exports = mongoose.model('Geocity', geocitySchema,'geocity')
