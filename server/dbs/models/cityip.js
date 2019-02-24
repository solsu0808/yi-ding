const mongoose = require('mongoose')

let cityipSchema = mongoose.Schema({
  startIp: String,
  endIp: String,
  province: String,
  city: String
})

module.exports = mongoose.model('Cityip', cityipSchema,'cityip')
