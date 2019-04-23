const mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true
  },
  pass: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('User', userSchema)
