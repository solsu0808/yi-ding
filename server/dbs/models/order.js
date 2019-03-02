const mongoose = require('mongoose')


// @status: 0已关闭 1待付款 2待使用 3待评价 4待商家回复 5已完成
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
