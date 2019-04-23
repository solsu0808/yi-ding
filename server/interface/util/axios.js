const axios = require('axios')

const instance = axios.create({
  baseURL:`http://${process.env.HOST||'127.0.0.1'}:${process.env.PORT||3000}`,
  timeout: 3000
})

module.exports =  instance
