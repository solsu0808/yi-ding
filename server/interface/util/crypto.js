// crypto 用于签名或加密
const crypto = require('crypto')
const KEY = "!s@o#l$y%o^0&8*0(8)..."

let myCrypto = {}

// 签名
myCrypto.sign = (id) => {
  // 签名方式
  let sign = crypto.createHmac('sha256', KEY)
  // 签名目标字符串
  sign.update(id + '')
  // 返回签名格式
  return sign.digest('hex')
}

module.exports = myCrypto
