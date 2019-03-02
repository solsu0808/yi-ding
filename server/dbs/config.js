module.exports = {
  mongo: 'mongodb://127.0.0.1:27017/yiding',
  redis: {
    get host(){
      return '127.0.0.1'
    },
    get port(){
      return 6379
    }
  },
  smtp: {
    get host(){
      return 'smtp.qq.com'
    },
    get messenger(){
      return '849643869@qq.com'
    },
    get authorityPass(){
      return 'jnyqysvwwxrqbbhb'
      // return 'mssolyo0808'
    },
    get code(){
      return Math.random().toString(10).slice(2,6)
    },
    get expire(){
      return 10*60
    }
  }
}
