const mongoose = require('mongoose')


// @status: 0已关闭 1待付款 2待评价 3已完成
let orderSchema = mongoose.Schema({
  userid: String,
  sellerid: String,
  rname:String,
  phone:Number,
  rnumber: Number,
  rDate: Date,
  remark:String,
  orderid: String,
  status: Number,
  oDate: Date,
  rPrice: String
})

module.exports = mongoose.model('Order', orderSchema, 'order')
