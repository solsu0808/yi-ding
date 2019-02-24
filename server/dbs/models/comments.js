const mongoose = require('mongoose')

let commentsSchema = mongoose.Schema({
  orderid: String,
  info: String,
  star: Number,
  userid: String,
  sellerid: String,
  ctime: Date,
  reply: String,
  rtime: Date
})

module.exports = mongoose.model('Comment', commentsSchema,'comments')
