const mongoose = require('mongoose')

let productSchema = mongoose.Schema({
  sellerid: String,
  pname:String,
  typeid:String,
  city:String,
  location:String,
  averagepay: String,
  img: Array,
  phone: String,
  info: String,
})

module.exports = mongoose.model('Product', productSchema,'product')
