const mongoose = require('mongoose')

let sellersSchema = mongoose.Schema({
  sellerId: String,
  pass: String
})

module.exports = mongoose.model('Seller', sellersSchema,'sellers')
